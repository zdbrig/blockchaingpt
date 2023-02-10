import React, { useState, useEffect } from 'react';
import hljs from 'highlight.js'
import {marked} from 'marked';

const Task = ({ status, time, query, result }) => {
  const [localStatus, setLocalStatus] = useState(status);
  const [localTime, setLocalTime] = useState(time);
  const [localQuery, setLocalQuery] = useState(query);
  const [localResult, setLocalResult] = useState(result);
  marked.setOptions({
    highlight: (code, language) => {
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
      return hljs.highlight(validLanguage, code).value;
    }
  });
  useEffect(() => {
    setLocalStatus(status);
    setLocalTime(time);
    setLocalQuery(query);
    setLocalResult(result);
  }, [status, time, query, result]);

  return (
    <div className="task">
      <h3>Project : {localQuery}</h3>
      
    
     
        
        
        
        <img src={localResult} />  
      
    </div>
  );
};

export default Task;
