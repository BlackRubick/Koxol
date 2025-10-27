import { useState, useRef, useEffect } from 'react';
import './ChatMessenger.css';

const initialMessages = [
  { from: 'bot', text: '¡Hola! Soy el asistente K\'oxol. ¿En qué puedo ayudarte?' }
];

const options = [
  { id: 1, text: 'Productos', reply: 'Ofrecemos una variedad de productos naturales como sprays, cremas, lociones, velas y pulseras repelentes. Todos están diseñados para protegerte de los mosquitos de manera efectiva y segura.' },
  { id: 2, text: 'Beneficios', reply: 'Nuestros productos son 100% naturales, libres de químicos dañinos, y ofrecen protección prolongada. Además, son aptos para toda la familia, incluyendo niños mayores de 3 años.' },
  { id: 3, text: 'Dónde Comprar', reply: 'Puedes adquirir nuestros productos en nuestra tienda en línea o en puntos de venta autorizados. También ofrecemos envíos gratis en compras mayores a $500 MXN.' },
  { id: 4, text: 'Contacto', reply: 'Para cualquier consulta, puedes escribirnos a corporativo_equipo5@outlook.com o llamarnos al +52 9616674502. También estamos disponibles en WhatsApp.' },
  { id: 5, text: 'Políticas', reply: 'Consulta nuestras políticas de privacidad, devoluciones y envíos en la sección correspondiente de nuestra página. Garantizamos seguridad y satisfacción en cada compra.' },
  { id: 6, text: 'Historia', reply: 'K\'oxol nació en 2018 con la misión de ofrecer soluciones naturales y efectivas contra los mosquitos. Desde entonces, hemos crecido con un compromiso hacia la sostenibilidad y la calidad.' }
];

export default function ChatMessenger({ open, onClose }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    
    const selectedOption = options.find(option => option.id === parseInt(input));
    
    setTimeout(() => {
      if (selectedOption) {
        setMessages(msgs => [...msgs, { from: 'bot', text: selectedOption.reply }]);
      } else {
        setMessages(msgs => [...msgs, { from: 'bot', text: 'Lo siento, no entendí tu respuesta. Por favor, selecciona un número válido del 1 al 4.' }]);
      }
    }, 700);
    setInput('');
  };

  const handleOptionClick = (optionId) => {
    setMessages(msgs => [...msgs, { from: 'user', text: optionId.toString() }]);
    const selectedOption = options.find(option => option.id === optionId);
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'bot', text: selectedOption.reply }]);
    }, 700);
  };

  const lastMessage = messages[messages.length - 1];
  const shouldShowOptions = lastMessage && lastMessage.from === 'bot';

  if (!open) return null;

  return (
    <div className="chat-messenger">
      <div className="chat-messenger__header">
        <span>Chat K'oxol</span>
        <button className="chat-messenger__close" onClick={onClose}>×</button>
      </div>
      <div className="chat-messenger__messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-messenger__msg chat-messenger__msg--${msg.from}`}>{msg.text}</div>
        ))}
        
        {shouldShowOptions && (
          <div className="chat-messenger__options">
            <p style={{ margin: '0 0 0.5em 0', fontSize: '0.95rem', fontWeight: '600', color: '#2D5016' }}>
              Selecciona una opción:
            </p>
            {options.map(option => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className="chat-messenger__option-btn"
              >
                <strong>{option.id}.</strong> {option.text}
              </button>
            ))}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-messenger__input">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}