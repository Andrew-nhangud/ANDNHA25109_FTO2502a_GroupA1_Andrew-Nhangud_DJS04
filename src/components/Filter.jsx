/**
 * Filter component for searching and filtering podcasts.
 * 
 * This component includes a search bar and dropdown menus for genre selection
 * and sorting options. It allows users to filter the list of podcasts displayed
 * on the landing page.
 * 
 * @component
 * @returns {JSX.Element} The rendered Filter component.
 */
import React, { useState } from 'react';
import searchIcon from '../assets/images/search-icon.png';

const Filter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value); // Call the onSearch function passed as a prop
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
        <select id="genre-select" name="genre">
          <option value="">Genre</option>
          <option value="action">Action</option>
          <option value="comedy">Comedy</option>
          <option value="drama">Drama</option>
        </select>
        <select id="sort-select" name="sort">
          <option value="">Sort By</option>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </section>
  );
};

export default Filter;
