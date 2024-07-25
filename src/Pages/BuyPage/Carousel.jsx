import React, { useState } from "react";

const CustomCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="buy-page-carousel">
      <div className="carousel-left" onClick={handlePrev}>
        <i class="fas fa-arrow-left"></i>
      </div>

      {items[currentIndex]}
      <div className="carousel-right" onClick={handleNext}>
        <i class="fas fa-arrow-right"></i>
      </div>
    </div>
  );
};

export default CustomCarousel;
