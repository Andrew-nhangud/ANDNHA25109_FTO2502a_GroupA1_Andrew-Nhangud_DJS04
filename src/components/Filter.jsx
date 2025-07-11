import React, { useState } from 'react';
import searchIcon from '../assets/images/search-icon.png';

const Filter = ({ onSearch, onSort, onGenreSelect, genres }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value); // Call the onSearch function passed as a prop
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortOption(value);
    onSort(value); // Call the onSort function passed as a prop
  };

  const handleGenreChange = (event) => {
    const value = event.target.value;
    setSelectedGenre(value);
    onGenreSelect(value); // Call the onGenreSelect function passed as a prop
  };

  return (
    <section className="filter container">
      <div className="searchBar-container">
        <img src={searchIcon} alt="search icon" />
        <input
          type="text"
          placeholder="Search podcasts..."
          className="search-bar"
          value={searchTerm}
          onChange={handleSearchChange} // Update search term on input change
        />
      </div>
      <div className="dropdown-menus">
        <select id="genre-select" name="genre" value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        <select id="sort-select" name="sort" value={sortOption} onChange={handleSortChange}>
          <option value="">Sort By</option>
          <option value="latest">Last Updated (Newest First)</option>
          <option value="oldest">Last Updated (Oldest First)</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
        </select>
      </div>
    </section>
  );
};

export default Filter;
