import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_REVIEW } from "../../utils/mutations";
import { useParams } from "react-router-dom";
import "./index.css";

const ReviewInput = ({ profileItemId }) => {
  const [reviewText, setReviewText] = useState("");
  const { itemId } = useParams();
  const [rating, setRating] = useState(0); // Initially, no stars are selected
  const [addReview, { loading, error }] = useMutation(ADD_REVIEW);

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await addReview({
        variables: {
          text: reviewText,
          itemId: itemId || profileItemId,
          rating: rating,
        },
      });
      console.log(result);
      window.location.reload();
    } catch (error) {
      console.error("Error adding review:", error);
    }
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
