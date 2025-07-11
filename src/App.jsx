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
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [noResultsMessage, setNoResultsMessage] = useState(''); // New state for no results message

  const fetchPodcasts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://podcast-api.netlify.app/');
      setPodcasts(response.data);
      setFilteredPodcasts(response.data); // Initialize filtered podcasts
      setError(null);
    } catch (err) {
      console.error("Error fetching podcasts:", err);
      setError("Failed to load podcasts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  // Function to handle search input
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term) {
      const filtered = podcasts.filter(podcast =>
        podcast.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredPodcasts(filtered);
      // Set no results message if no podcasts match the search
      setNoResultsMessage(filtered.length === 0 ? 'No podcasts found matching your search.' : '');
    } else {
      setFilteredPodcasts(podcasts); // Reset to original list if search term is empty
      setNoResultsMessage(''); // Clear no results message
    }
  };

  return (
    <div>
      <Header />
      <HeroSection />
      <Filter onSearch={handleSearch} /> {/* Pass the search handler to Filter */}
      
      <section className="podcast-card container">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading podcasts...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={fetchPodcasts}>Retry</button>
          </div>
        ) : (
          <>
            {noResultsMessage && <p className="no-results-message">{noResultsMessage}</p>} {/* Display no results message */}
            {filteredPodcasts.map((podcast) => (
              <PodcastCard 
                key={podcast.id} 
                podcast={podcast} 
                onSelect={setSelectedPodcast} 
              />
            ))}
          </>
        )}
      </section>
      
      <PodcastModal 
        podcast={selectedPodcast} 
        onClose={() => setSelectedPodcast(null)} 
        onViewMore={() => setIsFullScreenModalOpen(true)} 
      />
      <FullScreenModal 
        podcast={selectedPodcast} 
        isOpen={isFullScreenModalOpen} 
        onClose={() => setIsFullScreenModalOpen(false)} 
      />
    </div>
  );
};

export default App;
