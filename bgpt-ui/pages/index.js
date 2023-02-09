import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RichText from './response';
import Tasks from './tasks';
import LoginWithGitHubButton from './loginWithGithubButton';
import Router from 'next/router';
import AnalysisList from './analysis';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import jwt from 'jsonwebtoken';

const ChatPage = () => {

  
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwt.decode(token);
        console.log(decoded);
        setUser(decoded);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3001/query', {
        query: userMessage,
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const botMessage = response.data.answer;

      setChatHistory([{
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

  if (!user) {
    return (
      <div>
        Please log in to view this page.
        <LoginWithGitHubButton></LoginWithGitHubButton>
      </div>
    );
  }

  return (
    <div>
      <div className="chat-container">
        <h1>Blockchain GPT Chat</h1>
        <div>
          <ul className="chat-history">
            {chatHistory.map((message, index) => (
              <li key={index} className={`chat-message ${message.type}`}>
                <RichText content={message.message}>{message.message}</RichText>
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

          <Tasks></Tasks>
        </div>
     </div>

    <AnalysisList></AnalysisList>

    </div>
  );
};

export default ChatPage;
