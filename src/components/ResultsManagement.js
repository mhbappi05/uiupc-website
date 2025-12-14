// src/components/ResultsManagement.js
import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaTrophy,
  FaUser,
  FaUniversity,
  FaImage,
  FaSearch,
  FaFilter,
  FaDownload,
  FaSync,
  FaCalendar,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaTshirt,
  FaExclamationTriangle,
  FaDatabase,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Loading from "./Loading";
import "./ResultsManagement.css";

const ResultsManagement = ({ scripts, user, onUpdate }) => {
  const [results, setResults] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState("shutter-stories");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [usingDemoData, setUsingDemoData] = useState(false);

  // Pagination states
  const [currentResultsPage, setCurrentResultsPage] = useState(1);
  const [currentPaymentsPage, setCurrentPaymentsPage] = useState(1);
  const itemsPerPage = 10;

  // New result form state
  const [newResult, setNewResult] = useState({
    eventId: "shutter-stories",
    name: "",
    institute: "",
    category: "single",
    photos: 1,
    selected: true,
    status: "selected",
  });

  // Events list
  const events = [
    { id: "shutter-stories", name: "Shutter Stories Chapter IV" },
    { id: "event-2", name: "Photo Exhibition 2024" },
    { id: "event-3", name: "Annual Competition" },
  ];

  // Demo data for fallback
  const demoResults = [
    {
      id: 1,
      name: "John Doe",
      institute: "UIU",
      category: "single",
      photos: 3,
      selected: true,
      status: "selected",
      timestamp: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      name: "Jane Smith",
      institute: "BUET",
      category: "single",
      photos: 2,
      selected: true,
      status: "selected",
      timestamp: "2024-01-15T11:00:00Z",
    },
    {
      id: 3,
      name: "Alex Johnson",
      institute: "DU",
      category: "story",
      photos: 5,
      selected: true,
      status: "selected",
      timestamp: "2024-01-15T11:30:00Z",
    },
  ];

  const demoPayments = [
    {
      id: 1,
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "01712345678",
      institute: "UIU",
      category: "single",
      photoCount: 2,
      tshirtSize: "M",
      address: "Dhaka, Bangladesh",
      paymentMethod: "bkash01",
      transactionId: "BKA123456789",
      totalAmount: 2040,
      status: "pending",
      timestamp: "2024-01-15T12:00:00Z",
      eventName: "Shutter Stories Chapter IV",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "01898765432",
      institute: "BUET",
      category: "story",
      photoCount: 1,
      tshirtSize: "L",
      address: "Chittagong, Bangladesh",
      paymentMethod: "nagad",
      transactionId: "NAG987654321",
      totalAmount: 3060,
      status: "verified",
      timestamp: "2024-01-15T12:30:00Z",
      eventName: "Shutter Stories Chapter IV",
    },
    {
      id: 3,
      name: "Robert Chen",
      email: "robert@example.com",
      phone: "01611223344",
      institute: "DU",
      category: "single",
      photoCount: 3,
      tshirtSize: "XL",
      address: "Sylhet, Bangladesh",
      paymentMethod: "rocket",
      transactionId: "ROCK11223344",
      totalAmount: 3060,
      status: "rejected",
      timestamp: "2024-01-15T13:00:00Z",
      eventName: "Shutter Stories Chapter IV",
    },
  ];

  // Fetch results and payments
  useEffect(() => {
    fetchResults();
    fetchPayments();
  }, [selectedEvent, refreshTrigger]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `${
        scripts.results
      }?action=getAllResults&eventId=${selectedEvent}&t=${Date.now()}`;
      const response = await fetch(url);

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = JSON.parse(responseText);

      if (result.success) {
        const resultsData = Array.isArray(result.data) ? result.data : [];
        setResults(resultsData);
        setUsingDemoData(false);
        setError(null);
      } else {
        throw new Error(result.error || "API returned error");
      }
    } catch (error) {
      console.error("❌ Error fetching results:", error);
      setError(`Failed to load results: ${error.message}`);

      // Use demo data as fallback
      setResults(demoResults);
      setUsingDemoData(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      // Use CORS proxy for payments
      const targetUrl = `${
        scripts.results
      }?action=getAllPayments&eventId=${selectedEvent}&t=${Date.now()}`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        targetUrl
      )}`;

      const response = await fetch(proxyUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const proxyResult = await response.json();

      if (proxyResult.contents) {
        const result = JSON.parse(proxyResult.contents);

        if (result.success) {
          const paymentsData = Array.isArray(result.data) ? result.data : [];
          setPayments(paymentsData);
          return;
        } else {
          throw new Error(result.error || "API returned error");
        }
      } else {
        throw new Error("No content in proxy response");
      }
    } catch (error) {
      console.error("❌ Error fetching payments via proxy:", error);

      // Try direct fetch as last resort
      try {
        const directUrl = `${
          scripts.results
        }?action=getAllPayments&eventId=${selectedEvent}&t=${Date.now()}`;
        const directResponse = await fetch(directUrl);

        if (directResponse.ok) {
          const result = await directResponse.json();
          if (result.success) {
            const paymentsData = Array.isArray(result.data) ? result.data : [];
            setPayments(paymentsData);
            return;
          }
        }
      } catch (directError) {
        console.error("❌ Direct fetch also failed:", directError);
      }

      // Use demo data
      setPayments(demoPayments);
    }
  };

  // Filter results - ensure results is an array
  const filteredResults = Array.isArray(results)
    ? results.filter((result) => {
        if (selectedCategory !== "all" && result.category !== selectedCategory)
          return false;
        if (selectedStatus !== "all" && result.status !== selectedStatus)
          return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            (result.name && result.name.toLowerCase().includes(query)) ||
            (result.institute &&
              result.institute.toLowerCase().includes(query)) ||
            (result.status && result.status.toLowerCase().includes(query))
          );
        }
        return true;
      })
    : [];

  // Separate results by category
  const singleResults = filteredResults.filter(
    (result) => result.category === "single"
  );
  const storyResults = filteredResults.filter(
    (result) => result.category === "story"
  );

  // Filter payments - ensure payments is an array
  const filteredPayments = Array.isArray(payments)
    ? payments.filter((payment) => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            (payment.name && payment.name.toLowerCase().includes(query)) ||
            (payment.email && payment.email.toLowerCase().includes(query)) ||
            (payment.transactionId &&
              payment.transactionId.toLowerCase().includes(query))
          );
        }
        return true;
      })
    : [];

  // Pagination logic for results
  const totalResultsPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startResultsIndex = (currentResultsPage - 1) * itemsPerPage;
  const endResultsIndex = startResultsIndex + itemsPerPage;
  const paginatedResults = filteredResults.slice(
    startResultsIndex,
    endResultsIndex
  );

  // Pagination logic for single category results
  const singleResultsStartIndex = (currentResultsPage - 1) * itemsPerPage;
  const singleResultsEndIndex = singleResultsStartIndex + itemsPerPage;
  const paginatedSingleResults = singleResults.slice(
    singleResultsStartIndex,
    singleResultsEndIndex
  );
  const totalSingleResultsPages = Math.ceil(
    singleResults.length / itemsPerPage
  );

  // Pagination logic for story category results
  const storyResultsStartIndex = (currentResultsPage - 1) * itemsPerPage;
  const storyResultsEndIndex = storyResultsStartIndex + itemsPerPage;
  const paginatedStoryResults = storyResults.slice(
    storyResultsStartIndex,
    storyResultsEndIndex
  );
  const totalStoryResultsPages = Math.ceil(storyResults.length / itemsPerPage);

  // Pagination logic for payments
  const totalPaymentsPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startPaymentsIndex = (currentPaymentsPage - 1) * itemsPerPage;
  const endPaymentsIndex = startPaymentsIndex + itemsPerPage;
  const paginatedPayments = filteredPayments.slice(
    startPaymentsIndex,
    endPaymentsIndex
  );

  // Pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange, dataType }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>

        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>

        <span className="pagination-count">
          Showing{" "}
          {dataType === "results"
            ? filteredResults.length
            : filteredPayments.length}{" "}
          items
        </span>
      </div>
    );
  };

   // In ResultsManagement.js, replace your POST request functions:

// Handle adding a new result - UPDATED
const handleAddResult = async () => {
  try {
    console.log('Adding new result:', newResult);
    
    // Validate required fields
    if (!newResult.name || !newResult.name.trim()) {
      alert('Name is required!');
      return;
    }
    
    if (!newResult.institute || !newResult.institute.trim()) {
      alert('Institute is required!');
      return;
    }
    
    // Prepare data in the exact format the backend expects
    const requestData = {
      name: newResult.name.trim(),
      institute: newResult.institute.trim(),
      photos: parseInt(newResult.photos) || 1,
      selected: newResult.selected,
      category: newResult.category,
      status: newResult.status,
      eventId: selectedEvent
    };
    
    console.log('Request data:', requestData);
    
    // Use GET request with URL parameters (works better with Google Apps Script)
    const queryParams = new URLSearchParams({
      action: 'addResult',
      name: requestData.name,
      institute: requestData.institute,
      photos: requestData.photos,
      selected: requestData.selected,
      category: requestData.category,
      status: requestData.status,
      eventId: requestData.eventId,
      t: Date.now() // Cache buster
    }).toString();
    
    const url = `${scripts.results}?${queryParams}`;
    console.log('Request URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const responseText = await response.text();
    console.log('Response:', responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      throw new Error('Invalid response from server');
    }
    
    if (result.success) {
      alert('Result added successfully!');
      setRefreshTrigger(prev => prev + 1);
      // Reset form
      setNewResult({
        eventId: "shutter-stories",
        name: "",
        institute: "",
        category: "single",
        photos: 1,
        selected: true,
        status: "selected",
      });
    } else {
      alert('Failed to add result: ' + (result.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error adding result:', error);
    
    if (error.message.includes('Failed to fetch')) {
      alert(`Network error: Cannot connect to the server. Please check:
      1. Is the server running?
      2. Is the correct API URL configured?
      3. Are there any CORS issues? (Check browser console)
      
      Current API URL: ${scripts.results}`);
    } else {
      alert('Error adding result: ' + error.message);
    }
  }
};

// Handle updating a result - UPDATED
const handleUpdateResult = async (resultId, updatedData) => {
  try {
    console.log('Updating result:', { resultId, updatedData });
    
    const formData = new FormData();
    formData.append('action', 'updateResult');
    formData.append('resultId', resultId);
    formData.append('data', JSON.stringify(updatedData));
    
    await fetch(scripts.results, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });
    
    alert('Update submitted. Refreshing data...');
    setRefreshTrigger(prev => prev + 1);
    
  } catch (error) {
    console.error('Error updating result:', error);
    alert('Error updating result. Check console for details.');
  }
};

// Handle deleting a result - UPDATED
const handleDeleteResult = async (resultId) => {
  if (!window.confirm('Are you sure you want to delete this result?')) {
    return;
  }

  try {
    console.log('Deleting result:', resultId);
    
    const formData = new FormData();
    formData.append('action', 'deleteResult');
    formData.append('resultId', resultId);
    
    await fetch(scripts.results, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });
    
    alert('Delete submitted. Refreshing data...');
    setRefreshTrigger(prev => prev + 1);
    
  } catch (error) {
    console.error('Error deleting result:', error);
    alert('Error deleting result. Check console for details.');
  }
};

// Handle updating payment status - UPDATED
const handleUpdatePaymentStatus = async (paymentId, status) => {
  try {
    const formData = new FormData();
    formData.append('action', 'updatePaymentStatus');
    formData.append('paymentId', paymentId);
    formData.append('status', status);
    
    await fetch(scripts.results, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });
    
    alert(`Payment ${status} submitted. Refreshing data...`);
    setRefreshTrigger(prev => prev + 1);
    
  } catch (error) {
    console.error('Error updating payment status:', error);
    alert('Error updating payment status: ' + error.message);
  }
};

  // Export to CSV function
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle special characters and commas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Connection test function (optional - you can add if needed)
  const testConnection = async () => {
    try {
      const response = await fetch(`${scripts.results}?action=test&t=${Date.now()}`);
      const result = await response.json();
      if (result.success) {
        alert('Connection test successful!');
      } else {
        alert('Connection test failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Connection test failed: ' + error.message);
    }
  };

  // CORS proxy function (optional - you can add if needed)
  const useCorsProxy = async () => {
    alert('Switching to CORS proxy for connections...');
    // Implementation depends on how you want to handle this
  };

  const renderResultsTable = () => {
    return (
      <div className="table-container">
        <div className="table-header">
          <h3>
            <FaTrophy /> Results Management ({filteredResults.length})
          </h3>
          <div className="table-actions">
            <button
              className="btn-primary"
              onClick={() => setShowResultsModal(true)}
            >
              Add New Result
            </button>
            <button
              className="btn-secondary"
              onClick={() => exportToCSV(results, "results")}
              disabled={results.length === 0}
            >
              <FaDownload /> Export CSV
            </button>
          </div>
        </div>

        {/* Single Photo Results Section */}
        {selectedCategory === "all" || selectedCategory === "single" ? (
          <div className="results-section">
            <h4 className="section-title">
              Single Photo Entries ({singleResults.length})
            </h4>
            {singleResults.length === 0 ? (
              <div className="no-data-message">
                No single photo entries found.
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Institute</th>
                        <th>Photos</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedSingleResults.map((result, index) => (
                        <tr
                          key={result.id || index}
                          className={result.selected ? "selected-row" : ""}
                        >
                          <td>{result.id}</td>
                          <td>{result.name || "No name"}</td>
                          <td>{result.institute || "No institute"}</td>
                          <td>{result.photos || 1}</td>
                          <td>
                            <span className={`status-badge ${result.status}`}>
                              {result.status === "selected"
                                ? "Selected"
                                : result.status === "not-selected"
                                ? "Not Selected"
                                : result.status || "Unknown"}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => {
                                setSelectedResult(result);
                                setShowResultsModal(true);
                              }}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteResult(result.id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={currentResultsPage}
                  totalPages={totalSingleResultsPages}
                  onPageChange={setCurrentResultsPage}
                  dataType="results"
                />
              </>
            )}
          </div>
        ) : null}

        {/* Photo Story Results Section */}
        {selectedCategory === "all" || selectedCategory === "story" ? (
          <div className="results-section">
            <h4 className="section-title">
              Photo Story Entries ({storyResults.length})
            </h4>
            {storyResults.length === 0 ? (
              <div className="no-data-message">
                No photo story entries found.
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Institute</th>
                        <th>Photos</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStoryResults.map((result, index) => (
                        <tr
                          key={result.id || index}
                          className={result.selected ? "selected-row" : ""}
                        >
                          <td>{result.id}</td>
                          <td>{result.name || "No name"}</td>
                          <td>{result.institute || "No institute"}</td>
                          <td>{result.photos || 1}</td>
                          <td>
                            <span className={`status-badge ${result.status}`}>
                              {result.status === "selected"
                                ? "Selected"
                                : result.status === "not-selected"
                                ? "Not Selected"
                                : result.status || "Unknown"}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => {
                                setSelectedResult(result);
                                setShowResultsModal(true);
                              }}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteResult(result.id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={currentResultsPage}
                  totalPages={totalStoryResultsPages}
                  onPageChange={setCurrentResultsPage}
                  dataType="results"
                />
              </>
            )}
          </div>
        ) : null}

        {/* Combined view for specific category selection */}
        {selectedCategory !== "all" &&
        selectedCategory !== "single" &&
        selectedCategory !== "story" ? (
          <div className="results-section">
            {filteredResults.length === 0 ? (
              <div className="no-data-message">
                No results found matching the selected criteria.
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Institute</th>
                        <th>Category</th>
                        <th>Photos</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedResults.map((result, index) => (
                        <tr
                          key={result.id || index}
                          className={result.selected ? "selected-row" : ""}
                        >
                          <td>{result.id}</td>
                          <td>{result.name || "No name"}</td>
                          <td>{result.institute || "No institute"}</td>
                          <td>
                            <span
                              className={`category-badge ${result.category}`}
                            >
                              {result.category === "single"
                                ? "Single Photo"
                                : result.category === "story"
                                ? "Photo Story"
                                : result.category || "Unknown"}
                            </span>
                          </td>
                          <td>{result.photos || 1}</td>
                          <td>
                            <span className={`status-badge ${result.status}`}>
                              {result.status === "selected"
                                ? "Selected"
                                : result.status === "not-selected"
                                ? "Not Selected"
                                : result.status || "Unknown"}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => {
                                setSelectedResult(result);
                                setShowResultsModal(true);
                              }}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteResult(result.id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={currentResultsPage}
                  totalPages={totalResultsPages}
                  onPageChange={setCurrentResultsPage}
                  dataType="results"
                />
              </>
            )}
          </div>
        ) : null}
      </div>
    );
  };

  const renderPaymentsTable = () => (
    <div className="table-container">
      <div className="table-header">
        <h3>
          <FaMoneyBillWave /> Payment Management ({filteredPayments.length})
        </h3>
        <div className="table-actions">
          <button
            className="btn-secondary"
            onClick={() => exportToCSV(payments, "payments")}
            disabled={payments.length === 0}
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="no-data-message">No payments found.</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Transaction ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((payment) => (
                  <tr key={payment.id || Math.random()}>
                    <td>{payment.id}</td>
                    <td>{payment.name}</td>
                    <td>{payment.email}</td>
                    <td>
                      <span className={`category-badge ${payment.category}`}>
                        {payment.category === "single" ? "Single" : "Story"}
                      </span>
                    </td>
                    <td>{payment.totalAmount?.toLocaleString()} BDT</td>
                    <td>
                      <code>{payment.transactionId}</code>
                    </td>
                    <td>
                      <span className={`status-badge ${payment.status}`}>
                        {payment.status === "verified"
                          ? "Verified"
                          : payment.status === "pending"
                          ? "Pending"
                          : payment.status === "rejected"
                          ? "Rejected"
                          : payment.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn view-btn"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowPaymentModal(true);
                        }}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {payment.status === "pending" && (
                        <>
                          <button
                            className="action-btn approve-btn"
                            onClick={() =>
                              handleUpdatePaymentStatus(payment.id, "verified")
                            }
                            title="Verify Payment"
                          >
                            <FaCheck />
                          </button>
                          <button
                            className="action-btn reject-btn"
                            onClick={() =>
                              handleUpdatePaymentStatus(payment.id, "rejected")
                            }
                            title="Reject Payment"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPaymentsPage}
            totalPages={totalPaymentsPages}
            onPageChange={setCurrentPaymentsPage}
            dataType="payments"
          />
        </>
      )}
    </div>
  );

  const renderResultsModal = () => (
    <div className="modal-overlay">
      <div className="modal-content large-modal">
        <div className="modal-header">
          <h3>{selectedResult ? "Edit Result" : "Add New Result"}</h3>
          <button
            className="modal-close"
            onClick={() => {
              setShowResultsModal(false);
              setSelectedResult(null);
            }}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={selectedResult ? selectedResult.name : newResult.name}
                onChange={(e) =>
                  selectedResult
                    ? setSelectedResult({
                        ...selectedResult,
                        name: e.target.value,
                      })
                    : setNewResult({ ...newResult, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Institute *</label>
              <input
                type="text"
                value={
                  selectedResult
                    ? selectedResult.institute
                    : newResult.institute
                }
                onChange={(e) =>
                  selectedResult
                    ? setSelectedResult({
                        ...selectedResult,
                        institute: e.target.value,
                      })
                    : setNewResult({ ...newResult, institute: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select
                value={
                  selectedResult ? selectedResult.category : newResult.category
                }
                onChange={(e) =>
                  selectedResult
                    ? setSelectedResult({
                        ...selectedResult,
                        category: e.target.value,
                      })
                    : setNewResult({ ...newResult, category: e.target.value })
                }
              >
                <option value="single">Single Photo</option>
                <option value="story">Photo Story</option>
              </select>
            </div>
            <div className="form-group">
              <label>Number of Photos</label>
              <input
                type="number"
                min="1"
                value={
                  selectedResult ? selectedResult.photos : newResult.photos
                }
                onChange={(e) =>
                  selectedResult
                    ? setSelectedResult({
                        ...selectedResult,
                        photos: parseInt(e.target.value) || 1,
                      })
                    : setNewResult({
                        ...newResult,
                        photos: parseInt(e.target.value) || 1,
                      })
                }
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={
                  selectedResult ? selectedResult.status : newResult.status
                }
                onChange={(e) =>
                  selectedResult
                    ? setSelectedResult({
                        ...selectedResult,
                        status: e.target.value,
                      })
                    : setNewResult({ ...newResult, status: e.target.value })
                }
              >
                <option value="selected">Selected</option>
                <option value="not-selected">Not Selected</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="form-group">
              <label>Selected for Exhibition</label>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  checked={
                    selectedResult
                      ? selectedResult.selected
                      : newResult.selected
                  }
                  onChange={(e) =>
                    selectedResult
                      ? setSelectedResult({
                          ...selectedResult,
                          selected: e.target.checked,
                        })
                      : setNewResult({
                          ...newResult,
                          selected: e.target.checked,
                        })
                  }
                />
                <span>Mark as selected</span>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={() => {
              setShowResultsModal(false);
              setSelectedResult(null);
            }}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              if (selectedResult) {
                handleUpdateResult(selectedResult.id, selectedResult);
              } else {
                handleAddResult();
              }
              setShowResultsModal(false);
              setSelectedResult(null);
            }}
          >
            {selectedResult ? "Update Result" : "Add Result"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderPaymentModal = () => (
    <div className="modal-overlay">
      <div className="modal-content large-modal">
        <div className="modal-header">
          <h3>Payment Details</h3>
          <button
            className="modal-close"
            onClick={() => {
              setShowPaymentModal(false);
              setSelectedPayment(null);
            }}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {selectedPayment && (
            <div className="payment-details">
              <div className="detail-row">
                <div className="detail-label">
                  <FaUser /> Name:
                </div>
                <div className="detail-value">{selectedPayment.name}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">
                  <FaEnvelope /> Email:
                </div>
                <div className="detail-value">{selectedPayment.email}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">
                  <FaPhone /> Phone:
                </div>
                <div className="detail-value">{selectedPayment.phone}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">
                  <FaUniversity /> Institute:
                </div>
                <div className="detail-value">{selectedPayment.institute}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">
                  <FaImage /> Category:
                </div>
                <div className="detail-value">
                  {selectedPayment.category === "single"
                    ? "Single Photo"
                    : "Photo Story"}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Quantity:</div>
                <div className="detail-value">{selectedPayment.photoCount}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">
                  <FaTshirt /> T-Shirt Size:
                </div>
                <div className="detail-value">{selectedPayment.tshirtSize}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">
                  <FaHome /> Address:
                </div>
                <div className="detail-value">{selectedPayment.address}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Payment Method:</div>
                <div className="detail-value">
                  {selectedPayment.paymentMethod === "bkash01"
                    ? "Bkash: 01885661159"
                    : selectedPayment.paymentMethod === "bkash02"
                    ? "Bkash: 01679861740"
                    : selectedPayment.paymentMethod === "nagad"
                    ? "Nagad: 01679861740"
                    : selectedPayment.paymentMethod === "rocket"
                    ? "Rocket: 01679861740"
                    : selectedPayment.paymentMethod}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Transaction ID:</div>
                <div className="detail-value">
                  <code>{selectedPayment.transactionId}</code>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Total Amount:</div>
                <div className="detail-value">
                  {selectedPayment.totalAmount?.toLocaleString()} BDT
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">
                  <FaCalendar /> Submitted:
                </div>
                <div className="detail-value">
                  {new Date(selectedPayment.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Status:</div>
                <div className="detail-value">
                  <span className={`status-badge ${selectedPayment.status}`}>
                    {selectedPayment.status === "verified"
                      ? "Verified"
                      : selectedPayment.status === "pending"
                      ? "Pending"
                      : selectedPayment.status === "rejected"
                      ? "Rejected"
                      : selectedPayment.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={() => {
              setShowPaymentModal(false);
              setSelectedPayment(null);
            }}
          >
            Close
          </button>
          {selectedPayment && selectedPayment.status === "pending" && (
            <>
              <button
                className="btn-primary approve-btn"
                onClick={() => {
                  handleUpdatePaymentStatus(selectedPayment.id, "verified");
                  setShowPaymentModal(false);
                  setSelectedPayment(null);
                }}
              >
                <FaCheck /> Verify Payment
              </button>
              <button
                className="btn-primary reject-btn"
                onClick={() => {
                  handleUpdatePaymentStatus(selectedPayment.id, "rejected");
                  setShowPaymentModal(false);
                  setSelectedPayment(null);
                }}
              >
                <FaTimes /> Reject Payment
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Loading message="Loading results and payments..." />;
  }

  return (
    <div className="results-management">
      {/* Control Panel Header */}
      <div className="control-panel-header">
        <h2>Results & Payment Management</h2>

        {error && (
          <div className="connection-status error">
            <FaExclamationTriangle />
            <div className="status-message">
              <strong>Connection Issue:</strong> {error}
            </div>
            <div className="status-actions">
              <button className="btn-small" onClick={testConnection}>
                Test Connection
              </button>
              <button className="btn-small" onClick={useCorsProxy}>
                Try CORS Proxy
              </button>
              <button
                className="btn-small"
                onClick={() => setRefreshTrigger((prev) => prev + 1)}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {usingDemoData && (
          <div className="demo-warning">
            <FaExclamationTriangle />
            <strong>DEMO MODE:</strong> Using sample data. Real data connection
            failed.
          </div>
        )}

        <div className="stats-summary">
          <div className="stat-card">
            <FaTrophy />
            <div className="stat-content">
              <h3>{results.length}</h3>
              <p>Total Results</p>
              {usingDemoData && <small>Demo Data</small>}
            </div>
          </div>
          <div className="stat-card">
            <FaMoneyBillWave />
            <div className="stat-content">
              <h3>{payments.length}</h3>
              <p>Total Payments</p>
              {usingDemoData && <small>Demo Data</small>}
            </div>
          </div>
          <div className="stat-card">
            <FaCheck />
            <div className="stat-content">
              <h3>{payments.filter((p) => p.status === "verified").length}</h3>
              <p>Verified Payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-container">
        <div className="filter-group">
          <label>Select Event:</label>
          <select
            value={selectedEvent}
            onChange={(e) => {
              setSelectedEvent(e.target.value);
              setCurrentResultsPage(1);
              setCurrentPaymentsPage(1);
            }}
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentResultsPage(1);
            }}
          >
            <option value="all">All Categories</option>
            <option value="single">Single Photo</option>
            <option value="story">Photo Story</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentResultsPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="selected">Selected</option>
            <option value="not-selected">Not Selected</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="search-group">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name, institute, email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentResultsPage(1);
              setCurrentPaymentsPage(1);
            }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentResultsPage(1);
                setCurrentPaymentsPage(1);
              }}
              className="clear-search"
            >
              ×
            </button>
          )}
        </div>

        <button
          className="btn-secondary"
          onClick={() => {
            setRefreshTrigger((prev) => prev + 1);
            setCurrentResultsPage(1);
            setCurrentPaymentsPage(1);
          }}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <FaSync /> Refresh
        </button>
      </div>

      {/* Results Section */}
      {renderResultsTable()}

      {/* Payments Section */}
      {renderPaymentsTable()}

      {/* Modals */}
      {showResultsModal && renderResultsModal()}
      {showPaymentModal && renderPaymentModal()}
    </div>
  );
};

export default ResultsManagement;
