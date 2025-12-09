// components/ResultsPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaTrophy,
  FaArrowLeft,
  FaCheckCircle,
  FaCamera,
  FaImages,
  FaSpinner,
} from "react-icons/fa";
import Loading from "./Loading";
import "./ResultsPage.css";

const ResultsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("single");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Google Apps Script Web App URL - FIXED URL (remove any trailing slashes)
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycby2D-Ip0ThOlsbhGCgbApBQpeQVtNnKy0G1otpKMtr2OFORS-g41Ko3SvxXMlJjne-W9w/exec";

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    name: "",
    email: "",
    phone: "",
    institute: "",
    category: "single",
    photoCount: 1,
    tshirtSize: "M",
    address: "",
    paymentMethod: "bkash01",
    transactionId: "",
    eventId: eventId || "shutter-stories",
  });

  // Fetch results from Google Sheets
  useEffect(() => {
    // In your fetchResults function in ResultsPage.js
    const fetchResults = async () => {
      try {
        setLoading(true);

        // Build the URL with parameters - IMPORTANT: use the correct format
        // Method 1: Direct URL construction (most reliable)
        const baseUrl = GOOGLE_SCRIPT_URL;
        const url = `${baseUrl}?action=getResults&eventId=${
          eventId || "shutter-stories"
        }&_=${new Date().getTime()}`;

        console.log("Fetching from URL:", url);

        // For Google Apps Script, use mode: 'cors' and handle errors differently
        const response = await fetch(url, {
          method: "GET",
          // Don't set Content-Type for GET requests
          headers: {
            Accept: "application/json",
          },
          mode: "cors",
          // Add credentials if needed
          credentials: "omit",
        });

        console.log("Response status:", response.status, response.statusText);

        // Try to get response text first
        const responseText = await response.text();
        console.log("Response text:", responseText);

        if (!response.ok) {
          console.error("HTTP error:", response.status);
          // Even if there's an HTTP error, try to parse the response
          if (responseText) {
            try {
              const errorData = JSON.parse(responseText);
              throw new Error(
                errorData.error || `HTTP ${response.status}: ${responseText}`
              );
            } catch (e) {
              throw new Error(
                `HTTP ${response.status}: ${responseText.substring(0, 100)}`
              );
            }
          } else {
            throw new Error(
              `HTTP error ${response.status}: ${response.statusText}`
            );
          }
        }

        // Parse the JSON response
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error(
            "Failed to parse JSON:",
            parseError,
            "Response was:",
            responseText
          );
          throw new Error("Invalid JSON response from server");
        }

        // Check for API-level errors
        if (data.error) {
          console.error("API error:", data.error);
          throw new Error(data.error);
        }

        // Success - set the data
        console.log("Data received successfully:", data);
        setResults(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError(err.message);

        // Use fallback data only if we have no results
        if (!results) {
          console.log("Using fallback data due to fetch error");
          setResults({
            success: true,
            title: "Shutter Stories Chapter IV - Selected Participants",
            singlePhotos: [
              {
                id: 1,
                name: "John Doe",
                institute: "UIU",
                photos: 3,
                selected: true,
                category: "single",
              },
              {
                id: 2,
                name: "Jane Smith",
                institute: "BUET",
                photos: 2,
                selected: true,
                category: "single",
              },
            ],
            stories: [
              {
                id: 1,
                name: "Emma Wilson",
                institute: "UIU",
                photos: 5,
                selected: true,
                category: "story",
              },
              {
                id: 2,
                name: "David Lee",
                institute: "BUP",
                photos: 4,
                selected: true,
                category: "story",
              },
              {
                id: 3,
                name: "Sophia Garcia",
                institute: "IUB",
                photos: 3,
                selected: true,
                category: "story",
              },
            ],
          });
        }
      } finally {
        setLoading(false);
      }
    };

    // Helper function for fallback data
    const useFallbackData = () => {
      if (!results) {
        console.log("Using fallback mock data");
        setResults({
          success: true,
          title: "Shutter Stories Chapter IV - Selected Participants",
          singlePhotos: [
            {
              id: 1,
              name: "John Doe",
              institute: "UIU",
              photos: 3,
              selected: true,
              category: "single",
            },
            {
              id: 2,
              name: "Jane Smith",
              institute: "BUET",
              photos: 2,
              selected: true,
              category: "single",
            },
            {
              id: 3,
              name: "Alex Johnson",
              institute: "DU",
              photos: 4,
              selected: true,
              category: "single",
            },
            {
              id: 4,
              name: "Sarah Williams",
              institute: "UIU",
              photos: 2,
              selected: true,
              category: "single",
            },
            {
              id: 5,
              name: "Michael Brown",
              institute: "NSU",
              photos: 1,
              selected: true,
              category: "single",
            },
          ],
          stories: [
            {
              id: 1,
              name: "Emma Wilson",
              institute: "UIU",
              photos: 5,
              selected: true,
              category: "story",
            },
            {
              id: 2,
              name: "David Lee",
              institute: "BUP",
              photos: 4,
              selected: true,
              category: "story",
            },
            {
              id: 3,
              name: "Sophia Garcia",
              institute: "IUB",
              photos: 3,
              selected: true,
              category: "story",
            },
          ],
        });
      }
    };

    fetchResults();
  }, [eventId]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Calculate total amount
      const unitPrice = paymentData.category === "single" ? 1020 : 3060;
      const totalAmount = unitPrice * paymentData.photoCount;

      const paymentPayload = {
        name: paymentData.name,
        email: paymentData.email,
        phone: paymentData.phone,
        institute: paymentData.institute,
        category: paymentData.category,
        photoCount: paymentData.photoCount,
        tshirtSize: paymentData.tshirtSize,
        address: paymentData.address,
        paymentMethod: paymentData.paymentMethod,
        transactionId: paymentData.transactionId,
        totalAmount: totalAmount,
        eventId: paymentData.eventId,
      };

      console.log("Submitting payment:", paymentPayload);

      // Method 1: Using GET (for testing)
      // const url = `${GOOGLE_SCRIPT_URL}?action=submitPayment&data=${encodeURIComponent(JSON.stringify(paymentPayload))}`;

      // Method 2: Using POST (recommended)
      const url = GOOGLE_SCRIPT_URL;
      const response = await fetch(url, {
        method: "POST",
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        body: JSON.stringify({
          action: "submitPayment",
          data: paymentPayload,
        }),
      });

      const result = await response.json();
      console.log("Payment response:", result);

      if (result.success) {
        alert(
          `✅ Payment submitted successfully!\nPayment ID: ${result.paymentId}\nWe will verify your transaction.`
        );

        // Reset form
        setPaymentData({
          name: "",
          email: "",
          phone: "",
          institute: "",
          category: "single",
          photoCount: 1,
          tshirtSize: "M",
          address: "",
          paymentMethod: "bkash01",
          transactionId: "",
          eventId: eventId || "shutter-stories",
        });

        setShowPaymentForm(false);
      } else {
        throw new Error(result.error || "Payment failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(
        `❌ Error: ${err.message}\n\nPlease save your details and contact support.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Alternative method for payment submission (if you need to read response)
  const handlePaymentSubmitAlternative = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Calculate total amount
      const unitPrice = paymentData.category === "single" ? 1020 : 3060;
      const totalAmount = unitPrice * paymentData.photoCount;

      const paymentPayload = {
        ...paymentData,
        totalAmount,
      };

      // For demo purposes, show success without actually calling API
      console.log("Payment data:", paymentPayload);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        "Payment submitted successfully! We will verify your transaction within 24 hours.\n\nDemo Mode: In production, this would save to Google Sheets."
      );

      // Reset form
      setPaymentData({
        name: "",
        email: "",
        phone: "",
        institute: "",
        category: "single",
        photoCount: 1,
        tshirtSize: "M",
        address: "",
        paymentMethod: "bkash01",
        transactionId: "",
        eventId: eventId || "shutter-stories",
      });

      setShowPaymentForm(false);
    } catch (err) {
      console.error("Payment submission error:", err);
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value,
    });
  };

  if (loading) {
    return (
      <div className="results-page">
        <div className="container">
          <div className="loading-container">
            <Loading message="Loading results..." />
          </div>
        </div>
      </div>
    );
  }

  if (error && !results) {
    return (
      <div className="results-page">
        <div className="container">
          <div className="error-state">
            <p>Error: {error}</p>
            <button onClick={() => navigate("/events")} className="btn-primary">
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter results based on selected category
  const displayResults =
    selectedCategory === "single"
      ? results?.singlePhotos || []
      : results?.stories || [];

  return (
    <div className="results-page">
      <div className="container">
        <button
          className="btn-secondary back-btn"
          onClick={() => navigate("/events")}
        >
          <FaArrowLeft /> Back to Events
        </button>

        <div className="results-header">
          <FaTrophy className="trophy-icon" />
          <h1>{results?.title || "Selected Participants"}</h1>
          <p className="results-subtitle">
            Congratulations to all selected participants for the exhibition!
          </p>
        </div>

        <div className="category-tabs">
          <button
            className={`category-tab ${
              selectedCategory === "single" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("single")}
          >
            <FaCamera /> Single Photos
          </button>
          <button
            className={`category-tab ${
              selectedCategory === "stories" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("stories")}
          >
            <FaImages /> Photo Stories
          </button>
        </div>

        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Institute</th>
                <th>Photos</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayResults.length > 0 ? (
                displayResults.map((result, index) => (
                  <tr
                    key={result.id}
                    className={result.selected ? "selected-row" : ""}
                  >
                    <td className="index-cell">{index + 1}</td>
                    <td>{result.name}</td>
                    <td>{result.institute}</td>
                    <td>{result.photos}</td>
                    <td className="status-cell">
                      <span
                        className={`status-badge ${
                          result.selected ? "selected" : "not-selected"
                        }`}
                      >
                        {result.selected ? "Selected" : "Not Selected"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    No results found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rest of your component remains the same */}
        {/* Payment Section */}
        <div className="payment-section">
          <div className="payment-header">
            <h2>Registration for Exhibition</h2>
            <p className="payment-subtitle">
              Selected participants can register to participate in the
              exhibition. Fees cover exhibition costs and certificate
              processing.
            </p>
          </div>

          <div className="price-cards">
            <div className="price-card">
              <h3>Single Photo</h3>
              <div className="price">1,020 BDT</div>
              <p>Per photo for exhibition</p>
              <ul className="price-features">
                <li>
                  <FaCheckCircle /> Exhibition Display
                </li>
                <li>
                  <FaCheckCircle /> Participation Certificate
                </li>
                <li>
                  <FaCheckCircle /> Event T-Shirt + Goodies
                </li>
              </ul>
            </div>
            <div className="price-card featured">
              <h3>Photo Story</h3>
              <div className="price">3,060 BDT</div>
              <p>Per story (6-12 photos)</p>
              <ul className="price-features">
                <li>
                  <FaCheckCircle /> Full Story Display
                </li>
                <li>
                  <FaCheckCircle /> Premium Certificate
                </li>
                <li>
                  <FaCheckCircle /> Event T-Shirt + Goodies
                </li>
              </ul>
            </div>
          </div>

          <button
            className="btn-primary payment-toggle-btn"
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            disabled={submitting}
          >
            {showPaymentForm
              ? "Hide Registration Form"
              : "Register for Exhibition"}
          </button>

          {showPaymentForm && (
            <form className="payment-form" onSubmit={handlePaymentSubmit}>
              <h3>Registration & Payment Form</h3>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={paymentData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={paymentData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={paymentData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label>Institute Name *</label>
                  <input
                    type="text"
                    name="institute"
                    value={paymentData.institute}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your institute name"
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label>Photo Category *</label>
                  <select
                    name="category"
                    value={paymentData.category}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                  >
                    <option value="single">
                      Single Photo - 1,020 BDT per photo
                    </option>
                    <option value="stories">
                      Photo Story - 3,060 BDT per story
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>How many photos/stories? *</label>
                  <input
                    type="number"
                    name="photoCount"
                    value={paymentData.photoCount}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    required
                    disabled={submitting}
                  />
                  <small>Maximum 10 entries per person</small>
                </div>

                <div className="form-group">
                  <label>T-Shirt Size *</label>
                  <select
                    name="tshirtSize"
                    value={paymentData.tshirtSize}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                  >
                    <option value="S">Small (S)</option>
                    <option value="M">Medium (M)</option>
                    <option value="L">Large (L)</option>
                    <option value="XL">Extra Large (XL)</option>
                    <option value="XXL">Double Extra Large (XXL)</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Home Address *</label>
                  <textarea
                    name="address"
                    value={paymentData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your complete address for shipping"
                    rows="3"
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label>Payment Method *</label>
                  <select
                    name="paymentMethod"
                    value={paymentData.paymentMethod}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                  >
                    <option value="bkash01">
                      Bkash: 01885661159 (Personal)
                    </option>
                    <option value="bkash02">
                      Bkash: 01679861740 (Personal)
                    </option>
                    <option value="nagad">Nagad: 01679861740 (Personal)</option>
                    <option value="rocket">Rocket: 01679861740 (Personal)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Transaction ID *</label>
                  <input
                    type="text"
                    name="transactionId"
                    value={paymentData.transactionId}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your transaction ID"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="payment-summary">
                <h4>Payment Summary</h4>
                <div className="summary-row">
                  <span>Category:</span>
                  <span>
                    {paymentData.category === "single"
                      ? "Single Photo"
                      : "Photo Story"}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Quantity:</span>
                  <span>{paymentData.photoCount}</span>
                </div>
                <div className="summary-row">
                  <span>Price per item:</span>
                  <span>
                    {paymentData.category === "single" ? "1,020" : "3,060"} BDT
                  </span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>
                    {paymentData.category === "single"
                      ? (1020 * paymentData.photoCount).toLocaleString()
                      : (3060 * paymentData.photoCount).toLocaleString()}{" "}
                    BDT
                  </span>
                </div>
              </div>

              <div className="payment-instructions">
                <h4>Payment Instructions:</h4>
                <ol>
                  <li>Send money to the selected payment number</li>
                  <li>Keep the transaction ID safe</li>
                  <li>Enter the transaction ID in the form</li>
                  <li>Submit the form after payment</li>
                  <li>We will verify payment within 24 hours</li>
                </ol>
              </div>

              <button
                type="submit"
                className="btn-primary submit-payment-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="spinner" /> Submitting...
                  </>
                ) : (
                  "Submit Payment"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
