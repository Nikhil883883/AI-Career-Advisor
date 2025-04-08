import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './InteractiveChat.css';

const InteractiveChat = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! Ask me anything about your career.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:8000/chat/',
        { 
          message: userMessage,
          model: "llama3-8b-8192" // Ensure model is specified
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10-second timeout
        }
      );

      const botResponse = response.data?.message || 
                         response.data?.response || 
                         "I couldn't process that request.";
      
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    } catch (err) {
      console.error('API Error:', err);
      
      let errorMessage = "Sorry, something went wrong.";
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.detail || 
                      `Error: ${err.response.status}`;
      } else if (err.request) {
        // No response received
        errorMessage = "The server isn't responding. Please try again later.";
      }
      
      setError(errorMessage);
      setMessages(prev => [...prev, { sender: 'bot', text: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">Career Advisor Bot 🤖</h2>
      
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            <div className="message-content">
              {msg.sender === 'bot' && (
                <span className="bot-icon">🤖</span>
              )}
              {msg.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <div className="message-content">
              <span className="bot-icon">🤖</span>
              <div className="typing-indicator">
                <span>•</span><span>•</span><span>•</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {error && (
        <div className="chat-error">
          ⚠️ {error}
        </div>
      )}

      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Ask about careers, skills, or jobs..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button 
          onClick={handleSend} 
          disabled={!input.trim() || loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default InteractiveChat;