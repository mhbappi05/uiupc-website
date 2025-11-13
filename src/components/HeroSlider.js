// components/HeroSlider.js - TEMPORARY LOCAL VERSION
import React, { useState, useEffect } from "react";
import "./HeroSlider.css";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Local slides data
  const localSlides = [
    {
      id: 1,
      imageUrl:
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1763054814/uiupc_HeroSlider1_d9kprm.jpg",
      title: "UIU Photography Club",
      subtitle: "Capturing Moments, Creating Memories",
      eventLink: "/events/shutter-stories",
    },
    {
      id: 2,
      imageUrl:
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762121158/uiupc_HeroSlider2_cyl1xw.jpg",
      title: "Join Our Community",
      subtitle: "Learn, Share, and Grow Together",
      eventLink: "/events/shutter-stories",
    },
    {
      id: 3,
      imageUrl:
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762799600/uiupc_HeroSlider3_iehvzr.png",
      title: "Shutter Stories - Chapter IV Coming Soon",
      subtitle: "Showcase Your Talent",
      eventLink: "/events/shutter-stories",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % localSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [localSlides.length]);

  return (
    <div className="hero-slider">
      {localSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === currentSlide ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        >
          <div className="slide-overlay"></div>
          <div className="slide-content">
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
            <div className="cta-buttons">
              <a href={slide.eventLink} className="btn btn-secondary">
                Participate in <br/>
                Shutter Stories - Chapter IV
              </a>
            </div>
          </div>
        </div>
      ))}

      {localSlides.length > 1 && (
        <div className="slider-indicators">
          {localSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
