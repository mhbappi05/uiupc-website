// App.js - Main Application Component
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import EventDetail from './pages/EventDetail';
import PhotoSubmissionForm from './components/PhotoSubmissionForm';
import Login from './pages/Login';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Styles
import './styles/App.css';

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Public Route component (redirect to admin if already logged in)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/admin" />;
};

// Main app content component
function AppContent() {
  const [featuredPhotos, setFeaturedPhotos] = useState([]);
  const [events, setEvents] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchFeaturedPhotos(),
          fetchUpcomingEvents()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
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

  // Show loading screen while auth is initializing
  if (authLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Navbar />
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
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route path="/register/:eventId" element={<PhotoSubmissionForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// Main App wrapper with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;