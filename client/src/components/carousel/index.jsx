import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";

const Carousel = ({ items }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload images before rendering
  useEffect(() => {
    const preloadImages = () => {
      const imagePromises = items.map((item) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = item.carousel;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      // Set state when all images are loaded
      Promise.all(imagePromises)
        .then(() => setImagesLoaded(true))
        .catch((error) => console.error("Error preloading images:", error));
    };

    preloadImages();
  }, [items]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <div className={`carousel-container ${imagesLoaded ? "loaded" : ""}`}>
      {imagesLoaded && (
        <Slider {...settings} className="carousel">
          {items.map((item) => (
            <div key={item._id}>
              <Link to={`/item/${item._id}`}>
                <img src={item.carousel} alt={item._id} />
              </Link>
            </div>
          ))}
        </Slider>
      )}
      {!imagesLoaded && <p>Loading...</p>}
    </div>
  );
};

export default Carousel;
