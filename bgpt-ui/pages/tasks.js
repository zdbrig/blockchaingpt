
import React, { useState, useEffect } from 'react';
import Task from './Task';


const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  const refreshTasks = () => {
    fetch('http://localhost:3001/tasks')
      .then(res => res.json())
      .then(data => {
        setTasks(data);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    refreshTasks();
    const intervalId = setInterval(refreshTasks, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>Tasks</h2>
      <button onClick={refreshTasks}>Refresh</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <Task time={task.timestamp} query={task.query} result={task.result} status={task.status}> </Task>
            

          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
