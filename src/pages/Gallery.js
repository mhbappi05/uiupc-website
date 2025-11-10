// pages/Gallery.js - Organized photo gallery with filtering
import React, { useState, useEffect } from 'react';
//import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
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

  // useEffect(() => {
  //   fetchPhotos();
  //   fetchCategories();
  //   fetchEvents();
  // }, []);

  // useEffect(() => {
  //   filterPhotos();
  // }, [activeFilter, filterType, photos]);

  // const fetchPhotos = async () => {
  //   try {
  //     const q = query(collection(db, 'photos'), orderBy('uploadedAt', 'desc'));
  //     const querySnapshot = await getDocs(q);
  //     const photosData = querySnapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data()
  //     }));
  //     setPhotos(photosData);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching photos:", error);
  //     setLoading(false);
  //   }
  // };

  // const fetchCategories = async () => {
  //   try {
  //     const q = query(collection(db, 'categories'));
  //     const querySnapshot = await getDocs(q);
  //     const categoriesData = querySnapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data()
  //     }));
  //     setCategories(categoriesData);
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   }
  // };

  // const fetchEvents = async () => {
  //   try {
  //     const q = query(collection(db, 'events'), orderBy('date', 'desc'));
  //     const querySnapshot = await getDocs(q);
  //     const eventsData = querySnapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data()
  //     }));
  //     setEvents(eventsData);
  //   } catch (error) {
  //     console.error("Error fetching events:", error);
  //   }
  // };

  // const filterPhotos = () => {
  //   if (activeFilter === 'all') {
  //     setFilteredPhotos(photos);
  //   } else {
  //     if (filterType === 'category') {
  //       setFilteredPhotos(photos.filter(photo => photo.category === activeFilter));
  //     } else if (filterType === 'event') {
  //       setFilteredPhotos(photos.filter(photo => photo.eventId === activeFilter));
  //     }
  //   }
  // };

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