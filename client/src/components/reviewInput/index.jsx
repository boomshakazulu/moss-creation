import React, { useState } from "react";
import "./index.css";

const ReviewInput = () => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0); // Initially, no stars are selected

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can handle submitting the review, including the review text and rating
    console.log("Review Text:", reviewText);
    console.log("Rating:", rating);
    // Add your logic to submit the review to the server or store it locally
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h4 className="review-title">Let others know what you think!</h4>
      <div className="input-stars">
        <label>Rating:</label>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            style={{ color: star <= rating ? "gold" : "gray" }}
            className="stars"
          >
            &#9733; {/* Unicode character for a star */}
          </button>
        ))}
      </div>
      <div className="input-review">
        <label htmlFor="reviewText"></label>
        <textarea
          id="reviewText"
          value={reviewText}
          onChange={handleReviewTextChange}
          rows={4}
          cols={50}
          placeholder="Write a review (optional)"
        />
      </div>
      <button type="submit" className="review-submit">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewInput;
