// Atom: Botón flotante para chatbot
import React from 'react';
import './ChatbotButton.css';

const ChatbotButton = ({ onClick }) => (
  <button className="chatbot-fab" onClick={onClick} aria-label="Abrir chat">
    🤖
  </button>
);

export default ChatbotButton;
