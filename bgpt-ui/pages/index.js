import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    setChatHistory([...chatHistory, {
      type: 'user',
      message: userMessage,
    }]);

    try {
      const response = await axios.post('http://localhost:3001/query', {
        query: userMessage,
      });
      const botMessage = response.data.answer;

      setChatHistory([...chatHistory, {
        type: 'bot',
        message: botMessage,
      }]);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }

    setUserMessage('');
  };

  return (
    <div className="chat-container">
      <h1>Blockchain GPT Chat</h1>
      <ul className="chat-history">
        {chatHistory.map((message, index) => (
          <li key={index} className={`chat-message ${message.type}`}>
            {message.message}
          </li>
        ))}
      </ul>
      {error && (
        <p className="error">An error occurred. Please try again.</p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
