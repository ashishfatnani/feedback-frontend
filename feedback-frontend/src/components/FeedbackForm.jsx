import React, { useState } from "react";

const FeedbackForm = ({ onSubmit }) => {
  const initialState = {
    customer_name: "",
    message: "",
    rating: "",
    app_happiness: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user changes it
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleEmojiSelect = (value) => {
    setFormData({ ...formData, app_happiness: value });
    if (errors.app_happiness) {
      setErrors({ ...errors, app_happiness: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Name is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    if (!formData.rating) {
      newErrors.rating = "Rating is required";
    }

    if (!formData.app_happiness) {
      newErrors.app_happiness = "App happiness rating is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setSubmitting(true);

    // Submit form data
    const result = await onSubmit(formData);

    setSubmitting(false);

    if (result.success) {
      // Reset form on success
      setFormData(initialState);
      setSubmitSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } else {
      // Display server validation errors
      setErrors(result.errors);
    }
  };

  // Emoji mapping for app happiness
  const emojis = [
    { value: 1, emoji: "😢" },
    { value: 2, emoji: "😕" },
    { value: 3, emoji: "😐" },
    { value: 4, emoji: "🙂" },
    { value: 5, emoji: "😄" },
  ];

  return (
    <div className="feedback-form-container">
      <h2>Submit Your Feedback</h2>

      {submitSuccess && (
        <div className="success-message">Thank you for your feedback!</div>
      )}

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="customer_name">Your Name</label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            className={errors.customer_name ? "error" : ""}
          />
          {errors.customer_name && (
            <span className="error-text">{errors.customer_name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="message">Feedback Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className={errors.message ? "error" : ""}
          ></textarea>
          {errors.message && (
            <span className="error-text">{errors.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating (1-5 stars)</label>
          <div className="rating-selector">
            {[1, 2, 3, 4, 5].map((num) => (
              <label key={num} className="rating-label">
                <input
                  type="radio"
                  name="rating"
                  value={num}
                  checked={parseInt(formData.rating) === num}
                  onChange={handleChange}
                />
                <span
                  className={`star ${
                    parseInt(formData.rating) >= num ? "selected" : ""
                  }`}
                >
                  ★
                </span>
              </label>
            ))}
          </div>
          {errors.rating && <span className="error-text">{errors.rating}</span>}
        </div>

        <div className="form-group">
          <label>How happy are you with this app?</label>
          <div className="emoji-selector">
            {emojis.map(({ value, emoji }) => (
              <button
                type="button"
                key={value}
                className={`emoji-btn ${
                  parseInt(formData.app_happiness) === value ? "selected" : ""
                }`}
                onClick={() => handleEmojiSelect(value)}
                aria-label={`Rate ${value} out of 5`}
              >
                {emoji}
              </button>
            ))}
          </div>
          {errors.app_happiness && (
            <span className="error-text">{errors.app_happiness}</span>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
