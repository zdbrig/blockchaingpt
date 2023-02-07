import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RichText from './response';
import Tasks from './tasks';
import LoginWithGitHubButton from './loginWithGithubButton';
import Router from 'next/router';
import AnalysisList from './analysis';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ChatPage = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  

const generatePDF = () => {
  const input = document.getElementById("tree");
  html2canvas(input)
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("download.pdf");
    });
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);


    try {
      const response = await axios.post('http://localhost:3001/query', {
        query: userMessage,
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


  useEffect(() => {
    const storedToken = "token";
    const code = Router.query.code;

    if (storedToken) {
      setToken(storedToken);
    } else if (code) {
      localStorage.setItem('token', code);
      setToken(code);
    }
  }, []);


  return (
    <div>
    <div className="chat-container">
      <h1>Blockchain GPT Chat</h1>
      
        
          <div>

            
            <ul className="chat-history">
              {chatHistory.map((message, index) => (
                <li key={index} className={`chat-message ${message.type}`}>
                  <RichText content={message.message}> {message.message} </RichText>
                 
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
        
          <div>
            <LoginWithGitHubButton></LoginWithGitHubButton>
          </div>
        
      



    </div>
    <button onClick={generatePDF}>Download PDF</button>

    <AnalysisList></AnalysisList>

    </div>
  );
};

export default ChatPage;
