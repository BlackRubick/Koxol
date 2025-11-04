import React, { useState, useEffect, useRef } from 'react';
import './ChatbotWindow.css';

const ChatbotWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [useRemote, setUseRemote] = useState(false);
  const modelRef = useRef(null);

  const options = [
    { id: 1, text: '¿Qué productos ofrecen?', reply: 'Ofrecemos sprays, cremas, lociones y más para protección contra mosquitos.' },
    { id: 2, text: '¿Cuáles son los beneficios de sus productos?', reply: 'Nuestros productos son naturales, efectivos y seguros para toda la familia.' },
    { id: 3, text: '¿Dónde puedo comprar sus productos?', reply: 'Puedes adquirir nuestros productos en nuestra tienda en línea o en puntos de venta autorizados.' },
    { id: 4, text: '¿Cómo puedo contactar servicio al cliente?', reply: 'Puedes contactarnos a través de nuestro formulario en la página o llamando al número 800-123-4567.' },
  ];

  useEffect(() => {
    const initialMessage = { sender: 'bot', text: "¡Hola! Soy el asistente K'oxol. ¿En qué puedo ayudarte?" };
    setMessages([initialMessage]);
  }, []);

  // Carga perezosa del modelo en el navegador (sin backend). El usuario puede activar la IA con el botón.
  const loadAiModel = async () => {
    if (aiAvailable || aiLoading) return;
    setAiLoading(true);
    try {
      // Import dinámico para evitar romper la app si la dependencia no está instalada
      const transformers = await import('@xenova/transformers');

      // Intentamos crear un pipeline de text2text (flan-t5-small es razonable para navegador)
      // Nota: los modelos se descargan al cliente y pueden ser grandes.
      const pipe = await transformers.pipeline('text2text-generation', 'google/flan-t5-small');
      modelRef.current = pipe;
      setAiAvailable(true);
    } catch (err) {
      // Si falla la carga, mantenemos el fallback estático
      console.error('No se pudo cargar el modelo en el navegador:', err);
      setAiAvailable(false);
    } finally {
      setAiLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    // Añadimos un mensaje de 'escribiendo' para feedback
    const typingMessage = { sender: 'bot', text: 'Escribiendo...' };
    setMessages(prev => [...prev, typingMessage]);

    // Si la IA está disponible, la usamos; si no, usamos el fallback por opciones
    let botReplyText = '';

    // Opción 1: usar el proxy remoto en el servidor (Vercel) -> /api/hf-proxy
    if (useRemote) {
      try {
        const resp = await fetch('/api/hf-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: input })
        });

        const contentType = resp.headers.get('content-type') || '';
        let serverText = '';

        if (contentType.includes('application/json')) {
          const json = await resp.json();
          // Varias formas en que HF puede responder; intentamos obtener texto legible
          if (typeof json === 'string') serverText = json;
          else if (Array.isArray(json) && json.length > 0) {
            serverText = json[0].generated_text || json[0].text || JSON.stringify(json[0]);
          } else if (json?.generated_text) serverText = json.generated_text;
          else serverText = JSON.stringify(json);
        } else {
          // Texto plano u otros
          serverText = await resp.text();
        }

        botReplyText = serverText || 'El servidor respondió pero no devolvió texto.';
      } catch (err) {
        console.error('Error llamando al proxy remoto:', err);
        botReplyText = 'Hubo un error al comunicarse con el servidor de IA.';
      }
    } else if (aiAvailable && modelRef.current) {
      try {
        const prompt = input;
        const output = await modelRef.current(prompt);

        // El pipeline puede regresar distintos formatos según el modelo/version
        if (Array.isArray(output) && output.length > 0) {
          botReplyText = output[0].generated_text || output[0].text || JSON.stringify(output[0]);
        } else if (output && output.generated_text) {
          botReplyText = output.generated_text;
        } else {
          botReplyText = 'Lo siento, no pude generar una respuesta en este momento.';
        }
      } catch (err) {
        console.error('Error al generar con el modelo:', err);
        botReplyText = 'Hubo un error al generar la respuesta. Intenta de nuevo o usa las opciones.';
      }
    } else {
      // Fallback: si el input es un número entre 1 y 4 devolvemos la opción correspondiente
      const selectedOption = options.find(option => option.id === parseInt(input));
      botReplyText = selectedOption
        ? selectedOption.reply
        : 'Lo siento, no entendí tu respuesta. Por favor, selecciona un número válido del 1 al 4 o activa la IA.';
    }

    // Reemplazamos el último mensaje (typing) por la respuesta real
    setMessages(prev => {
      const withoutTyping = prev.slice(0, -1);
      return [...withoutTyping, { sender: 'bot', text: botReplyText }];
    });

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleOptionClick = (optionId) => {
    const userMessage = { sender: 'user', text: optionId.toString() };
    setMessages(prev => [...prev, userMessage]);

    const selectedOption = options.find(option => option.id === optionId);
    const botMessage = { sender: 'bot', text: selectedOption.reply };

    setTimeout(() => {
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  // Verificar si el último mensaje es del bot para mostrar opciones
  const lastMessage = messages[messages.length - 1];
  const shouldShowOptions = lastMessage && lastMessage.sender === 'bot';

  return (
    <div className="chatbot-window">
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <small>IA: {aiAvailable ? 'activa' : aiLoading ? 'cargando...' : 'inactiva'}</small>
        {!aiAvailable && (
          <button onClick={loadAiModel} disabled={aiLoading} style={{ fontSize: 12 }}>
            {aiLoading ? 'Cargando modelo...' : 'Activar IA (carga en navegador)'}
          </button>
        )}

        {/* Toggle para usar proxy remoto en Vercel (/api/hf-proxy) */}
        <button
          onClick={() => setUseRemote(r => !r)}
          style={{ fontSize: 12 }}
        >
          {useRemote ? 'Usar Proxy: ON' : 'Usar Proxy: OFF'}
        </button>
      </div>

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
          placeholder="Escribe tu mensaje o número de opción..."
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatbotWindow;