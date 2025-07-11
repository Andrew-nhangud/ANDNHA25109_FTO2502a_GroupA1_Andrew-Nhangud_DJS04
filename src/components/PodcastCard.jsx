/**
 * PodcastCard component for displaying individual podcast information.
 * 
 * This component shows the podcast's image, title, genres, number of seasons,
 * and last updated date. It allows users to click on the card to select a podcast.
 * 
 * @component
 * @param {Object} podcast - The podcast data to display.
 * @param {function} onSelect - Function to handle podcast selection.
 * @returns {JSX.Element} The rendered PodcastCard component.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { formatDate, getGenreTitles } from '../utils/utils'; // Ensure these utility functions are available

const PodcastCard = ({ podcast, onSelect }) => {
  return (
    <div className="innerPodcast-card" onClick={() => onSelect(podcast)}>
      <img src={podcast.image} alt={podcast.title} />
      <div className="podcast-card-info">
        <h1>{podcast.title}</h1>
        <div className="podcast-categories">
          {getGenreTitles(podcast.genres).map((genre) => (
            <span key={genre} className="podcast-categories-items">{genre}</span>
          ))}
        </div>
        <p className="season-info">{podcast.seasons} Seasons</p>
        <p className="date">Last updated: {formatDate(podcast.updated)}</p>
      </div>
    </div>
  );
};

// PropTypes for type checking
PodcastCard.propTypes = {
  podcast: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    genres: PropTypes.array.isRequired, // Assuming genres is an array
    seasons: PropTypes.number.isRequired,
    updated: PropTypes.string.isRequired, // Assuming updated is a string (date)
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default PodcastCard;
