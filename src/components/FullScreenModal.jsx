/**
 * FullScreenModal component for displaying detailed information about a podcast.
 * 
 * This modal shows the podcast's image, title, genres, last updated date, 
 * seasons, and episodes. It allows users to expand and collapse seasons to 
 * view episode information.
 * 
 * @component
 * @param {Object} podcast - The podcast data to display.
 * @param {boolean} isOpen - Indicates if the modal is open.
 * @param {function} onClose - Function to close the modal.
 * @returns {JSX.Element|null} The rendered FullScreenModal component or null if not open.
 */
import React, { useState } from 'react';
import { formatDate, getGenreTitles } from '../utils/utils';

const FullScreenModal = ({ podcast, isOpen, onClose }) => {
  const [expandedSeason, setExpandedSeason] = useState(null);

  if (!isOpen || !podcast) return null;

  const seasonsArray = Array.from({ length: podcast.seasons }, (_, i) => ({
    id: i + 1,
    title: `Season ${i + 1}`,
    episodes: 0 // Placeholder count
  }));

  const toggleSeason = (seasonId) => {
    setExpandedSeason(expandedSeason === seasonId ? null : seasonId);
  };

  return (
    <div className={`full-screen-modal ${isOpen ? 'show' : ''}`}>
      <div className="full-screen-modal-content">
        <div className="full-screen-modal-header">
          <button className="back-btn" onClick={onClose}>
            &lt; Back to Podcast
          </button>
        </div>

        <div className="podcast-info-section">
          <img
            className="full-screen-modal-image"
            src={podcast.image}
            alt={`Cover art for ${podcast.title}`}
          />
          <div className="podcast-info-text">
            <h2>{podcast.title}</h2>
            <div className="genres">
              {podcast.genres?.length > 0 
                ? getGenreTitles(podcast.genres).join(", ") 
                : "No genres available"}
            </div>
            <p className="last-updated">
              Last updated: <span>{formatDate(podcast.updated)}</span>
            </p>
            <div className="seasons-count">
              {podcast.seasons > 0 
                ? `${podcast.seasons} season${podcast.seasons !== 1 ? 's' : ''}` 
                : "No seasons available"}
            </div>
            <p className="description">{podcast.description}</p>
          </div>
        </div>

        <div className="seasons-episodes-section">
          <h3>Seasons and Episodes</h3>
          
          {podcast.seasons > 0 ? (
            <div className="seasons-list">
              {seasonsArray.map((season) => (
                <div key={season.id} className="season-item">
                  <div 
                    className="season-header" 
                    onClick={() => toggleSeason(season.id)}
                  >
                    <span className="season-title">{season.title}</span>
                    <span className="episodes-count">
                      {season.episodes} episode{season.episodes !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {expandedSeason === season.id && (
                    <div className="season-episodes">
                      <div className="episode-placeholder">
                        Episode information coming soon! Check back later for updates.
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-seasons">
              This podcast currently has no seasons available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullScreenModal;
