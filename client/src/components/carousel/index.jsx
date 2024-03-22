import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";

const Carousel = ({ items, isHomePage }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesToShow = isHomePage
    ? items.map((item) => item.carousel)
    : items.photo;

  // Conditionally apply CSS classes
  const containerClass = isHomePage ? "homepage-carousel" : "product-carousel";

  // Preload images before rendering
  useEffect(() => {
    const preloadImages = () => {
      const imagePromises = imagesToShow.map((image) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = image;
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
  }, [imagesToShow]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: isHomePage,
  };

  return (
    <div className={`${containerClass} ${imagesLoaded ? "loaded" : ""}`}>
      {imagesLoaded && (
        <Slider {...settings} className="carousel">
          {imagesToShow.map((image, index) => (
            <div key={index}>
              {isHomePage ? (
                <Link to={`/item/${items[index]._id}`}>
                  <img src={image} alt={items[index].name} />
                </Link>
              ) : (
                <img src={image} alt={items.name} />
              )}
            </div>
          ))}
        </Slider>
      )}
      {!imagesLoaded && <p>Loading...</p>}
    </div>
  );
};

export default Carousel;
