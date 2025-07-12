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
import { usePodcastContext } from './PodcastContext';

const App = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);
  const [displayedPodcasts, setDisplayedPodcasts] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noResultsMessage, setNoResultsMessage] = useState('');

  const {
    searchTerm, setSearchTerm,
    selectedGenre, setSelectedGenre,
    sortOption, setSortOption,
    currentPage, setCurrentPage,
    podcastsPerPage
  } = usePodcastContext();

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
  // Filter podcasts based on search term and selected genre
  const filterPodcasts = () => {
    let filtered = [...podcasts];

    if (searchTerm) {
      filtered = filtered.filter(podcast =>
        podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter(podcast => 
        podcast.genres.some(genre => genre.id === parseInt(selectedGenre))
      );
    }

    // Sort podcasts based on selected sort option
    if (sortOption) {
      switch(sortOption) {
        case 'latest':
          filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
          break;
        case 'oldest':
          filtered.sort((a, b) => new Date(a.updated) - new Date(b.updated));
          break;
        case 'title-asc':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'title-desc':
          filtered.sort((a, b) => b.title.localeCompare(a.title));
          break;
        default:
          break;
      }
    }

    setFilteredPodcasts(filtered);
    setNoResultsMessage(filtered.length === 0 ? 'No podcasts found matching your criteria.' : '');
  };

  filterPodcasts();
}, [searchTerm, selectedGenre, sortOption, podcasts]);


  useEffect(() => {
    // Get current podcasts for the page
    const indexOfLastPodcast = currentPage * podcastsPerPage;
    const indexOfFirstPodcast = indexOfLastPodcast - podcastsPerPage;
    setDisplayedPodcasts(filteredPodcasts.slice(indexOfFirstPodcast, indexOfLastPodcast));
  }, [filteredPodcasts, currentPage, podcastsPerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Header />
      <HeroSection />
      <Filter 
        onSearch={setSearchTerm} 
        onSort={setSortOption} 
        onGenreSelect={setSelectedGenre} 
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
          </>
        )}
      </section>

      <div className="pagination-container">
        <Pagination
          podcastsPerPage={podcastsPerPage}
          totalPodcasts={filteredPodcasts.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>

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
