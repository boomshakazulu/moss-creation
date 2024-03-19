import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";

const Carousel = ({ items }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleClick = () => {
    const itemId = items[currentSlide]._id;
    navigate(itemId);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  return (
    <div className="carousel-container">
      <Slider {...settings} className="carousel">
        {items.map((item) => (
          <div key={item._id} onClick={handleClick}>
            <img
              src={item.carousel}
              alt={item._id}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "fallback-image-url"; // Provide a fallback image URL
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
