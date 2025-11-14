// pages/Blog.js
import React, { useState } from 'react';
import './Blog.css';

// --- MediaCarousel Component ---
const MediaCarousel = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media || media.length === 0) {
    return null;
  }

  const goToPrevious = (e) => {
    e.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? media.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (e) => {
    e.stopPropagation();
    const isLastSlide = currentIndex === media.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  const currentMedia = media[currentIndex];

  return (
    <div className="blog-carousel-container">
      {media.length > 1 && (
        <>
          <div className="blog-carousel-arrow blog-left-arrow" onClick={goToPrevious}>
            &#10094;
          </div>
          <div className="blog-carousel-arrow blog-right-arrow" onClick={goToNext}>
            &#10095;
          </div>
        </>
      )}
      
      <div className="blog-slide-container" style={{lineHeight: 0 }}>
        {currentMedia.type === 'image' ? (
          <img 
            src={currentMedia.url} 
            alt={currentMedia.caption}
            className="blog-slide-content"
            loading="lazy"
            style={{ display: 'block', width: '100%' }}
          />
        ) : (
          <video 
            controls
            className="blog-slide-content"
            poster={currentMedia.thumbnail}
            style={{ display: 'block', width: '100%' }}
          >
            <source src={currentMedia.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {media.length > 1 && (
        <div className="blog-dots-container">
          {media.map((_, slideIndex) => (
            <div
              key={slideIndex}
              className={`blog-dot ${currentIndex === slideIndex ? 'active' : ''}`}
              onClick={() => goToSlide(slideIndex)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- PostCard Component ---
const PostCard = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  // Generate unique URL for this post
  const getPostUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const postSlug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return `${baseUrl}?post=${post.id}&slug=${postSlug}`;
  };

  const handleShare = () => {
    const postUrl = getPostUrl();
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description.substring(0, 100) + '...',
        url: postUrl,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(postUrl)
        .then(() => {
          alert('Post link copied to clipboard!');
        })
        .catch((error) => {
          console.log('Error copying to clipboard:', error);
          alert('Share this post: ' + postUrl);
        });
    }
  };

  const descriptionClass = isExpanded ? 'blog-post-description expanded' : 'blog-post-description';
  const buttonText = isExpanded ? 'Show Less' : 'Show More';

  return (
    <div className="blog-post-card">
      <h2 className="blog-post-title">{post.title}</h2>
      
      <div className={descriptionClass}>
        {post.description}
      </div>
      
      {post.description.length > 120 && (
        <button className="blog-show-more-btn" onClick={toggleDescription}>
          {buttonText}
        </button>
      )}
      
      <MediaCarousel media={post.media} />
      
      <div className="blog-post-meta">
        <span className="blog-post-date">{post.date}</span>
        <button className="blog-share-btn" onClick={handleShare}>
          📤 Share
        </button>
      </div>
    </div>
  );
};

const Blog = () => {
  const [posts] = useState([
    {
      id: 1,
      title: "Photography Day 2025",
      description: "Photography takes an instant out of time, altering life by holding it still.  -Dorothea Lange, American photographer.Wishing Happy World Photography Day 2025 from UIU Photography Club!",
      media: [
        { 
          type: 'image', 
          url: 'https://res.cloudinary.com/do0e8p5d2/image/upload/v1762799155/Blog04_taox6m.jpg',  
        }
      ],
      date: "August 19, 2025"
    },
    {
      id: 2,
      title: "Vertex : Language discussion",
      description: "We proudly presents another exciting chapter of Vertex! This time, we dive into Language Discussion, where photography meets the art of storytelling through words, visuals and expressions. Join us for an engaging session filled with creative exchanges, thought-provoking conversations! Date: Saturday, 23 August 2025 Time: 3:10 PM .Let's explore how language and photography blend together!",
      media: [
        { 
          type: 'image', 
          url: 'https://res.cloudinary.com/do0e8p5d2/image/upload/v1762797135/Blog03_jpaqiw.jpg',  
        }
      ],
      date: "August 22, 2025"
    },
    {
      id: 3,
      title: "Media Fest 2025 Achievements",
      description: "UIU Media Fest 2025 celebrated the brightest talents in creativity, storytelling and we are proud to announce that our very own Executive Members shined with their remarkable achievements! Minhaz Hossain Shemul secured the 1st Runner-up in the Photography Segment, capturing powerful stories! Zannatul Amin Anika, Mayesha Tun Nur, and Jonayed Shah Jesun achieved the 1st Runner-up in the Media Quiz Competition, showcasing their sharp knowledge and passion for media studies. Your hard work, creativity and dedication truly reflect the spirit of excellence that defines UIUPC. Keep inspiring and reaching new milestones!",
      media: [
        { 
          type: 'image', 
          url: 'https://res.cloudinary.com/do0e8p5d2/image/upload/v1762796842/Blog01_rcdns7.jpg',  
        },
        { 
          type: 'image', 
          url: 'https://res.cloudinary.com/do0e8p5d2/image/upload/v1762796842/Blog02_r0zkvb.jpg', 
        }
      ],
      date: "September 30, 2025"
    },
    {
      id: 4,
      title: "Something is cooking??",
      description: "Exciting news is on the horizon! UIU Photography Club is thrilled to announce that we are cooking up something special just for you. Stay tuned for an upcoming event that promises to ignite your creativity and passion for photography. Get ready to capture moments, learn new skills, and connect with fellow photography enthusiasts. Keep an eye on our page for more details coming soon!",
      media: [
        { 
          type: 'image', 
          url: 'https://res.cloudinary.com/do0e8p5d2/image/upload/v1762799836/Blog5_lbkrue.png',  
        }
      ],
      date: "November 11, 2025"
    },
    {
      id: 5,
      title: "Whats happening at UIUPC?",
      description: "Happening something crazy or not! Let's See! Stay tune with UIUPC.",
      media: [
        { 
          type: 'image',
          url: 'https://res.cloudinary.com/do0e8p5d2/image/upload/v1763063064/Blog6_x6ywrm.jpg',
        }
      ],
      date: "November 14, 2025"
    },
    {
      id: 6,
      title: "Shutter Stories Chapter IV Identity Revealed!",
      description: "The moment has finally arrived; United Healthcare Presents Shutter Stories Chapter IV unveils its official identity. The legacy continues as we prepare for yet another national gathering of photographers and storytellers. With fresh energy and limitless possibilities, this chapter is set to define creativity. The Call for Photo goes live soon. Stay tuned!",
      media: [
        { 
          type: 'video',
          url: 'https://res.cloudinary.com/do0e8p5d2/video/upload/v1763138349/Shutter_Stories_Chapter_4_-_2025_Promo_glsjvm.mp4',
          thumbnail: 'https://res.cloudinary.com/do0e8p5d2/image/upload/v1763138365/ShutterVThum01_et8lv2.jpg'
        }
      ],
      date: "November 14, 2025" 
    }
  ].sort((a, b) => new Date(b.date) - new Date(a.date))); // Sort posts in descending order

  return (
    <div className="blog-page">
      <div className="blog-page-header">
        <h1>News & Updates</h1>
        <p>Stories, tutorials, and updates from our photography community</p>
      </div>
      
      <div className="blog-container">
        <div className="blog-content">
          <div className="blog-posts-grid">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;