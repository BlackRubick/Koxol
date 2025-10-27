import React, { useState, useEffect } from 'react';
import './ChatbotWindow.css';

const ChatbotWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const options = [
    { id: 1, text: '¿Qué productos ofrecen?', reply: 'Ofrecemos sprays, cremas, lociones y más para protección contra mosquitos.' },
    { id: 2, text: '¿Cuáles son los beneficios de sus productos?', reply: 'Nuestros productos son naturales, efectivos y seguros para toda la familia.' },
    { id: 3, text: '¿Dónde puedo comprar sus productos?', reply: 'Puedes adquirir nuestros productos en nuestra tienda en línea o en puntos de venta autorizados.' },
    { id: 4, text: '¿Cómo puedo contactar servicio al cliente?', reply: 'Puedes contactarnos a través de nuestro formulario en la página o llamando al número 800-123-4567.' },
  ];

  useEffect(() => {
    const initialMessage = { sender: 'bot', text: '¡Hola mierda  ! Soy el asistente K\'oxol. ¿En qué puedo ayudarte?' };
    setMessages([initialMessage]);
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    const selectedOption = options.find(option => option.id === parseInt(input));
    const botMessage = selectedOption
      ? { sender: 'bot', text: selectedOption.reply }
      : { sender: 'bot', text: 'Lo siento, no entendí tu respuesta. Por favor, selecciona un número válido del 1 al 4.' };

    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 500);
    
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleOptionClick = (optionId) => {
    const userMessage = { sender: 'user', text: optionId.toString() };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    const selectedOption = options.find(option => option.id === optionId);
    const botMessage = { sender: 'bot', text: selectedOption.reply };

    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 500);
  };

  // Verificar si el último mensaje es del bot para mostrar opciones
  const lastMessage = messages[messages.length - 1];
  const shouldShowOptions = lastMessage && lastMessage.sender === 'bot';

  return (
    <div className="chatbot-window">
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chatbot-message chatbot-message--${msg.sender}`}
          >
            {msg.text}
          </div>
        ))}
        
        {/* Mostrar opciones después de cada respuesta del bot */}
        {shouldShowOptions && (
          <div className="chatbot-options">
            <p><strong>Selecciona una opción:</strong></p>
            {options.map(option => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
              >
                <strong>{option.id}.</strong> {option.text}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe el número de tu opción..."
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatbotWindow;