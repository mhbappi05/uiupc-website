// App.js - Main Application Component
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Members from './pages/Members';
import Events from './pages/Events';
import Blog from './pages/Blog';
import Join from './pages/Join';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Loading from './components/Loading';

// Styles
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [featuredPhotos, setFeaturedPhotos] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Authentication state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Fetch initial data
    fetchFeaturedPhotos();
    fetchUpcomingEvents();

    return () => unsubscribe();
  }, []);

  const fetchFeaturedPhotos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'featuredPhotos'));
      const photos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeaturedPhotos(photos);
    } catch (error) {
      console.error("Error fetching featured photos:", error);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Filter upcoming events
      const upcoming = eventsData.filter(event => 
        new Date(event.date) >= new Date()
      ).sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(upcoming);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} />
        <main>
          <Routes>
            <Route path="/" element={
              <Home 
                featuredPhotos={featuredPhotos} 
                events={events} 
              />
            } />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/members" element={<Members />} />
            <Route path="/events" element={<Events />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/join" element={<Join />} />
            <Route path="/contact" element={<Contact />} />
            {user && <Route path="/admin" element={<Admin user={user} />} />}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;