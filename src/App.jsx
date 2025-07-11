/**
 * Main application component.
 * 
 * This component fetches podcast data from an API and manages the state for
 * the list of podcasts, selected podcast, loading state, and error handling.
 * It renders the header, hero section, filter, and podcast cards, as well as
 * modals for detailed podcast information.
 * 
 * @component
 * @returns {JSX.Element} The rendered App component.
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Filter from './components/Filter';
import PodcastCard from './components/PodcastCard';
import PodcastModal from './components/PodcastModal';
import FullScreenModal from './components/FullScreenModal';

const App = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch podcast data from the API
  const fetchPodcasts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://podcast-api.netlify.app/');
      setPodcasts(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching podcasts:", err);
      setError("Failed to load podcasts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch podcasts when the component mounts
  useEffect(() => {
    fetchPodcasts();
  }, []);

  const handleSelectPodcast = (podcast) => {
    setSelectedPodcast(podcast);
  };

  const handleCloseModal = () => {
    setSelectedPodcast(null);
  };

  const handleOpenFullScreenModal = () => {
    setIsFullScreenModalOpen(true);
  };

  const handleCloseFullScreenModal = () => {
    setIsFullScreenModalOpen(false);
  };

  return (
    <div>
      <Header />
      <HeroSection />
      <Filter />
      
      <section className="podcast-card container">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading podcasts...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button 
              className="retry-button"
              onClick={fetchPodcasts}
            >
              Retry
            </button>
          </div>
        ) : (
          podcasts.map((podcast) => (
            <PodcastCard 
              key={podcast.id} 
              podcast={podcast} 
              onSelect={handleSelectPodcast} 
            />
          ))
        )}
      </section>
      
      <PodcastModal 
        podcast={selectedPodcast} 
        onClose={handleCloseModal} 
        onViewMore={handleOpenFullScreenModal} 
      />
      <FullScreenModal 
        podcast={selectedPodcast} 
        isOpen={isFullScreenModalOpen} 
        onClose={handleCloseFullScreenModal} 
      />
    </div>
  );
};

export default App;
