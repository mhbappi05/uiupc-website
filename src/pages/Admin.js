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
  const [dataType, setDataType] = useState("membership"); // 'membership' or 'photos'

  const { user } = useAuth();

  // URLs for different data types
  const SCRIPTS = {
    membership:
      "https://script.google.com/macros/s/AKfycbwf_UmVAhpw7_y9RXbLartxhOwRFZhAg9KMqw4q1wvNTE1DQM_Qq_ryPLAnRWkM25Yd/exec",
    photos:
      "https://script.google.com/macros/s/AKfycbw4Jg_fVbBYEkHznAn9P3RNtxSBWeiUDVZIF3AM8VhkKHT3GEifO-tEWECEh918PSMJ/exec",
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching ${dataType} data...`);

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
  }, [dataType]);

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
      // Photo submissions - using the actual column names from your spreadsheet
      const name = safeToString(item["Name"] || item["Full Name"] || item.name);
      const email = safeToString(item["Email"] || item.email);
      const phone = safeToString(item["Phone"] || item.phone);
      const institution = safeToString(item["Institution"] || item.institution);
      const status = safeToString(
        item["Status"] || item.status || "IN_PROGRESS"
      );

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

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
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
      // Photo submissions CSV with correct column names
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
    a.download = `uiu-${dataType}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
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
    // Try different possible property names and cases
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
            {filteredData.length} | Error: {error ? "Yes" : "No"}
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
            <div className="applications-table-container">
              <table className="applications-table">
                <thead>{renderTableHeaders()}</thead>
                <tbody>
                  {filteredData.map((item, index) =>
                    renderTableRow(item, index)
                  )}
                </tbody>
              </table>
            </div>
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
                    {dataType === "membership" ? "applications" : "submissions"}{" "}
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
    </div>
  );
};

export default UniversalAdmin;
