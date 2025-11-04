// Atom: Botón flotante para chatbot
import React from 'react';
import './ChatbotButton.css';
import Fab from './Fab';

const ChatbotButton = ({ onClick }) => (
  <Fab className="chatbot-fab" onClick={onClick} ariaLabel="Abrir chat" size={64}>
    {/* SVG robot icon (white) - scales inside the circular green button */}
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <g fill="none" fillRule="evenodd">
        <rect x="14" y="18" width="36" height="28" rx="4" fill="#FFF" />
        <rect x="22" y="10" width="20" height="8" rx="2" fill="#FFF" />
        <circle cx="26" cy="30" r="3" fill="#4CAF50" />
        <circle cx="38" cy="30" r="3" fill="#4CAF50" />
        <rect x="28" y="36" width="8" height="4" rx="2" fill="#4CAF50" />
      </g>
    </svg>
  </Fab>
);

export default ChatbotButton;
