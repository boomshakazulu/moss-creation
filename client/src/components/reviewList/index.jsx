import React from "react";
import ReviewCard from "../reviewCard/index";
import "./index.css";

const ReviewList = ({ reviews, currentUser }) => {
  // Filter out reviews with text and set isOwner prop
  const filteredReviews = reviews.filter(
    (review) => review.text && review.author === currentUser
  );

  return (
    <div className="review-list">
      <h2>Product Reviews</h2>
      {filteredReviews.map((review, index) => (
        <ReviewCard
          key={index}
          reviewId={review._id}
          username={review.author}
          createdAt={review.createdAt}
          text={review.text}
          rating={review.rating}
          isOwner={review.author === currentUser}
        />
      ))}
      {reviews[0].text !== null
        ? reviews.map((review, index) => (
            <ReviewCard
              key={index}
              reviewId={review._id}
              username={review.author}
              createdAt={review.createdAt}
              text={review.text}
              rating={review.rating}
              isOwner={false}
            />
          ))
        : ""}
    </div>
  );
};

export default ReviewList;
