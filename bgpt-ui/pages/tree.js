import React from 'react';
import hljs from 'highlight.js'
import {marked} from 'marked';

const TreeNode = ({ node, children }) => (
    <li>

        <p className="question">{node.question}</p>
        <p className="answer">
        <div  dangerouslySetInnerHTML={{ __html: marked(node.answer ? node.answer : "none") }} />
        
            </p>
        {children.length > 0 && <ul>{children}</ul>}
    </li>
);

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
