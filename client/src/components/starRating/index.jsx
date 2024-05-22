import React from "react";

const StarRating = ({ averageRating }) => {
  const totalStars = 5;
  const filledStars = Math.round(averageRating * totalStars);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      if (i <= filledStars) {
        stars.push(
          <span key={i} className="filled-star">
            &#9733;
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="empty-star">
            &#9734;
          </span>
        );
      }
    }
    return stars;
  };

  return <div>{renderStars()}</div>;
};

export default StarRating;
