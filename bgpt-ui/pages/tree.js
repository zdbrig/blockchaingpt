import React from 'react';

const TreeNode = ({ node, children }) => (
    <li>

        <p className="question">{node.question}</p>
        <p className="answer">{node.answer}</p>
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
                    {buildTree(analysis.questions)}
                </li>
            ))}
        </ul>
    );
};

export default Tree;
