// pages/UniversalAdmin.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import GalleryUpload from "../components/GalleryUpload";
import MembershipApplications from "../components/MembershipApplications";
import PhotoSubmissions from "../components/PhotoSubmissions";
import "../components/GalleryUpload.css";
import BlogManagement from "../components/BlogManagement";
import {
  FaSync,
  FaUsers,
  FaCamera,
  FaNewspaper,
  FaImages,
  FaExclamationTriangle,
  FaCheck,
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [joinPageStatus, setJoinPageStatus] = useState("enabled");
const [photoSubmissionStatus, setPhotoSubmissionStatus] = useState("enabled");

  const { user } = useAuth();

  // URLs for different data types - MAKE SURE THESE ARE CORRECT
  const SCRIPTS = {
    membership:
      "https://script.google.com/macros/s/AKfycbyhePEFndFhGdTlDdClsRpWAAEVvEB9OJAe0lzx67tFiK4Ej9SUkMo0GoWAJ3MsUUB5/exec",
    photos:
      "https://script.google.com/macros/s/AKfycbyUQVpwn4yvn4PJ6FXoai7hh-KC8jSGYooJD5-UcHvrsFraEpBmpUanUmskHn6i4I7i/exec",
    email:
      "https://script.google.com/macros/s/AKfycbzut9q4kH0cnVhkfM5EKJrlmGp5oO7qNTuKpF8vn_vl4eJcREjfrSZ5P2SFDlllM7AKLw/exec",
    gallery:
      "https://script.google.com/macros/s/AKfycbyzV-c3PZJtzFbD2A_PmKMIR9V5oiQ1vjKarmruIVsCA3vcDQy8nHQ6fPZnWYa-lvDPoA/exec",
    blog: "https://script.google.com/macros/s/AKfycbydYlnt1AiH6QsicIlyh2cRH2XmfAmwO-ksB4cGQU17Ho7GQBXcx-Fn6u32wkvYp-fDFA/exec",
  };

  const toggleJoinPageStatus = async () => {
    try {
      const newStatus = joinPageStatus === "enabled" ? "disabled" : "enabled";

      const response = await fetch(SCRIPTS.membership, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "updateJoinPageStatus",
          status: newStatus,
          updatedBy: user.email,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setJoinPageStatus(newStatus);
        alert(`Join page submission has been ${newStatus}`);
      } else {
        throw new Error(result.message || "Failed to update join page status");
      }
    } catch (error) {
      console.error("Error updating join page status:", error);
      alert("Failed to update join page status: " + error.message);
    }
  };

  // Add this function to fetch the current join page status
  const fetchJoinPageStatus = async () => {
    try {
      const response = await fetch(
        `${SCRIPTS.membership}?action=getJoinPageStatus`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        setJoinPageStatus(result.data.status || "enabled");
      }
    } catch (error) {
      console.error("Error fetching join page status:", error);
      // Default to enabled if there's an error
      setJoinPageStatus("enabled");
    }
  };

  // Call fetchJoinPageStatus when component mounts and when dataType is membership
  useEffect(() => {
    if (dataType === "membership") {
      fetchJoinPageStatus();
    }
  }, [dataType]);

  const fetchPhotoSubmissionStatus = async () => {
  try {
    const response = await fetch(
      `${SCRIPTS.photos}?action=getSubmissionStatus`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      setPhotoSubmissionStatus(result.enabled ? "enabled" : "disabled");
    }
  } catch (error) {
    console.error("Error fetching photo submission status:", error);
    // Default to enabled if there's an error
    setPhotoSubmissionStatus("enabled");
  }
};

// Add this function to toggle photo submission status
const togglePhotoSubmissionStatus = async () => {
  try {
    const newStatus = photoSubmissionStatus === "enabled" ? "disabled" : "enabled";

    const response = await fetch(SCRIPTS.photos, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        action: "updateSubmissionStatus",
        enabled: newStatus === "enabled" ? "true" : "false",
        updatedBy: user.email,
      }),
    });

    const result = await response.json();

    if (result.success) {
      setPhotoSubmissionStatus(newStatus);
      alert(`Photo submissions have been ${newStatus}`);
      // Refresh data to show updated status
      fetchData();
    } else {
      throw new Error(result.message || "Failed to update submission status");
    }
  } catch (error) {
    console.error("Error updating photo submission status:", error);
    alert("Failed to update photo submission status: " + error.message);
  }
};

// Call fetchPhotoSubmissionStatus when component mounts and when dataType is photos
useEffect(() => {
  if (dataType === "photos") {
    fetchPhotoSubmissionStatus();
  }
}, [dataType]);

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

For Submission: https://uiupc.vercel.app/register/shutter-stories
Rulebook: https://drive.google.com/drive/u/0/folders/1qwJ7spd1ewaH3RINgSKSf87QMYvcpSZi

If you have any questions, feel free to contact us through this email or message us on our Facebook page.

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
      setConnectionTest({
        status: "testing",
        message: "Testing connection...",
      });

      const response = await fetch(`${SCRIPTS.email}?action=testConnection`, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("Connection test response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Connection test result:", result);

      if (result.status === "success") {
        setConnectionTest({
          status: "success",
          message: "Email service is connected and working!",
        });
      } else {
        throw new Error(result.data || "Connection test failed");
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      setConnectionTest({
        status: "error",
        message: `Failed to connect: ${error.message}. Please check: 1) Script URL is correct, 2) Script is deployed as web app, 3) Execute permissions are set to "Anyone"`,
      });
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching ${dataType} data...`);

      // Don't fetch data for blog type as BlogManagement handles its own data
      if (dataType === "blog" || dataType === "gallery") {
        setData([]);
        setLoading(false);
        return;
      }

      const action =
        dataType === "membership" ? "getApplications" : "getSubmissions";
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
  }, [dataType, refreshTrigger]);

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
        sentBy: user.email,
      });

      // Use GET request with URL parameters as fallback
      const params = new URLSearchParams({
        action: "sendEmail",
        recipientEmail: recipientEmail,
        subject: subject,
        body: body,
        sentBy: user.email,
        submissionId:
          selectedEmailItem.Timestamp ||
          selectedEmailItem.timestamp ||
          selectedEmailItem["Timestamp"],
        type: dataType,
      });

      const response = await fetch(`${SCRIPTS.email}?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
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
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        errorMessage +=
          "Network error - Cannot connect to email service. Please check the script URL and deployment settings.";
      } else {
        errorMessage += error.message;
      }

      alert(errorMessage);
    } finally {
      setEmailSending(false);
    }
  };

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleUpdateStatus = async (item, newStatus) => {
    try {
      console.log("Updating status:", { item, newStatus });

      const applicationId = item.Timestamp || item.timestamp;
      console.log("Application ID:", applicationId);

      const response = await fetch(SCRIPTS[dataType], {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "updateStatus",
          applicationId: applicationId,
          status: newStatus,
          updatedBy: user.email,
        }),
      });

      console.log("Update status response:", response);

      const result = await response.json();
      console.log("Update status result:", result);

      if (result.status === "success") {
        alert(`Application status updated to ${newStatus}`);
        fetchData(); // Refresh the data
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

      csvData = data.map((item) => [
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

      csvData = data.map((item) => [
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
    a.download = `uiu-${dataType}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
            <label>Facebook Profile:</label>
            <span>
              {(() => {
                // Use the same logic as in MembershipApplications.js
                const facebookLink =
                  selectedItem["Facebook Profile Link"] ||
                  selectedItem["Facebook Link"] ||
                  selectedItem["facebookLink"] ||
                  selectedItem["Facebook"] ||
                  selectedItem["facebook"] ||
                  selectedItem["Facebook Profile"] ||
                  selectedItem["facebookProfile"] ||
                  selectedItem["FB Link"] ||
                  selectedItem["fbLink"];

                console.log("Modal Facebook link:", facebookLink); // Debug

                if (
                  !facebookLink ||
                  facebookLink === "N/A" ||
                  facebookLink === "" ||
                  facebookLink === "Not provided"
                ) {
                  return "Not provided";
                }

                let formattedLink = facebookLink.trim();
                formattedLink = formattedLink.replace(/['"]/g, "");

                if (
                  !formattedLink.startsWith("http://") &&
                  !formattedLink.startsWith("https://")
                ) {
                  formattedLink = "https://" + formattedLink;
                }

                return (
                  <a
                    href={formattedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--uiu-orange)",
                      wordBreak: "break-all",
                    }}
                  >
                    {formattedLink}
                  </a>
                );
              })()}
            </span>
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
            <span>{getProperty(selectedItem, "Status") || "Pending"}</span>
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
            <span>{getProperty(selectedItem, "Status") || "IN_PROGRESS"}</span>
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

            {connectionTest?.status === "error" && (
              <div className="error-message" style={{ marginBottom: "1rem" }}>
                <p>
                  <strong>Email Service Issue:</strong> {connectionTest.message}
                </p>
                <button
                  onClick={testEmailConnection}
                  className="btn-secondary"
                  style={{ marginTop: "0.5rem" }}
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
                  disabled={emailSending || connectionTest?.status === "error"}
                >
                  Send Confirmation Email
                </button>
                <p className="template-description">
                  Confirms receipt of photo submission and provides basic
                  details.
                </p>
              </div>

              <div className="email-template-option">
                <button
                  onClick={() => sendEmail("renameRequest")}
                  className="btn-primary email-template-btn"
                  disabled={emailSending || connectionTest?.status === "error"}
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
                      const customMessage =
                        document.getElementById("customMessageInput")?.value ||
                        "";
                      sendEmail("general", customMessage);
                    }}
                    className="btn-secondary email-template-btn"
                    disabled={
                      emailSending || connectionTest?.status === "error"
                    }
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
            : dataType === "photos"
            ? "Photo Submissions"
            : dataType === "gallery"
            ? "Gallery"
            : "Blog Posts"}
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
                style={{ marginLeft: "1rem" }}
              >
                <FaSync /> Test Again
              </button>
            </div>
          )}

          {/* Debug Info */}
          <div className="debug-info">
            <strong>Debug Info:</strong>
            Data Type: {dataType} |
            {dataType !== "blog" && `Total: ${data.length} |`}
            Error: {error ? "Yes" : "No"} | Email Service:{" "}
            {connectionTest?.status || "Testing..."}
          </div>

          {/* Welcome Message */}
          <div className="admin-welcome">
            <p>
              Welcome, <strong>{user.email}</strong>
            </p>
            {dataType !== "blog" && (
              <p>
                Total{" "}
                {dataType === "membership" ? "Applications" : "Submissions"}:
                <strong>{data.length}</strong>
              </p>
            )}
          </div>

          {/* Render the appropriate component based on dataType */}
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
            <button
              className={`type-btn ${dataType === "gallery" ? "active" : ""}`}
              onClick={() => setDataType("gallery")}
            >
              <FaImages /> Gallery Management
            </button>
            <button
              className={`type-btn ${dataType === "blog" ? "active" : ""}`}
              onClick={() => setDataType("blog")}
            >
              <FaNewspaper /> Blog Management
            </button>
          </div>

          {/* Render the appropriate component based on dataType */}
{dataType === "membership" ? (
  <div className="applications-container">
    {/* Join Page Control Section */}
    <div
      className="join-page-control"
      style={{
        background: "rgba(30, 30, 30, 0.7)",
        padding: "1.5rem",
        borderRadius: "12px",
        marginBottom: "2rem",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div>
        <h3
          style={{
            color: "var(--white)",
            margin: "0 0 0.5rem 0",
            fontSize: "1.2rem",
          }}
        >
          Join Page Control
        </h3>
        <p
          style={{
            color: "var(--text-muted)",
            margin: 0,
            fontSize: "0.9rem",
          }}
        >
          Current status:{" "}
          <strong
            style={{
              color:
                joinPageStatus === "enabled" ? "#28a745" : "#dc3545",
            }}
          >
            {joinPageStatus === "enabled" ? "ENABLED" : "DISABLED"}
          </strong>
        </p>
        <p
          style={{
            color: "var(--text-muted)",
            margin: "0.25rem 0 0 0",
            fontSize: "0.8rem",
          }}
        >
          {joinPageStatus === "enabled"
            ? "Users can submit membership applications"
            : "Membership applications are currently disabled"}
        </p>
      </div>
      <button
        onClick={toggleJoinPageStatus}
        className={`btn-primary ${
          joinPageStatus === "disabled" ? "" : "btn-secondary"
        }`}
        style={{
          minWidth: "140px",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {joinPageStatus === "enabled" ? (
          <>
            <FaExclamationTriangle />
            Disable Submission
          </>
        ) : (
          <>
            <FaCheck />
            Enable Submission
          </>
        )}
      </button>
    </div>
    <MembershipApplications
      data={data}
      loading={loading}
      searchTerm={searchTerm}
      filterStatus={filterStatus}
      onSearchChange={setSearchTerm}
      onFilterChange={setFilterStatus}
      onRefresh={fetchData}
      onExport={exportToCSV}
      onViewDetails={handleViewDetails}
      onUpdateStatus={handleUpdateStatus}
      onEmailReply={handleEmailReply}
      connectionTest={connectionTest}
    />
  </div>
) : dataType === "photos" ? (
  <>
    {/* Photo Submission Control Section */}
    <div
      className="join-page-control"
      style={{
        background: "rgba(30, 30, 30, 0.7)",
        padding: "1.5rem",
        borderRadius: "12px",
        marginBottom: "2rem",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div>
        <h3
          style={{
            color: "var(--white)",
            margin: "0 0 0.5rem 0",
            fontSize: "1.2rem",
          }}
        >
          Photo Submission Control
        </h3>
        <p
          style={{
            color: "var(--text-muted)",
            margin: 0,
            fontSize: "0.9rem",
          }}
        >
          Current status:{" "}
          <strong
            style={{
              color: photoSubmissionStatus === "enabled" ? "#28a745" : "#dc3545",
            }}
          >
            {photoSubmissionStatus === "enabled" ? "ENABLED" : "DISABLED"}
          </strong>
        </p>
        <p
          style={{
            color: "var(--text-muted)",
            margin: "0.25rem 0 0 0",
            fontSize: "0.8rem",
          }}
        >
          {photoSubmissionStatus === "enabled"
            ? "Users can submit photos to Shutter Stories Chapter IV"
            : "Photo submissions are currently disabled"}
        </p>
      </div>
      <button
        onClick={togglePhotoSubmissionStatus}
        className={`btn-primary ${
          photoSubmissionStatus === "disabled" ? "" : "btn-secondary"
        }`}
        style={{
          minWidth: "140px",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {photoSubmissionStatus === "enabled" ? (
          <>
            <FaExclamationTriangle />
            Disable Submission
          </>
        ) : (
          <>
            <FaCheck />
            Enable Submission
          </>
        )}
      </button>
    </div>
    <PhotoSubmissions
      data={data}
      loading={loading}
      searchTerm={searchTerm}
      filterStatus={filterStatus}
      onSearchChange={setSearchTerm}
      onFilterChange={setFilterStatus}
      onRefresh={fetchData}
      onExport={exportToCSV}
      onViewDetails={handleViewDetails}
      onEmailReply={handleEmailReply}
      connectionTest={connectionTest}
    />
  </>
) : dataType === "gallery" ? (
  // Gallery Management Section - Show GalleryUpload component
  <GalleryUpload
    user={user}
    scripts={SCRIPTS}
    onUploadSuccess={handleUploadSuccess}
  />
) : (
  // Blog Management Section
  <BlogManagement
    user={user}
    scripts={SCRIPTS}
    onUploadSuccess={handleUploadSuccess}
  />
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
