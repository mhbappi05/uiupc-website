// components/HeroSlider.js - Eye-catching banner with featured photos
import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../firebase';
import './HeroSlider.css';

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const q = query(
          collection(db, 'heroSlides'), 
          orderBy('createdAt', 'desc'), 
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const slidesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSlides(slidesData);
      } catch (error) {
        console.error("Error fetching hero slides:", error);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (slides.length === 0) {
    return (
      <div className="hero-slider">
        <div className="slide active">
          <div className="slide-content">
            <h1>UIU Photography Club</h1>
            <p>Capturing Moments, Creating Memories</p>
            <div className="cta-buttons">
              <button className="btn-primary">Join Now</button>
              <button className="btn-secondary">View Gallery</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-slider">
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        >
          <div className="slide-overlay"></div>
          <div className="slide-content">
            <h1>{slide.title || "UIU Photography Club"}</h1>
            <p>{slide.subtitle || "Capturing Moments, Creating Memories"}</p>
            <div className="cta-buttons">
              <button className="btn-primary">Join Now</button>
              <button className="btn-secondary">View Gallery</button>
            </div>
          </div>
        </div>
      ))}
      <div className="slider-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;