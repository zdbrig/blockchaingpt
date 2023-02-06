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
      <h3>Task</h3>
      <div>
        <strong>Status: </strong> {localStatus}
      </div>
    
      <div>
        <strong>Question: </strong> {localQuery}
      </div>
      <div>

        
        <strong>Answer: </strong>
        
      {  <div  dangerouslySetInnerHTML={{ __html: marked(localResult ? localResult : "none") }} />  }
      </div>
    </div>
  );
};

export default Task;
