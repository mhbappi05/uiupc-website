// pages/Gallery.js - Organized photo gallery with filtering
import React, { useState, useEffect, useCallback } from 'react';
import PhotoGrid from '../components/PhotoGrid';
import FilterBar from '../components/FilterBar';
import Lightbox from '../components/Lightbox';
import './Gallery.css';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterType, setFilterType] = useState('category');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    fetchMockData();
  }, []);

  useEffect(() => {
    filterPhotos();
  }, [activeFilter, filterType, photos]);

  const fetchMockData = () => {
    // Mock categories
    const mockCategories = [
      { id: '1', name: 'Landscape', slug: 'landscape' },
      { id: '2', name: 'Portrait', slug: 'portrait' },
      { id: '3', name: 'Street', slug: 'street' },
      { id: '4', name: 'Wildlife', slug: 'wildlife' },
      { id: '5', name: 'Architecture', slug: 'architecture' },
    ];

    // Mock events
    const mockEvents = [
      { id: '1', name: 'Summer Contest 2024', slug: 'summer-contest-2024' },
      { id: '2', name: 'Urban Exploration', slug: 'urban-exploration' },
      { id: '3', name: 'Nature Week', slug: 'nature-week' },
    ];

    // Mock photos with 500px-style data
    const mockPhotos = [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        title: 'Mountain Landscape',
        description: 'Beautiful mountain view at sunset',
        category: 'landscape',
        eventId: '1',
        uploadedAt: new Date(),
        user: { name: 'John Photographer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' },
        likes: 142,
        views: 1250,
        camera: 'Canon EOS R5',
        lens: '24-70mm f/2.8',
        location: 'Swiss Alps'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
        title: 'Urban Portrait',
        description: 'Street style portrait in the city',
        category: 'portrait',
        eventId: '2',
        uploadedAt: new Date(),
        user: { name: 'Sarah Visuals', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786' },
        likes: 89,
        views: 980,
        camera: 'Sony A7III',
        lens: '85mm f/1.4',
        location: 'New York'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
        title: 'Enchanted Forest',
        description: 'Mystical forest path in autumn',
        category: 'landscape',
        eventId: '3',
        uploadedAt: new Date(),
        user: { name: 'Mike Explorer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e' },
        likes: 256,
        views: 2100,
        camera: 'Nikon Z7',
        lens: '14-24mm f/2.8',
        location: 'Pacific Northwest'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e',
        title: 'Architectural Marvel',
        description: 'Modern architecture lines and shapes',
        category: 'architecture',
        uploadedAt: new Date(),
        user: { name: 'Alex Designer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
        likes: 67,
        views: 750,
        camera: 'Fujifilm X-T4',
        lens: '16-55mm f/2.8',
        location: 'Tokyo'
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7',
        title: 'Wildlife Moment',
        description: 'Elephant in the wild',
        category: 'wildlife',
        eventId: '3',
        uploadedAt: new Date(),
        user: { name: 'Wildlife Watcher', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
        likes: 198,
        views: 1650,
        camera: 'Canon 1DX Mark III',
        lens: '400mm f/2.8',
        location: 'Kenya'
      },
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0',
        title: 'City Lights',
        description: 'Urban night photography',
        category: 'street',
        eventId: '2',
        uploadedAt: new Date(),
        user: { name: 'Night Shooter', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5' },
        likes: 124,
        views: 1100,
        camera: 'Sony A7S III',
        lens: '35mm f/1.4',
        location: 'Hong Kong'
      }
    ];

    setCategories(mockCategories);
    setEvents(mockEvents);
    setPhotos(mockPhotos);
    setLoading(false);
  };

  const filterPhotos = useCallback(() => {
    if (activeFilter === 'all') {
      setFilteredPhotos(photos);
    } else {
      if (filterType === 'category') {
        setFilteredPhotos(photos.filter(photo => photo.category === activeFilter));
      } else if (filterType === 'event') {
        setFilteredPhotos(photos.filter(photo => photo.eventId === activeFilter));
      }
    }
  }, [activeFilter, filterType, photos]);

  useEffect(() => {
    filterPhotos();
  }, [filterPhotos]);

  const handleFilterChange = (filter, type) => {
    setActiveFilter(filter);
    setFilterType(type);
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
        categories={categories}
        events={events}
        activeFilter={activeFilter}
        filterType={filterType}
        onFilterChange={handleFilterChange}
      />
      
      <PhotoGrid 
        photos={filteredPhotos} 
        onPhotoClick={openLightbox}
      />
      
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