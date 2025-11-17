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

  // Google Apps Script URL for gallery - USE THE SAME AS ADMIN
  const GALLERY_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxgsTUWlUqT0gxhD4Um6RbU9Xre1RJyE0cOyWaJEStKVkFLdIhlMITI1l1bHN4I7XlbaA/exec";

  // Mock events (these remain the same)
  const mockEvents = [
    { id: "1", name: "Friday Exposure", slug: "Friday-Exposure" },
    { id: "2", name: "Photo Adda", slug: "Photo-Adda" },
    { id: "3", name: "Photo Walk", slug: "Photo-Walk" },
    { id: "4", name: "Exhibitions Visit", slug: "Exhibitions-Visit" },
    { id: "5", name: "Workshops & Talks", slug: "Workshops-and-Talks" },
    { id: "6", name: "Shutter Stories", slug: "Shutter-Stories" },
  ];

  // Fetch data from Google Sheets
  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      console.log("Fetching gallery data from:", GALLERY_SCRIPT_URL);

      // Try to fetch from the API first
      const response = await fetch(`${GALLERY_SCRIPT_URL}?action=getGallery`);
      console.log("API Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Gallery API response:", result);

        if (
          result.status === "success" &&
          result.data &&
          result.data.length > 0
        ) {
          console.log("Found", result.data.length, "photos from API");
          // Transform API data to match our photo structure
          const apiPhotos = result.data.map((photo) => ({
            id: photo.id ? photo.id.toString() : Math.random().toString(),
            url: photo.url || photo.imageUrl,
            title: photo.title || "Untitled",
            description: photo.description || "",
            eventId: photo.eventId ? photo.eventId.toString() : "1", // Ensure eventId is string
            uploadedAt: new Date(
              photo.uploadedAt || photo.timestamp || Date.now()
            ),
            facebookPost: photo.facebookPost || "",
          }));

          setPhotos(apiPhotos);
          setEvents(mockEvents);
          setLoading(false);
          return;
        } else {
          console.log("No data from API or empty response:", result);
        }
      } else {
        console.log("API response not OK:", response.status);
      }

      // Fallback to mock data if API fails or returns no data
      console.log("Using fallback mock data");
      fetchMockData();
    } catch (error) {
      console.error("Error fetching gallery data:", error);
      // Fallback to mock data
      fetchMockData();
    }
  };

  const fetchMockData = () => {
    // Your existing mock photos data
    const mockPhotos = [
      {
        id: "14",
        url: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1763290554/g14_ffmlvu.jpg",
        title:
          "Shutter Stories Chapter IV Call for Photo Inauguration Ceremony",
        description:
          "The Call for Photo Inauguration Ceremony of United Healthcare presents Shutter Stories Chapter IV was held on 15th November, officially marking the beginning of this year's national photography exhibition...",
        eventId: "6",
        uploadedAt: new Date(),
        facebookPost: "https://www.facebook.com/share/p/1CjEqcYrc5/",
      },
      {
        id: "13",
        url: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762984257/g13_pumj44.jpg",
        title: "Sadarghat Photowalk Behind the Scenes",
        description:
          "Our recent Photowalk was more than just a walk with cameras, it was a journey through the heart of Dhaka...",
        eventId: "3",
        uploadedAt: new Date(),
        facebookPost: "https://www.facebook.com/share/p/1A3bKMZMei/",
      },
      // Add all your other mock photos here...
    ];

    setEvents(mockEvents);
    setPhotos(mockPhotos);
    setLoading(false);
  };

  const filterPhotos = useCallback(() => {
    let filtered = photos;

    if (activeFilter !== "all") {
      filtered = photos.filter((photo) => photo.eventId === activeFilter);
    }

    // Sort by ID in descending order (newest first)
    const sortedPhotos = [...filtered].sort((a, b) => {
      // Convert to numbers for proper numeric sorting
      const idA = parseInt(a.id) || 0;
      const idB = parseInt(b.id) || 0;
      return idB - idA;
    });
    
    setFilteredPhotos(sortedPhotos);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [activeFilter, photos]);

  useEffect(() => {
    filterPhotos();
  }, [filterPhotos]);

  // Get current photos for pagination
  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = filteredPhotos.slice(
    indexOfFirstPhoto,
    indexOfLastPhoto
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const openLightbox = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  // Debug: Log current state
  useEffect(() => {
    console.log("Active Filter:", activeFilter);
    console.log("Total Photos:", photos.length);
    console.log("Filtered Photos:", filteredPhotos.length);
    console.log("Events:", events);
  }, [activeFilter, photos, filteredPhotos, events]);

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

      <PhotoGrid photos={currentPhotos} onPhotoClick={openLightbox} />

      {/* Pagination Component */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            <button
              className={`pagination-btn ${
                currentPage === 1 ? "disabled" : ""
              }`}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    className={`pagination-btn ${
                      currentPage === number ? "active" : ""
                    }`}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                )
              )}
            </div>

            <button
              className={`pagination-btn ${
                currentPage === totalPages ? "disabled" : ""
              }`}
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          <div className="pagination-info">
            Showing {indexOfFirstPhoto + 1}-
            {Math.min(indexOfLastPhoto, filteredPhotos.length)} of{" "}
            {filteredPhotos.length} photos
          </div>
        </div>
      )}

      {selectedPhoto && (
        <Lightbox photo={selectedPhoto} onClose={closeLightbox} />
      )}
    </div>
  );
};

export default Gallery;