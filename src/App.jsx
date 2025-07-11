// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Filter from './components/Filter';
import PodcastCard from './components/PodcastCard';
import PodcastModal from './components/PodcastModal';
import FullScreenModal from './components/FullScreenModal';
import Pagination from './components/Pagination';
import { genres } from './data/data';
import { formatDate } from './utils/utils';

const App = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);
  const [displayedPodcasts, setDisplayedPodcasts] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [noResultsMessage, setNoResultsMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [podcastsPerPage] = useState(8);

  const fetchPodcasts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://podcast-api.netlify.app/');
      
      const podcastsWithGenres = response.data.map(podcast => ({
        ...podcast,
        genres: podcast.genres.map(genreId => 
          genres.find(g => g.id === genreId) || { id: genreId, title: 'Unknown' }
        ).filter(Boolean),
        updated: formatDate(podcast.updated)
      }));
      
      setPodcasts(podcastsWithGenres);
      setFilteredPodcasts(podcastsWithGenres);
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

  useEffect(() => {
    // Get current podcasts for the page
    const indexOfLastPodcast = currentPage * podcastsPerPage;
    const indexOfFirstPodcast = indexOfLastPodcast - podcastsPerPage;
    setDisplayedPodcasts(filteredPodcasts.slice(indexOfFirstPodcast, indexOfLastPodcast));
  }, [filteredPodcasts, currentPage, podcastsPerPage]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterPodcasts(term, selectedGenre);
    setCurrentPage(1);
  };

  const handleSort = (sortOption) => {
    let sortedPodcasts = [...filteredPodcasts];

    switch(sortOption) {
      case 'latest':
        sortedPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case 'oldest':
        sortedPodcasts.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      case 'title-asc':
        sortedPodcasts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sortedPodcasts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredPodcasts(sortedPodcasts);
    setCurrentPage(1);
  };

  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
    filterPodcasts(searchTerm, genreId);
    setCurrentPage(1);
  };

  const filterPodcasts = (term, genreId) => {
    let filtered = [...podcasts];

    if (term) {
      filtered = filtered.filter(podcast =>
        podcast.title.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (genreId) {
      filtered = filtered.filter(podcast => 
        podcast.genres.some(genre => genre.id === parseInt(genreId))
      );
    }

    setFilteredPodcasts(filtered);
    setNoResultsMessage(filtered.length === 0 ? 'No podcasts found matching your criteria.' : '');
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Header />
      <HeroSection />
      <Filter 
        onSearch={handleSearch} 
        onSort={handleSort} 
        onGenreSelect={handleGenreSelect} 
        genres={genres}
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
            {displayedPodcasts.map((podcast) => (
              <PodcastCard 
                key={podcast.id} 
                podcast={podcast} 
                onSelect={setSelectedPodcast} 
              />
            ))}
            
            <Pagination
              podcastsPerPage={podcastsPerPage}
              totalPodcasts={filteredPodcasts.length}
              currentPage={currentPage}
              paginate={paginate}
            />
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
