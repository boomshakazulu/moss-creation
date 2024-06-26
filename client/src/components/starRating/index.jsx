import React from "react";

const StarRating = ({ averageRating, setAverageRating, editable }) => {
  const totalStars = 5;
  const filledStars = Math.round(averageRating);

  const handleClick = (index) => {
    if (editable && setAverageRating) {
      setAverageRating(index);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      if (i <= filledStars) {
        stars.push(
          <span
            key={i}
            className="filled-star stars"
            style={{ color: "gold" }}
            onClick={() => handleClick(i)}
          >
            &#9733;
          </span>
        );
      } else {
        stars.push(
          <span
            key={i}
            style={{ color: "gray" }}
            className="empty-star stars"
            onClick={() => handleClick(i)}
          >
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
