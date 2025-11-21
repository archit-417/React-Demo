import React, { useState } from 'react';
import './TaskManager.css';
export default function TaskManager(){
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Learn React Basics', completed: false },
        { id: 2, text: 'Build a Todo App', completed: true },
        { id: 3, text: 'Practice useState Hook', completed: false }
    ]);
    const [inputValue, setInputValue] = useState('');
    const addTask = () => {
        if (inputValue.trim()) {
            const newTask = {
                id: Date.now(),
                text: inputValue,
                completed: false
            };
            setTasks([...tasks, newTask]);
            setInputValue('');
        }
    };
    const toggleTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };
    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    };
    return (
        <div className="task-manager">
            <h1>Task Manager</h1>
            <div className="task-input">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter a new task..."
                />
                <button onClick={addTask}>Add Task</button>
            </div>
            <div className="task-list">
                {tasks.map(task => (
                    <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                        <span
                            className="task-text"
                            onClick={() => toggleTask(task.id)}
                        >
                            {task.text}
                        </span>
                        <button
                            className="delete-btn"
                            onClick={() => deleteTask(task.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}