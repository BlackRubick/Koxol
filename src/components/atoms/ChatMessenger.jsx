import { useState, useRef, useEffect } from 'react';
import './ChatMessenger.css';

const initialMessages = [
  { from: 'bot', text: "¡Hola! Soy el asistente K'oxol. ¿En qué puedo ayudarte?" }
];

const options = [
  { id: 1, text: 'Productos', reply: 'Ofrecemos una variedad de productos naturales como sprays, cremas, lociones, velas y pulseras repelentes. Todos están diseñados para protegerte de los mosquitos de manera efectiva y segura.' },
  { id: 2, text: 'Beneficios', reply: 'Nuestros productos son 100% naturales, libres de químicos dañinos, y ofrecen protección prolongada. Además, son aptos para toda la familia, incluyendo niños mayores de 3 años.' },
  { id: 3, text: 'Dónde Comprar', reply: 'Puedes adquirir nuestros productos en nuestra tienda en línea o en puntos de venta autorizados. También ofrecemos envíos gratis en compras mayores a $500 MXN.' },
  { id: 4, text: 'Contacto', reply: 'Para cualquier consulta, puedes escribirnos a corporativo_equipo5@outlook.com o llamarnos al +52 9616674502. También estamos disponibles en WhatsApp.' },
  { id: 5, text: 'Políticas', reply: 'Consulta nuestras políticas de privacidad, devoluciones y envíos en la sección correspondiente de nuestra página. Garantizamos seguridad y satisfacción en cada compra.' },
  { id: 6, text: 'Historia', reply: "K'oxol nació en 2018 con la misión de ofrecer soluciones naturales y efectivas contra los mosquitos. Desde entonces, hemos crecido con un compromiso hacia la sostenibilidad y la calidad." }
];

export default function ChatMessenger({ open, onClose }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState(true);
  const messagesEndRef = useRef(null);

  // Estado para IA remota (Hugging Face Inference API)
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(false);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Verifica disponibilidad del proxy serverless (/api/hf-proxy)
  const loadAiModel = async () => {
    if (aiAvailable || aiLoading) return;
    setAiLoading(true);
    try {
      const CHAT_PROXY = import.meta.env.VITE_CHAT_PROXY_URL || '/api/chatgpt-proxy';
      // Llamamos al proxy con un prompt corto para comprobar que está funcionando en el servidor
      const resp = await fetch(CHAT_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Hola' })
      });
      if (resp.ok) {
        setAiAvailable(true);
      } else {
        const text = await resp.text();
        throw new Error(`Proxy error ${resp.status}: ${text}`);
      }
    } catch (err) {
      console.error('Error preparando IA remota:', err);
      setAiAvailable(false);
      // Mostrar mensaje en chat para que el usuario lo vea
      setMessages(prev => [...prev, { from: 'bot', text: 'No se pudo activar la IA remota: revisa la configuración del proxy en el servidor.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Función que llama al proxy serverless (/api/chatgpt-proxy)
  const hfRequest = async (prompt) => {
    const CHAT_PROXY = import.meta.env.VITE_CHAT_PROXY_URL || '/api/chatgpt-proxy';
    const res = await fetch(CHAT_PROXY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Proxy error ${res.status}: ${text}`);
    }

    const data = await res.json();

    // Prefer the simple `text` field returned by our proxy
    if (data && typeof data.text === 'string') return data.text;

    // Google Generative responses: try common nested paths
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    if (data?.candidates?.[0]?.output) {
      // some models return output array
      const out = data.candidates[0].output;
      if (Array.isArray(out) && out[0]?.content?.parts?.[0]?.text) return out[0].content.parts[0].text;
    }

    // Hugging Face style
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      return data[0].generated_text;
    }
    if (data && data.generated_text) return data.generated_text;

    // Fallback: stringify but try to avoid showing huge raw objects
    try {
      return JSON.stringify(data);
    } catch (e) {
      return String(data);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: input }]);

    // mensaje temporal de 'escribiendo...'
    setMessages(prev => [...prev, { from: 'bot', text: 'Escribiendo...' }]);

    let botReply = '';

    if (aiAvailable) {
      try {
        botReply = await hfRequest(input);
      } catch (err) {
        console.error('Error generando con HF Inference API:', err);
        botReply = 'Hubo un error al generar la respuesta desde la API remota. Revisa la consola.';
      }
    } else {
      // Fallback por opciones numéricas
      const selectedOption = options.find(option => option.id === parseInt(input));
      botReply = selectedOption
        ? selectedOption.reply
        : 'Lo siento, no entendí tu respuesta. Por favor, selecciona un número válido del 1 al 6 o activa la IA.';
    }

    // Reemplazar el último mensaje (escribiendo...) por la respuesta real
    setMessages(prev => {
      const withoutTyping = prev.slice(0, -1);
      return [...withoutTyping, { from: 'bot', text: botReply }];
    });

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
  // Hide option buttons when AI is active (we want a free-text chat in that case)
  const shouldShowOptions = lastMessage && lastMessage.from === 'bot' && !aiAvailable;

  if (!open) return null;

  return (
    <div className="chat-messenger">
      <div className="chat-messenger__header">
        <span>Chat K'oxol</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <small style={{ fontSize: 12 }}>
            IA: {aiAvailable ? 'activa' : aiLoading ? 'cargando...' : 'inactiva'}
          </small>
          {!aiAvailable && (
            <button onClick={loadAiModel} disabled={aiLoading} style={{ fontSize: 12 }}>
              {aiLoading ? 'Cargando modelo...' : 'Activar IA'}
            </button>
          )}
          <button className="chat-messenger__close" onClick={onClose}>×</button>
        </div>
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