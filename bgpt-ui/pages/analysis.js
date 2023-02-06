import React, { useState, useEffect } from 'react';
import axios from 'axios';
import hljs from 'highlight.js'
import {marked} from 'marked';
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
        <table>
            <thead>
                <tr>
                    <th>Context</th>
                    <th>Subject</th>
                    <th>Questions</th>
                </tr>
            </thead>
            <tbody>
                {analyses.map(analysis => (
                    <tr key={analysis._id}>
                        <td>{analysis.context}</td>
                        <td>{analysis.subject}</td>
                        <td>
                            {analysis.questions.map(question => (
                                <div key={question._id}>
                                    <p>{question.question}</p>
                                    <p><div className="red">{  <div  dangerouslySetInnerHTML={{ __html: marked(question.answer ? question.answer : "none") }} />  } </div></p>
                                </div>
                            ))}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AnalysisList;
