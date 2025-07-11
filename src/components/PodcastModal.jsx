/**
 * PodcastModal component for displaying detailed information about a selected podcast.
 * 
 * This modal shows the podcast's image, title, genres, last updated date, 
 * number of seasons, description, and a button to view more details.
 * 
 * @component
 * @param {Object} podcast - The podcast data to display.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onViewMore - Function to handle viewing more details.
 * @returns {JSX.Element|null} The rendered PodcastModal component or null if no podcast is selected.
 */
import React from 'react';
import { formatDate, getGenreTitles } from '../utils/utils';

const PodcastModal = ({ podcast, onClose, onViewMore }) => {
  if (!podcast) return null;

  return (
    <div className={`modal ${podcast ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modalContent-header">
          <h2 id="modalTitle">{podcast.title}</h2>
          <span className="close-button" onClick={onClose}>&times;</span>
        </div>

        <hr className="line-diveder" />

        <div className="modalContent-info">
          <img id="modalImage" src={podcast.image} alt={podcast.title} />

          <div className="modalContent-details">
            <div id="modalGenres" className="genres">
              {podcast.genres && podcast.genres.length > 0 
                ? getGenreTitles(podcast.genres).join(", ") 
                : "No genres available"}
            </div>

            <p id="modalLastUpdated">
              Last updated: <span>{formatDate(podcast.updated)}</span>
            </p>

            <div id="modalSeasons" className="seasons">
              {podcast.seasons > 0 
                ? `${podcast.seasons} season` 
                : "No seasons available"}
            </div>

            <p id="modalDescription">{podcast.description}</p>

            <button id="viewMoreBtn" className="view-more-btn" onClick={onViewMore}>
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastModal;
