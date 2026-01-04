// components/HeroSlider.js - TEMPORARY LOCAL VERSION
import React, { useState, useEffect, useRef } from "react";
import "./HeroSlider.css";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRefs = useRef([]);
  const slideTimerRef = useRef(null);

  // Local slides data
  const localSlides = [
    {
      id: 2,
      imageUrl:
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1766601236/event_cover-02_uc2p0k.png",
      title: "Shutter Stories - Chapter IV",
      subtitle: "Phase 02",
      subtitle2: "In UIU Multipurpose Hall on January 6 and 7, 2026. ",
      eventLink: "/results",
      type: "image",
      duration: 15000, // 15 seconds for images
    },
    {
      id: 1,
      videoUrl:
        "https://res.cloudinary.com/do0e8p5d2/video/upload/v1763138349/Shutter_Stories_Chapter_4_-_2025_Promo_glsjvm.mp4",
      title: "Shutter Stories - Chapter IV",
      subtitle: "Showcase Your Talent",
      eventLink: "/results",
      type: "video",
      duration: 74000, // 74 seconds for video (1 min 14 sec)
    },
    {
      id: 2,
      imageUrl:
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1763054814/uiupc_HeroSlider1_d9kprm.jpg",
      title: "UIU Photography Club",
      subtitle: "Capturing Moments, Creating Memories",
      eventLink: "/results",
      type: "image",
      duration: 5000, // 5 seconds for images
    },
    {
      id: 3,
      imageUrl:
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762799600/uiupc_HeroSlider3_iehvzr.png",
      title: "Shutter Stories - Chapter IV",
      subtitle: "Submit Your Photos",
      eventLink: "/results",
      type: "image",
      duration: 5000, // 5 seconds for images
    },
    {
      id: 4,
      imageUrl:
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1763225125/HeroSlider04_zqnypu.jpg",
      title: "Call for Photo",
      subtitle: "Submit Now for National Exhibition",
      eventLink: "/results",
      type: "image",
      duration: 5000, // 5 seconds for images
    },
    {
      id: 5,
      imageUrl:
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762121158/uiupc_HeroSlider2_cyl1xw.jpg",
      title: "Join Our Community",
      subtitle: "Learn, Share, and Grow Together",
      eventLink: "/results",
      type: "image",
      duration: 5000, // 5 seconds for images
    },
  ];

  // Function to start slide timer
  const startSlideTimer = (duration) => {
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }

    slideTimerRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % localSlides.length);
    }, duration);
  };

  // Handle slide changes
  useEffect(() => {
    const currentSlideData = localSlides[currentSlide];

    if (currentSlideData.type === "image") {
      // For images, use the timer
      startSlideTimer(currentSlideData.duration);
    }
    // For videos, we rely on the video end event

    // Handle video playback
    localSlides.forEach((slide, index) => {
      const videoRef = videoRefs.current[index];
      if (videoRef) {
        if (index === currentSlide && slide.type === "video") {
          // Reset and play the video from beginning
          videoRef.currentTime = 0;
          videoRef.play().catch((error) => {
            console.log("Video autoplay failed:", error);
            // If video fails to autoplay, fall back to timer
            startSlideTimer(slide.duration);
          });
        } else {
          videoRef.pause();
          videoRef.currentTime = 0;
        }
      }
    });

    return () => {
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, [currentSlide, localSlides]);

  // Handle video end to move to next slide
  const handleVideoEnd = () => {
    setCurrentSlide((prev) => (prev + 1) % localSlides.length);
  };

  const addVideoRef = (el, index) => {
    videoRefs.current[index] = el;
    if (el) {
      el.addEventListener("ended", handleVideoEnd);
    }
  };

  // Handle manual slide change via indicators
  const handleManualSlideChange = (index) => {
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }
    setCurrentSlide(index);
  };

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      videoRefs.current.forEach((videoRef) => {
        if (videoRef) {
          videoRef.removeEventListener("ended", handleVideoEnd);
        }
      });
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="hero-slider">
      {localSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === currentSlide ? "active" : ""}`}
          style={
            slide.type === "image"
              ? { backgroundImage: `url(${slide.imageUrl})` }
              : {}
          }
        >
          {slide.type === "video" && (
            <video
              ref={(el) => addVideoRef(el, index)}
              className="slide-video"
              muted
              playsInline
            >
              <source src={slide.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <div className="slide-overlay"></div>
          <div className="slide-content">
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
            <p>{slide.subtitle2}</p>
            <div className="cta-buttons">
              <a href={slide.eventLink} className="btn btn-secondary">
                Shutter Stories - Chapter IV <br/>
                View Results
              </a>
            </div>
            {/* <div className="cta-buttons">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "The result will be published soon. Stay tuned with us!\n\nClick OK to continue."
                    )
                  ) {
                    // You can add additional logic here if needed
                  }
                }}
                className="btn btn-secondary"
              >
                Shutter Stories - Chapter IV <br />
                View Results
              </button>
            </div> */}
          </div>
        </div>
      ))}

      {localSlides.length > 1 && (
        <div className="slider-indicators">
          {localSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => handleManualSlideChange(index)}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
