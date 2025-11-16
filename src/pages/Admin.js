// pages/UniversalAdmin.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  FaSync,
  FaEye,
  FaDownload,
  FaSearch,
  FaFilter,
  FaUsers,
  FaCamera,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
} from "react-icons/fa";
import Loading from "../components/Loading";
import "./Admin.css";

const UniversalAdmin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedEmailItem, setSelectedEmailItem] = useState(null);
  const [emailSending, setEmailSending] = useState(false);
  const [dataType, setDataType] = useState("membership");
  const [connectionTest, setConnectionTest] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { user } = useAuth();

  // URLs for different data types - MAKE SURE THESE ARE CORRECT
  const SCRIPTS = {
    membership:
      "https://script.google.com/macros/s/AKfycbwf_UmVAhpw7_y9RXbLartxhOwRFZhAg9KMqw4q1wvNTE1DQM_Qq_ryPLAnRWkM25Yd/exec",
    photos:
      "https://script.google.com/macros/s/AKfycbw4Jg_fVbBYEkHznAn9P3RNtxSBWeiUDVZIF3AM8VhkKHT3GEifO-tEWECEh918PSMJ/exec",
    email:
      "https://script.google.com/macros/s/AKfycbzjy8Qqaw56eQyPn-gyDwDA4R6aHGkOoVI2Y3-ogcSSINGlTBNJwWYs5zZ98PWgtX4h/exec",
  };

  // Email templates for photo submissions
  const EMAIL_TEMPLATES = {
    confirmation: {
      subject: "Photo Submission Confirmation - UIU Photography Club",
      body: `Dear {name},

Thank you for submitting your photos to the Shutter Stories Chapter IV. We have successfully received your submission.

Submission Details:
- Name: {name}
- Email: {email}
- Category: {category}
- Total Photos Submitted: {photoCount} (Main) + {storyPhotoCount} (Story)

Best regards,
UIU Photography Club
photographyclub@dccsa.uiu.ac.bd`,
    },
    renameRequest: {
      subject: "Action Required: Rename Your Photos - UIU Photography Club",
      body: `Dear {name},

We have received your photo submission for the Shutter Stories Chapter IV. However, we noticed that your photos have not been properly renamed according to our submission guidelines.

Submission Guidelines:
- Photos must be renamed in this format: "Institution Name_Participant's name_Category_Mobile no_Serial no"
- For example: "UIU_Ahmad Hasan_Single_0162#######_01"

Please rename your photos and resubmit them as soon as possible. Submissions with improperly named photos may be disqualified.

If you have any questions, please don't hesitate to contact us.

Best regards,
UIU Photography Club
photographyclub@dccsa.uiu.ac.bd`,
    },
    general: {
      subject: "Regarding Your Photo Submission - UIU Photography Club",
      body: `Dear {name},

Thank you for your interest in the Shutter Stories Chapter IV.

We have reviewed your submission and would like to inform you that {custom_message}.

If you have any questions, please feel free to contact us.

Best regards,
UIU Photography Club
photographyclub@dccsa.uiu.ac.bd`,
    },
  };

  // Test email script connection
  const testEmailConnection = async () => {
    try {
      console.log("Testing email script connection...");
      setConnectionTest({ status: 'testing', message: 'Testing connection...' });
      
      const response = await fetch(`${SCRIPTS.email}?action=testConnection`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log("Connection test response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Connection test result:", result);

      if (result.status === 'success') {
        setConnectionTest({ status: 'success', message: 'Email service is connected and working!' });
      } else {
        throw new Error(result.data || 'Connection test failed');
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      setConnectionTest({ 
        status: 'error', 
        message: `Failed to connect: ${error.message}. Please check: 1) Script URL is correct, 2) Script is deployed as web app, 3) Execute permissions are set to "Anyone"` 
      });
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching ${dataType} data...`);

      const action = dataType === "membership" ? "getApplications" : "getSubmissions";
      const response = await fetch(`${SCRIPTS[dataType]}?action=${action}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`${dataType} data response:`, result);

      if (result.status === "success" || result.success) {
        const dataArray = result.data || result.submissions || [];
        const sortedData = dataArray.sort(
          (a, b) =>
            new Date(b.Timestamp || b.timestamp || b["Timestamp"]) -
            new Date(a.Timestamp || a.timestamp || a["Timestamp"])
        );
        setData(sortedData);
        setCurrentPage(1);
      } else {
        throw new Error(result.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error(`Error fetching ${dataType} data:`, error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataType]);

  // Test email connection on component mount
  useEffect(() => {
    testEmailConnection();
  }, []);

  // Safe string conversion helper
  const safeToString = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    return String(value);
  };

  // Filter data based on type
  const filteredData = data.filter((item) => {
    if (dataType === "membership") {
      const name = safeToString(item["Full Name"] || item.name);
      const email = safeToString(item.Email || item.email);
      const studentId = safeToString(item["Student ID"] || item.studentId);
      const department = safeToString(item.Department || item.department);
      const status = safeToString(item.Status || item.status || "pending");

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "pending" && (!status || status === "pending")) ||
        (filterStatus === "approved" && status === "approved") ||
        (filterStatus === "rejected" && status === "rejected");

      return matchesSearch && matchesStatus;
    } else {
      const name = safeToString(item["Name"] || item["Full Name"] || item.name);
      const email = safeToString(item["Email"] || item.email);
      const phone = safeToString(item["Phone"] || item.phone);
      const institution = safeToString(item["Institution"] || item.institution);
      const status = safeToString(item["Status"] || item.status || "IN_PROGRESS");

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        status.toLowerCase().includes(filterStatus.toLowerCase());

      return matchesSearch && matchesStatus;
    }
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const handleEmailReply = (item) => {
    setSelectedEmailItem(item);
    setShowEmailModal(true);
  };

  const sendEmail = async (templateType, customMessage = "") => {
    if (!selectedEmailItem) return;

    try {
      setEmailSending(true);

      const recipientEmail = getProperty(selectedEmailItem, "Email");
      const recipientName = getProperty(selectedEmailItem, "Name");

      let subject = EMAIL_TEMPLATES[templateType].subject;
      let body = EMAIL_TEMPLATES[templateType].body;

      // Replace template variables
      body = body
        .replace(/{name}/g, recipientName)
        .replace(/{email}/g, recipientEmail)
        .replace(/{category}/g, getProperty(selectedEmailItem, "Category"))
        .replace(/{photoCount}/g, getProperty(selectedEmailItem, "Photo Count"))
        .replace(
          /{storyPhotoCount}/g,
          getProperty(selectedEmailItem, "Story Photo Count")
        )
        .replace(/{custom_message}/g, customMessage);

      console.log("Sending email with params:", {
        recipientEmail,
        subject,
        bodyLength: body.length,
        sentBy: user.email
      });

      // Use GET request with URL parameters as fallback
      const params = new URLSearchParams({
        action: "sendEmail",
        recipientEmail: recipientEmail,
        subject: subject,
        body: body,
        sentBy: user.email,
        submissionId: selectedEmailItem.Timestamp || selectedEmailItem.timestamp || selectedEmailItem["Timestamp"],
        type: dataType,
      });

      const response = await fetch(`${SCRIPTS.email}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log("Email response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Email response data:", result);

      if (result.status === "success") {
        alert("Email sent successfully!");
        setShowEmailModal(false);
        setSelectedEmailItem(null);
        // Retest connection after successful send
        testEmailConnection();
      } else {
        throw new Error(result.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      
      let errorMessage = "Failed to send email: ";
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage += "Network error - Cannot connect to email service. Please check the script URL and deployment settings.";
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    } finally {
      setEmailSending(false);
    }
  };

  const handleUpdateStatus = async (item, newStatus) => {
    try {
      const response = await fetch(SCRIPTS[dataType], {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "updateStatus",
          applicationId: item.Timestamp || item.timestamp,
          status: newStatus,
          updatedBy: user.email,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        fetchData();
      } else {
        throw new Error(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status: " + error.message);
    }
  };

  const exportToCSV = () => {
    let headers, csvData;

    if (dataType === "membership") {
      headers = [
        "Timestamp",
        "Full Name",
        "Student ID",
        "Email",
        "Department",
        "Phone",
        "Experience Level",
        "Interests",
        "Payment Method",
        "Status",
      ];

      csvData = filteredData.map((item) => [
        item.Timestamp || item.timestamp,
        safeToString(item["Full Name"] || item.name),
        safeToString(item["Student ID"] || item.studentId),
        safeToString(item.Email || item.email),
        safeToString(item.Department || item.department),
        safeToString(item.Phone || item.phone),
        safeToString(item["Experience Level"] || item.experience),
        safeToString(item.Interests || item.interests),
        safeToString(item["Payment Method"] || item.paymentMethod),
        safeToString(item.Status || item.status || "pending"),
      ]);
    } else {
      headers = [
        "Timestamp",
        "Name",
        "Email",
        "Phone",
        "Institution",
        "Category",
        "Photo Count",
        "Story Photo Count",
        "Photo Names",
        "Story Photo Names",
        "Folder URL",
        "Status",
      ];

      csvData = filteredData.map((item) => [
        item.Timestamp || item.timestamp || item["Timestamp"],
        safeToString(item["Name"] || item.name || item["Full Name"]),
        safeToString(item["Email"] || item.email),
        safeToString(item["Phone"] || item.phone),
        safeToString(item["Institution"] || item.institution),
        safeToString(item["Category"] || item.category),
        safeToString(item["Photo Count"] || item.photoCount),
        safeToString(item["Story Photo Count"] || item.storyPhotoCount),
        safeToString(item["Photo Names"] || item.photoNames),
        safeToString(item["Story Photo Names"] || item.storyPhotoNames),
        safeToString(item["Folder URL"] || item.folderUrl),
        safeToString(item["Status"] || item.status),
      ]);
    }

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((field) => `"${field}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uiu-${dataType}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    const actualStatus = safeToString(status || "pending");
    const statusConfig = {
      approved: { class: "status-approved", text: "Approved" },
      rejected: { class: "status-rejected", text: "Rejected" },
      pending: { class: "status-pending", text: "Pending" },
      COMPLETED: { class: "status-approved", text: "Completed" },
      REJECTED: { class: "status-rejected", text: "Rejected" },
      IN_PROGRESS: { class: "status-pending", text: "In Progress" },
    };

    const config = statusConfig[actualStatus] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>{config.text}</span>
    );
  };

  const getProperty = (item, property) => {
    const possibleKeys = [
      property,
      property.toLowerCase(),
      property.toUpperCase(),
      property.replace(/\s+/g, ""),
      property.replace(/\s+/g, "").toLowerCase(),
      property.replace(/\s+/g, "").toUpperCase(),
    ];

    for (const key of possibleKeys) {
      if (item[key] !== undefined && item[key] !== null && item[key] !== "") {
        return safeToString(item[key]);
      }
    }

    return "N/A";
  };

  const renderTableHeaders = () => {
    if (dataType === "membership") {
      return (
        <tr>
          <th>Timestamp</th>
          <th>Full Name</th>
          <th>Student ID</th>
          <th>Department</th>
          <th>Experience Level</th>
          <th>Payment Method</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      );
    } else {
      return (
        <tr>
          <th>Timestamp</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Institution</th>
          <th>Category</th>
          <th>Photos</th>
          <th>Folder</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      );
    }
  };

  const renderTableRow = (item, index) => {
    if (dataType === "membership") {
      return (
        <tr key={index} className="application-row">
          <td className="timestamp">
            {new Date(item.Timestamp || item.timestamp).toLocaleDateString()}
          </td>
          <td className="name">{getProperty(item, "Full Name")}</td>
          <td className="student-id">{getProperty(item, "Student ID")}</td>
          <td className="department">{getProperty(item, "Department")}</td>
          <td className="experience">
            {getProperty(item, "Experience Level")}
          </td>
          <td className="payment-method">
            {getProperty(item, "Payment Method")}
          </td>
          <td className="status">
            {getStatusBadge(item.Status || item.status)}
          </td>
          <td className="actions">
            <button
              onClick={() => handleViewDetails(item)}
              className="btn-view"
              title="View Details"
            >
              <FaEye />
            </button>
            {(!item.Status || item.Status === "pending") && (
              <div className="status-actions">
                <button
                  onClick={() => handleUpdateStatus(item, "approved")}
                  className="btn-approve"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(item, "rejected")}
                  className="btn-reject"
                >
                  Reject
                </button>
              </div>
            )}
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={index} className="application-row">
          <td className="timestamp">
            {new Date(
              item.Timestamp || item.timestamp || item["Timestamp"]
            ).toLocaleDateString()}
          </td>
          <td className="name">{getProperty(item, "Name")}</td>
          <td className="email">{getProperty(item, "Email")}</td>
          <td className="phone">{getProperty(item, "Phone")}</td>
          <td className="institution">{getProperty(item, "Institution")}</td>
          <td className="category">{getProperty(item, "Category")}</td>
          <td className="photo-count">
            {getProperty(item, "Photo Count")} /{" "}
            {getProperty(item, "Story Photo Count")}
          </td>
          <td className="folder-url">
            {getProperty(item, "Folder URL") &&
            getProperty(item, "Folder URL") !== "N/A" ? (
              <a
                href={getProperty(item, "Folder URL")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-view"
                title="Open Folder"
              >
                <FaExternalLinkAlt />
              </a>
            ) : (
              "N/A"
            )}
          </td>
          <td className="status">
            {getStatusBadge(item.Status || item.status)}
          </td>
          <td className="actions">
            <button
              onClick={() => handleViewDetails(item)}
              className="btn-view"
              title="View Details"
            >
              <FaEye />
            </button>
            <button
              onClick={() => handleEmailReply(item)}
              className="btn-email"
              title="Send Email"
              disabled={connectionTest?.status === 'error'}
            >
              <FaEnvelope />
            </button>
          </td>
        </tr>
      );
    }
  };

  const renderModalDetails = () => {
    if (!selectedItem) return null;

    if (dataType === "membership") {
      return (
        <div className="details-grid">
          <div className="detail-group">
            <label>Name:</label>
            <span>{getProperty(selectedItem, "Full Name")}</span>
          </div>
          <div className="detail-group">
            <label>Student ID:</label>
            <span>{getProperty(selectedItem, "Student ID")}</span>
          </div>
          <div className="detail-group">
            <label>Email:</label>
            <span>{getProperty(selectedItem, "Email")}</span>
          </div>
          <div className="detail-group">
            <label>Phone:</label>
            <span>{getProperty(selectedItem, "Phone") || "Not provided"}</span>
          </div>
          <div className="detail-group">
            <label>Department:</label>
            <span>{getProperty(selectedItem, "Department")}</span>
          </div>
          <div className="detail-group">
            <label>Experience Level:</label>
            <span>{getProperty(selectedItem, "Experience Level")}</span>
          </div>
          <div className="detail-group">
            <label>Interests:</label>
            <span>{getProperty(selectedItem, "Interests")}</span>
          </div>
          <div className="detail-group">
            <label>Payment Method:</label>
            <span>{getProperty(selectedItem, "Payment Method")}</span>
          </div>
          <div className="detail-group full-width">
            <label>Why they want to join:</label>
            <p>{getProperty(selectedItem, "Message")}</p>
          </div>
          <div className="detail-group">
            <label>Submitted:</label>
            <span>
              {new Date(
                selectedItem.Timestamp || selectedItem.timestamp
              ).toLocaleString()}
            </span>
          </div>
          <div className="detail-group">
            <label>Current Status:</label>
            <span>{getStatusBadge(getProperty(selectedItem, "Status"))}</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="details-grid">
          <div className="detail-group">
            <label>Timestamp:</label>
            <span>
              {new Date(
                selectedItem.Timestamp ||
                  selectedItem.timestamp ||
                  selectedItem["Timestamp"]
              ).toLocaleString()}
            </span>
          </div>
          <div className="detail-group">
            <label>Name:</label>
            <span>{getProperty(selectedItem, "Name")}</span>
          </div>
          <div className="detail-group">
            <label>Email:</label>
            <span>{getProperty(selectedItem, "Email")}</span>
          </div>
          <div className="detail-group">
            <label>Phone:</label>
            <span>{getProperty(selectedItem, "Phone")}</span>
          </div>
          <div className="detail-group">
            <label>Institution:</label>
            <span>{getProperty(selectedItem, "Institution")}</span>
          </div>
          <div className="detail-group">
            <label>Category:</label>
            <span>{getProperty(selectedItem, "Category")}</span>
          </div>
          <div className="detail-group">
            <label>Photo Count:</label>
            <span>{getProperty(selectedItem, "Photo Count")}</span>
          </div>
          <div className="detail-group">
            <label>Story Photo Count:</label>
            <span>{getProperty(selectedItem, "Story Photo Count")}</span>
          </div>
          <div className="detail-group full-width">
            <label>Photo Names:</label>
            <p>{getProperty(selectedItem, "Photo Names")}</p>
          </div>
          <div className="detail-group full-width">
            <label>Story Photo Names:</label>
            <p>{getProperty(selectedItem, "Story Photo Names")}</p>
          </div>
          <div className="detail-group full-width">
            <label>Folder URL:</label>
            {getProperty(selectedItem, "Folder URL") &&
            getProperty(selectedItem, "Folder URL") !== "N/A" ? (
              <a
                href={getProperty(selectedItem, "Folder URL")}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--uiu-orange)", wordBreak: "break-all" }}
              >
                {getProperty(selectedItem, "Folder URL")}
              </a>
            ) : (
              <span>N/A</span>
            )}
          </div>
          <div className="detail-group">
            <label>Status:</label>
            <span>{getStatusBadge(getProperty(selectedItem, "Status"))}</span>
          </div>
        </div>
      );
    }
  };

  const renderEmailModal = () => {
    if (!selectedEmailItem) return null;

    const recipientName = getProperty(selectedEmailItem, "Name");
    const recipientEmail = getProperty(selectedEmailItem, "Email");

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Send Email to Participant</h3>
            <button
              onClick={() => {
                setShowEmailModal(false);
                setSelectedEmailItem(null);
              }}
              className="modal-close"
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            <div className="email-recipient-info">
              <p>
                <strong>To:</strong> {recipientName} ({recipientEmail})
              </p>
            </div>

            {connectionTest?.status === 'error' && (
              <div className="error-message" style={{ marginBottom: '1rem' }}>
                <p><strong>Email Service Issue:</strong> {connectionTest.message}</p>
                <button 
                  onClick={testEmailConnection}
                  className="btn-secondary"
                  style={{ marginTop: '0.5rem' }}
                >
                  Retest Connection
                </button>
              </div>
            )}

            <div className="email-templates">
              <h4>Select Email Template:</h4>

              <div className="email-template-option">
                <button
                  onClick={() => sendEmail("confirmation")}
                  className="btn-primary email-template-btn"
                  disabled={emailSending || connectionTest?.status === 'error'}
                >
                  Send Confirmation Email
                </button>
                <p className="template-description">
                  Confirms receipt of photo submission and provides basic details.
                </p>
              </div>

              <div className="email-template-option">
                <button
                  onClick={() => sendEmail("renameRequest")}
                  className="btn-primary email-template-btn"
                  disabled={emailSending || connectionTest?.status === 'error'}
                >
                  Send Rename Request
                </button>
                <p className="template-description">
                  Requests participant to rename photos according to guidelines.
                </p>
              </div>

              <div className="email-template-option">
                <div className="custom-email-section">
                  <h5>Custom Email</h5>
                  <textarea
                    placeholder="Enter your custom message here..."
                    className="custom-message-input"
                    rows="4"
                    id="customMessageInput"
                  />
                  <button
                    onClick={() => {
                      const customMessage = document.getElementById('customMessageInput')?.value || "";
                      sendEmail("general", customMessage);
                    }}
                    className="btn-secondary email-template-btn"
                    disabled={emailSending || connectionTest?.status === 'error'}
                  >
                    Send Custom Email
                  </button>
                </div>
              </div>
            </div>

            {emailSending && (
              <div className="email-sending-indicator">
                <FaSync className="spinner" />
                <span>Sending email...</span>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              onClick={() => {
                setShowEmailModal(false);
                setSelectedEmailItem(null);
              }}
              className="btn-secondary"
              disabled={emailSending}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination-container">
        <div className="pagination-info">
          Showing {indexOfFirstItem + 1}-
          {Math.min(indexOfLastItem, filteredData.length)} of{" "}
          {filteredData.length} items
        </div>
        <div className="pagination-controls">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <FaChevronLeft />
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => paginate(1)}
                className={`pagination-btn ${
                  1 === currentPage ? "active" : ""
                }`}
              >
                1
              </button>
              {startPage > 2 && (
                <span className="pagination-ellipsis">...</span>
              )}
            </>
          )}

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`pagination-btn ${
                number === currentPage ? "active" : ""
              }`}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="pagination-ellipsis">...</span>
              )}
              <button
                onClick={() => paginate(totalPages)}
                className={`pagination-btn ${
                  totalPages === currentPage ? "active" : ""
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Admin Panel</h1>
        <p>
          Manage{" "}
          {dataType === "membership"
            ? "Membership Applications"
            : "Photo Submissions"}
        </p>
      </div>

      <div className="container">
        <div className="admin-content">
          {/* Connection Test Status */}
          {connectionTest && (
            <div className={`connection-test ${connectionTest.status}`}>
              <div className="test-status">
                <strong>Email Service Status:</strong> {connectionTest.message}
              </div>
              <button 
                onClick={testEmailConnection}
                className="btn-secondary"
                style={{ marginLeft: '1rem' }}
              >
                <FaSync /> Test Again
              </button>
            </div>
          )}

          {/* Data Type Selector */}
          <div className="data-type-selector">
            <button
              className={`type-btn ${
                dataType === "membership" ? "active" : ""
              }`}
              onClick={() => setDataType("membership")}
            >
              <FaUsers /> Membership Applications
            </button>
            <button
              className={`type-btn ${dataType === "photos" ? "active" : ""}`}
              onClick={() => setDataType("photos")}
            >
              <FaCamera /> Photo Submissions
            </button>
          </div>

          {/* Debug Info */}
          <div className="debug-info">
            <strong>Debug Info:</strong>
            Data Type: {dataType} | Total: {data.length} | Filtered:{" "}
            {filteredData.length} | Error: {error ? "Yes" : "No"} | Page:{" "}
            {currentPage} of {totalPages} | Email Service: {connectionTest?.status || 'Testing...'}
          </div>

          {/* Welcome Message */}
          <div className="admin-welcome">
            <p>
              Welcome, <strong>{user.email}</strong>
            </p>
            <p>
              Total {dataType === "membership" ? "Applications" : "Submissions"}
              : <strong>{data.length}</strong>
            </p>
            <p>
              Showing: <strong>{filteredData.length}</strong> items
            </p>
          </div>

          {/* Controls */}
          <div className="admin-controls">
            <div className="search-filter-container">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder={
                    dataType === "membership"
                      ? "Search by name, email, student ID..."
                      : "Search by name, email, phone, institution..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-controls">
                <FaFilter className="filter-icon" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="status-filter"
                >
                  <option value="all">All Status</option>
                  {dataType === "membership" ? (
                    <>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </>
                  ) : (
                    <>
                      <option value="completed">Completed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="rejected">Rejected</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="action-buttons">
              <button
                onClick={fetchData}
                className="btn-secondary refresh-btn"
                disabled={loading}
              >
                <FaSync className={loading ? "spinner" : ""} />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className="btn-primary export-btn"
                disabled={filteredData.length === 0}
              >
                <FaDownload />
                Export CSV
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>
                Error loading {dataType} data: {error}
              </p>
              <div style={{ marginTop: "1rem" }}>
                <button onClick={fetchData} className="btn-secondary">
                  Try Again
                </button>
                <button
                  onClick={() => setError(null)}
                  className="btn-secondary"
                  style={{ marginLeft: "0.5rem" }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Data Table */}
          {filteredData.length > 0 ? (
            <>
              <div className="applications-table-container">
                <table className="applications-table">
                  <thead>{renderTableHeaders()}</thead>
                  <tbody>
                    {currentItems.map((item, index) =>
                      renderTableRow(item, index)
                    )}
                  </tbody>
                </table>
              </div>
              {renderPagination()}
            </>
          ) : (
            <div className="no-applications">
              {data.length === 0 ? (
                <div>
                  <p>
                    No{" "}
                    {dataType === "membership" ? "applications" : "submissions"}{" "}
                    found in the system.
                  </p>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-muted)",
                      marginTop: "0.5rem",
                    }}
                  >
                    {dataType === "membership"
                      ? "Applications will appear here when students submit the join form."
                      : "Submissions will appear here when participants submit photos."}
                  </p>
                </div>
              ) : (
                <div>
                  <p>
                    No{" "}
                    {dataType === "membership" ? "applications" : "submissions"}{ " "}
                    found matching your search criteria.
                  </p>
                  {(searchTerm || filterStatus !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilterStatus("all");
                      }}
                      className="btn-secondary"
                      style={{ marginTop: "1rem" }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {dataType === "membership"
                  ? "Application Details"
                  : "Submission Details"}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">{renderModalDetails()}</div>
            <div className="modal-footer">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && renderEmailModal()}
    </div>
  );
};

export default UniversalAdmin;