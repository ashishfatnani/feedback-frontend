// src/components/FeedbackList.js
import React from "react";

const FeedbackList = ({ feedbacks }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Get emoji for app happiness
  const getHappinessEmoji = (value) => {
    const emojis = ["", "😢", "😕", "😐", "🙂", "😄"];
    return emojis[value] || "❓";
  };

  return (
    <div className="feedback-list">
      <h2>Recent Feedback</h2>

      {feedbacks.length === 0 ? (
        <p>No feedback found. Be the first to submit!</p>
      ) : (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Message</th>
              <th>Rating</th>
              <th>App Happiness</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.customer_name}</td>
                <td>{feedback.message}</td>
                <td>
                  <div className="star-rating">
                    {"★".repeat(feedback.rating)}
                    {"☆".repeat(5 - feedback.rating)}
                  </div>
                </td>
                <td className="emoji-cell">
                  {getHappinessEmoji(feedback.app_happiness)}
                </td>
                <td>{formatDate(feedback.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FeedbackList;
