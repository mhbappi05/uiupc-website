// pages/Gallery.js
import React, { useState, useEffect, useCallback } from "react";
import PhotoGrid from "../components/PhotoGrid";
import FilterBar from "../components/FilterBar";
import Lightbox from "../components/Lightbox";
import "./Gallery.css";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [photosPerPage] = useState(12);

  // Mock data for demonstration
  useEffect(() => {
    fetchMockData();
  }, []);

  const filterPhotos = useCallback(() => {
    let filtered = photos;
    
    if (activeFilter !== "all") {
      filtered = photos.filter((photo) => photo.eventId === activeFilter);
    }
    
    // Sort by ID in descending order (newest first)
    const sortedPhotos = [...filtered].sort((a, b) => b.id - a.id);
    setFilteredPhotos(sortedPhotos);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [activeFilter, photos]);

  useEffect(() => {
    filterPhotos();
  }, [filterPhotos]);

  // Get current photos for pagination
  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = filteredPhotos.slice(indexOfFirstPhoto, indexOfLastPhoto);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);

  const fetchMockData = () => {
    // Mock events
    const mockEvents = [
      { id: "1", name: "Friday Exposure", slug: "Friday-Exposure" },
      { id: "2", name: "Photo Adda", slug: "Photo-Adda" },
      { id: "3", name: "Photo Walk", slug: "Photo-Walk" },
      { id: "4", name: "Exhibitions Visit", slug: "Exhibitions-Visit" },
      { id: "5", name: "Workshops & Talks", slug: "Workshops-and-Talks" },
    ];

    // Simplified mock photos - note IDs are strings but can be compared numerically
    const mockPhotos = [
      {
        id: "13",
        url: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762984257/g13_pumj44.jpg",
        title: "Sadarghat Photowalk Behind the Scenes",
        description: "Our recent Photowalk was more than just a walk with cameras, it was a journey through the heart of Dhaka. From the buzzing streets of Nilkhet, through the colorful chaos of the city, to the vibrant river life at Sadarghat, every step was filled with stories, laughter and teamwork.Here's a glimpse of the behind the scenes moments, the candid smiles, the rush to capture fleeting moments and the joy of exploring together  that made the day unforgettable.",
        eventId: "3",
        uploadedAt: new Date(),
        facebookPost: "https://www.facebook.com/share/p/1A3bKMZMei/"
        
      },
      {
        id: "12",
        url: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762984261/12_s05jxv.jpg",
        title: "Vertex - Photography as a Language",
        description: "From the basics of photography as a language to exploring how images speak louder than words, this time Vertex session created a space for creativity, thought and connection. Members shared their ideas, interpretations, and experiences, making it an inspiring and thought-provoking afternoon. A big thank you to everyone who joined and made the event so memorable!",
        eventId: "5",
        uploadedAt: new Date(),
        facebookPost: "https://www.facebook.com/share/p/17uByGPiXH/"
      },
      {
        id: "11",
        url: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762984259/g11_mhutnu.jpg",
        title: "Vertex",
        description: "Vertex, hosted by the UIU Photography Club, turned out to be a standout success.Everyone enjoyed the session and learned how photography can tell stories, show emotion and capture powerful moments. Through open discussions, attendees explored how to read photographs beyond surface details and understand the deeper message behind each frame.By the end, participants left with a stronger grasp of how to use photography as a tool for expression.UIUPC is grateful to all the attendees for making it such a meaningful event.",
        eventId: "5",
        uploadedAt: new Date(),
        facebookPost: "https://www.facebook.com/share/p/17VKWLbSbj/"
      },
      {
        id: "10",
        url: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762984259/g10_zpkrwq.jpg",
        title: "Photo Walk Adda",
        description: "We recently hosted Photo Walk Adda, an engaging photography session where students explored the UIU campus and United City, capturing unique perspectives through their lenses.The experience was rich with creativity, experimentation and collaboration. While many impressive shots were taken, there were also a few missteps, each one serving a valuable step in the learning process.Here’s a glimpse behind the scenes, showcasing the spirit of exploration and the candid moments that made this event truly memorable.",
        eventId: "2",
        uploadedAt: new Date(),
        facebookPost: "https://www.facebook.com/share/p/1Co6wwjH73/"
      },
      {
        id: "9",
        url: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762984259/g9_afmn74.jpg",
        title: "Friday Exposure - Week 52",
        description: "This week, we spotlight a captivating photograph by our General Member, Siam Arefin. Titled 'সাড়া দাও' it truly mesmerizes. Congratulations to him for this remarkable contribution!",
        eventId: "1",
        uploadedAt: new Date(),
        facebookPost: "https://www.facebook.com/share/p/1Fg6t23Jhi/"
      },
      {
        id: "8",
        url: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762984258/g8_yuybrp.jpg",
        title: "Friday Exposure - Week 51",
        description: "This week, we spotlight a captivating photograph by our General Member, Pratoy Barua. Titled 'অবসর' it truly mesmerizes. Congratulations to him for this remarkable contribution!",
        eventId: "1",
        uploadedAt: new Date(),
        facebookPost: "https://www.facebook.com/share/p/16FVKqh13T/"
      },
      {
        id: "7",
        url: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762984269/g7_hiugcj.jpg",
        title: "“চর্চা”",
        description: "We had the pleasure of attending the 11th session of the “চর্চা” Lecture Series titled 'নেপথ্যের কথা: A Discourse on Architectural Photography' hosted by Department of Architecture, Bangladesh University. The session featured Asif Salman, renowned architectural photographer, artist and entrepreneur based in Bangladesh.Asif Salman shared his journey of blending architecture with visual storytelling, offering a deeper look into how photography can capture not just buildings, but the emotions, context and human experiences that surround them. From documenting award-winning structures to founding pioneering visual platforms, his work stands as an inspiration to the photography community. UIU Photography Club is grateful to Asif Salman for sharing his insights, experiences and creative philosophy. His words encouraged us to look beyond technique and focus on the meaning behind every shot. Our heartfelt thanks to Department of Architecture, Bangladesh University for hosting such an engaging and thought-provoking discussion. We are glad to have been a part of it!",
        eventId: "4",
        uploadedAt: new Date(),
        facebookPost: "https://www.facebook.com/share/p/1afTRpcupZ/"
      },
      {
        id: "6",
        url: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762984272/g6_ips6gt.jpg",
        title: "Phosphenes – Open Studio Exhibition Visit",
        description: "We had the opportunity to visit Phosphenes – Open Studio, a vibrant showcase of artistic journeys by the participants of Resting Academy Season II of Pathshala South Asian Media Institute. It was inspiring to witness the powerful visual narratives created over six months. Our heartfelt appreciation goes to the artists, curators and everyone involved in making this show a reality. UIU Photography Club is grateful to the organizers and everyone behind the scenes for putting together such a thoughtful and engaging exhibition.",
        eventId: "4",
        uploadedAt: new Date(),
        facebookPost: "https://www.facebook.com/share/p/1WcwRHnq19/"
      },
      {
        id: "5",
        url: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762984257/g5_ajlihy.jpg",
        title: "Friday Exposure - Week 50",
        description: "This week, we spotlight a captivating photograph by our General Member, Yashin Arafat Babu. Titled 'The silence of art and the noise of life' it truly mesmerizes. Congratulations to him for this remarkable contribution!",
        eventId: "1",
        uploadedAt: new Date(),
        facebookPost: "https://www.facebook.com/share/p/1Fz5LqUShq/"
      },
      {
        id: "4",
        url: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762984279/g4_ml39li.jpg",
        title: "Bangladesh Press Photo Contest 2025",
        description: "We had the privilege of visiting the Bangladesh Press Photo Contest 2025 exhibition at DrikPath Bhobon, a powerful showcase of truth, resilience and visual storytelling. The exhibition featured striking works from photojournalists across the country, each frame capturing raw moments that reflect our society’s realities. It was an inspiring experience for our team, reminding us of the impact photography can have in telling untold stories and sparking conversations.",
        eventId: "4",
        uploadedAt: new Date(),
        facebookPost: "https://www.facebook.com/share/p/1AonqCkDL3/"
      },
      {
        id: "3",
        url: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762984272/g3_ozcy3q.jpg",
        title: "‘ক্রমশ’ Exhibition Visit",
        description: "UIU Photography Club recently visited the solo visual art exhibition ‘ক্রমশ’ by renowned photographer Munem Wasif at Bengal Shilpalay. After almost sixteen years, the artist returned with a powerful showcase reflecting two decades of transformation, from the early days of analog photography in Old Dhaka to more experimental and personal visual narratives. The exhibition offered a deep, introspective look into the evolution of both the artist’s journey and medium, leaving the visiting members of UIUPC inspired! ",
        eventId: "4",
        uploadedAt: new Date(),
        facebookPost: "https://www.facebook.com/share/p/1CbopgC3sc/"
      },
      {
        id: "2",
        url: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762984272/g2_waadwo.jpg",
        title: "IPC Exhibition Visit",
        description: "UIU Photography Club (UIUPC) recently had the privilege of visiting the final venue of the National Photography Exhibition F11 See Sharp Season II, organized by the Independent Photography Club (IPC) of Independent University, Bangladesh. Held at the prestigious Intercontinental Dhaka, showcasing a powerful culmination of visual narratives from talented photographers across the nation.",
        eventId: "4",
        uploadedAt: new Date(),
        facebookPost: "https://www.facebook.com/share/p/17Lk2fBK9f/"
      },
      {
        id: "1",
        url: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762984258/g1_pdodvi.jpg",
        title: "Friday Exposure - Week 49",
        description: "This week, we spotlight a captivating photograph by our General Member, Mahin Muntasin Rahul. Titled 'অগ্নি' it truly mesmerizes. Congratulations to him for this remarkable contribution!",
        eventId: "1",
        uploadedAt: new Date(),
        facebookPost: "https://www.facebook.com/share/p/1CbGFvGcKg/"
      },
    ];

     setEvents(mockEvents);
    setPhotos(mockPhotos);
    setLoading(false);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const openLightbox = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  if (loading) {
    return <div className="loading">Loading gallery...</div>;
  }

  return (
    <div className="gallery-page">
      <div className="page-header">
        <h1>Photo Gallery</h1>
        <p>Explore our collection of stunning photographs</p>
      </div>

      <FilterBar
        events={events}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      <PhotoGrid 
        photos={currentPhotos} 
        onPhotoClick={openLightbox}
      />

      {/* Pagination Component */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            <button 
              className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              ))}
            </div>
            
            <button 
              className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          
          <div className="pagination-info">
            Showing {indexOfFirstPhoto + 1}-{Math.min(indexOfLastPhoto, filteredPhotos.length)} of {filteredPhotos.length} photos
          </div>
        </div>
      )}

      {selectedPhoto && (
        <Lightbox 
          photo={selectedPhoto} 
          onClose={closeLightbox}
        />
      )}
    </div>
  );
};

export default Gallery;