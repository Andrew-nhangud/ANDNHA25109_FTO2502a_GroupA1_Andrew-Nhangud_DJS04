/**
 * Main entry point for the React application.
 * 
 * This file renders the App component into the root DOM element.
 * It also imports the global styles for the application.
 * 
 * @module main
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);