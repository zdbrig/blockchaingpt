import React from 'react';
import hljs from 'highlight.js'
import { marked } from 'marked';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faTrash, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faCheck, faTrash, faArrowRight)

import axios from 'axios';

const TreeNode = ({ node, children, updatePage }) => {
  const handleAnswer = async () => {
    try {
      const response = await axios.post('http://localhost:3001/answer', { node });
      updatePage(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete('http://localhost:3001/delete', { params: { nodeId: node.id } });
      updatePage(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoDeep = async () => {
    try {
      const response = await axios.post('http://localhost:3001/go-deep', { node });
      updatePage(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <li>
      <p className="question">{node.question}</p>
      {(children.length === 0 && node.answer === "--") ? (
        <div className="links">
          <a href="#" onClick={handleAnswer}>
            <FontAwesomeIcon icon="check" /> Answer
          </a>
          <a href="#" onClick={handleDelete}>
            <FontAwesomeIcon icon="trash" /> Delete
          </a>
          <a href="#" onClick={handleGoDeep}>
            <FontAwesomeIcon icon="arrow-right" /> Go Deep
          </a>
        </div>) : (
          <div></div>
        )}
      <p className="answer">
        <div dangerouslySetInnerHTML={{ __html: marked(node.answer ? node.answer : "none") }} />
      </p>
      {children.length > 0 && <ul>{children}</ul>}
    </li>
  );
};



const Tree = ({ data }) => {
    const buildTree = (questions, parentQuestion = null) => {
        const children = questions
            .filter(question => {
                if (!parentQuestion && !question.parent) {
                    return true;
                }
                if (parentQuestion && question.parent === parentQuestion.question) {
                    return true;
                }
                return false;
            })
            .map(question => {
                const filteredQuestions = questions.filter(
                    q => q.question !== question.question
                );
                return (
                    <TreeNode
                        key={question.question}
                        node={question}
                        children={buildTree(filteredQuestions, question)}
                    />
                );
            });

        return children;
    };
    return (
        <ul className="tree">
            {data.map(analysis => (
                <li key={analysis._id}>
                    {analysis.context}
                    <br></br>
                    <p> by {analysis.user} </p>
                    <br></br>
                    <p>id: {analysis.id}</p>
                    {buildTree(analysis.questions)}
                </li>
            ))}
        </ul>
    );
};

export default Tree;
