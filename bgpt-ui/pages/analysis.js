import React, { useState, useEffect } from 'react';
import axios from 'axios';
import hljs from 'highlight.js'
import {marked} from 'marked';
import Tree from './tree';
const AnalysisList = () => {
    const [analyses, setAnalyses] = useState([]);


    marked.setOptions({
        highlight: (code, language) => {
          const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
          return hljs.highlight(validLanguage, code).value;
        }
      });

    
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('http://localhost:3001/analysis');
            setAnalyses(result.data);
        };
        fetchData();
        const intervalId = setInterval(fetchData, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
        
                <Tree data={analyses}> </Tree>
        </div>
    );
};

export default AnalysisList;
