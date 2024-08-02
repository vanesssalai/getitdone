import React, { useState } from "react";
import axios from 'axios';
import { FaTimes, FaPlus } from "react-icons/fa";

export default function NewTaskForm({ handleClose, priority, projectID }) {
    const [newTask, setNewTask] = useState({ 
        title: "", 
        description: "", 
        dueDate: "", 
        subTasks: [],
        completed: false,
        priority: priority,
        projectID: projectID
    });
    const [subTaskTitle, setSubTaskTitle] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ 
            ...newTask,
            [name]: value
        });
    };

    const handleAddSubTask = () => {
        if (subTaskTitle.trim()) {
            setNewTask({
                ...newTask,
                subTasks: [...newTask.subTasks, { title: subTaskTitle.trim(), completed: false }]
            });
            setSubTaskTitle("");
        }
    };

    const handleRemoveSubTask = (index) => {
        const updatedSubTasks = newTask.subTasks.filter((_, i) => i !== index);
        setNewTask({
            ...newTask,
            subTasks: updatedSubTasks
        });
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3000/api/projects/${projectID}/tasks`, newTask);
            console.log("Task created:", response.data);
            handleClose();
        } catch (error) {
            console.error("Error creating task:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <button 
                        type="button" 
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" 
                        onClick={handleClose}
                    >
                        <FaTimes size={20} />
                    </button>
                    <h1 className="text-xl font-semibold mb-4">New {priority} priority task</h1>
                    <label htmlFor="title">Task Title</label>
                    <input 
                        id="title"
                        type="text" 
                        name="title" 
                        placeholder="Title" 
                        value={newTask.title} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <label htmlFor="description">Task Description</label>
                    <input 
                        id="description"
                        type="text" 
                        name="description" 
                        placeholder="Description" 
                        value={newTask.description} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <label htmlFor="dueDate">Task Due Date</label>
                    <input 
                        id="dueDate"
                        type="date" 
                        name="dueDate" 
                        placeholder="Due Date" 
                        value={newTask.dueDate} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <div>
                        <label htmlFor="subTask">Subtasks</label>
                        <div className="flex space-x-2">
                            <input 
                                id="subTask"
                                type="text" 
                                value={subTaskTitle}
                                onChange={(e) => setSubTaskTitle(e.target.value)}
                                placeholder="Enter subtask" 
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
                            />
                            <button 
                                type="button"
                                onClick={handleAddSubTask}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                            >
                                <FaPlus />
                            </button>
                        </div>
                        <ul className="mt-2 space-y-2">
                            {newTask.subTasks.map((subTask, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                                    <span>{subTask.title}</span>
                                    <button 
                                        type="button"
                                        onClick={() => handleRemoveSubTask(index)}
                                        className="hover:text-red-500"
                                    >
                                        <FaTimes />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                        Create Task
                    </button>
                </form>
            </div>
        </div>
    );
}