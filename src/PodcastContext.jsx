// src/PodcastContext.jsx
import React, { createContext, useContext, useState } from 'react';

const PodcastContext = createContext();

export const PodcastProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [podcastsPerPage] = useState(8);

  return (
    <PodcastContext.Provider value={{
      searchTerm, setSearchTerm,
      selectedGenre, setSelectedGenre,
      sortOption, setSortOption,
      currentPage, setCurrentPage,
      podcastsPerPage
    }}>
      {children}
    </PodcastContext.Provider>
  );
};

export const usePodcastContext = () => useContext(PodcastContext);
