import React, { useState, useEffect } from "react";
import "./App.css";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null);

  // Fetch feedback data
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const url = filter
        ? `${API_URL}/feedback?rating=${filter}`
        : `${API_URL}/feedback`;
      const response = await axios.get(url);
      setFeedbacks(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch feedback data. Please try again later.");
      console.error("Error fetching feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  // Submit new feedback
  const handleSubmit = async (feedbackData) => {
    try {
      const response = await axios.post(`${API_URL}/feedback`, feedbackData);
      setFeedbacks([response.data, ...feedbacks].slice(0, 10));
      return { success: true };
    } catch (err) {
      console.error("Error submitting feedback:", err);
      return {
        success: false,
        errors: err.response?.data?.errors || {
          general: ["Failed to submit feedback"],
        },
      };
    }
  };

  // Filter by rating
  const handleFilterChange = (rating) => {
    setFilter(rating === filter ? null : rating);
  };

  // Fetch data on mount and when filter changes
  useEffect(() => {
    fetchFeedbacks();
  }, [filter]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Customer Feedback</h1>
      </header>
      <main className="container">
        <FeedbackForm onSubmit={handleSubmit} />

        <div className="filter-container">
          <h3>Filter by rating:</h3>
          <div className="rating-filters">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                className={`filter-btn ${filter === rating ? "active" : ""}`}
                onClick={() => handleFilterChange(rating)}
              >
                {rating} ★
              </button>
            ))}
            {filter && (
              <button
                className="filter-btn clear"
                onClick={() => setFilter(null)}
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p>Loading feedback...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <FeedbackList feedbacks={feedbacks} />
        )}
      </main>
    </div>
  );
}

export default App;
