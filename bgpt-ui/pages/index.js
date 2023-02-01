import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setChatHistory([...chatHistory, {
      type: 'user',
      message: userMessage,
    }]);

    try {
      const response = await axios.post('https://localhost:3001/chat', {
        message: userMessage,
      });
      const botMessage = response.data.answer;

      setChatHistory([...chatHistory, {
        type: 'bot',
        message: botMessage,
      }]);
    } catch (error) {
      console.error(error);
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ChatPage;
