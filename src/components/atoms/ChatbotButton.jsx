// Atom: Botón flotante para chatbot
import React from 'react';
import './ChatbotButton.css';

const ChatbotButton = ({ onClick }) => (
  <button className="chatbot-fab" onClick={onClick} aria-label="Abrir chat">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#2D5016"/>
      <path d="M10 20v-6a6 6 0 0112 0v6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="13" cy="15" r="1" fill="#fff"/>
      <circle cx="19" cy="15" r="1" fill="#fff"/>
    </svg>
  </button>
);

export default ChatbotButton;
