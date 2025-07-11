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
  const [selectedGenre, setSelectedGenre] = useState(''); // New state for selected genre
  const [noResultsMessage, setNoResultsMessage] = useState('');
  const [genres, setGenres] = useState([]); // New state for genres

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

  const fetchGenres = async () => {
    // Fetch genres from an API or define them statically
    const genreData = [
      { id: 'action', name: 'Action' },
      { id: 'comedy', name: 'Comedy' },
      { id: 'drama', name: 'Drama' },
      // Add more genres as needed
    ];
    setGenres(genreData);
  };

  useEffect(() => {
    fetchPodcasts();
    fetchGenres(); // Fetch genres when the component mounts
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterPodcasts(term, selectedGenre); // Filter based on search term and selected genre
  };

  const handleSort = (sortOption) => {
    let sortedPodcasts = [...filteredPodcasts];

    if (sortOption === 'latest') {
      sortedPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    } else if (sortOption === 'oldest') {
      sortedPodcasts.sort((a, b) => new Date(a.updated) - new Date(b.updated));
    } else if (sortOption === 'title-asc') {
      sortedPodcasts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'title-desc') {
      sortedPodcasts.sort((a, b) => b.title.localeCompare(a.title));
    }

    setFilteredPodcasts(sortedPodcasts);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    filterPodcasts(searchTerm, genre); // Filter based on search term and selected genre
  };

  const filterPodcasts = (term, genre) => {
    let filtered = podcasts;

    if (term) {
      filtered = filtered.filter(podcast =>
        podcast.title.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (genre) {
      filtered = filtered.filter(podcast => podcast.genres.includes(genre));
    }

    setFilteredPodcasts(filtered);
    setNoResultsMessage(filtered.length === 0 ? 'No podcasts found matching your criteria.' : '');
  };

  return (
    <div>
      <Header />
      <HeroSection />
      <Filter 
        onSearch={handleSearch} 
        onSort={handleSort} 
        onGenreSelect={handleGenreSelect} 
        genres={genres} // Pass genres to Filter
      />
      
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
            {noResultsMessage && <p className="no-results-message">{noResultsMessage}</p>}
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
