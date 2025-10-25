import { useState, useRef, useEffect } from 'react';
import './ChatMessenger.css';

const initialMessages = [
  { from: 'bot', text: '¡Hola! Soy el asistente K’oxol. ¿En qué puedo ayudarte?' }
];

export default function ChatMessenger({ open, onClose }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'bot', text: '¡Gracias por tu mensaje! Pronto te responderé.' }]);
    }, 700);
    setInput('');
  };

  if (!open) return null;

  return (
    <div className="chat-messenger">
      <div className="chat-messenger__header">
        <span>Chat K’oxol</span>
        <button className="chat-messenger__close" onClick={onClose}>×</button>
      </div>
      <div className="chat-messenger__messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-messenger__msg chat-messenger__msg--${msg.from}`}>{msg.text}</div>
        ))}
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
