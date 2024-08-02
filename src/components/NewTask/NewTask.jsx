import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaTimes, FaSquare } from "react-icons/fa";

export default function NewTaskForm({ handleClose }) {
    const { userID } = useParams();
    const [newProject, setNewProject] = useState({ 
        title: "", 
        description: "", 
        dueDate: "", 
        tags: "",
        backgroundColor: "#d1d5db", 
        userID 
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject({ 
            ...newProject, 
            [name]: name === 'tags' ? value.split(',').map(tag => tag.trim()) : value 
        });
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3000/api/projects/${userID}`, { ...newProject, userID });
            setNewProject({ 
                title: "", 
                description: "", 
                dueDate: "", 
                tags: "", 
                backgroundColor: "#d1d5db",
                userID 
            });
            if (handleClose) {
                handleClose();
            }
        } catch (error) {
            console.error("Error creating project:", error.message);
        }
    };

    const colorOptions = [
        { value: "#d1d5db", label: "Default (Grey)", color: "#d1d5db" },
        { value: "#e9d5ff", label: "Purple", color: "#e9d5ff" },
        { value: "#d9f99d", label: "Green", color: "#d9f99d" },
        { value: "#fde68a", label: "Yellow", color: "#fde68a" },
        { value: "#bae6fd", label: "Blue", color: "#bae6fd" },
        { value: "#fca5a5", label: "Red", color: "#fca5a5" },
        { value: "#fed7aa", label: "Orange", color: "#fed7aa" },
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <form onSubmit={handleCreateProject} className="space-y-4">
                    <button 
                        type="button" 
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" 
                        onClick={handleClose}
                    >
                        <FaTimes size={20} />
                    </button>
                    <h1 className="text-xl font-semibold mb-4">New Task</h1>
                    <label htmlFor="title">Project Title</label>
                    <input 
                        id="title"
                        type="text" 
                        name="title" 
                        placeholder="Title" 
                        value={newProject.title} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <label htmlFor="description">Project Description</label>
                    <input 
                        id="description"
                        type="text" 
                        name="description" 
                        placeholder="Description" 
                        value={newProject.description} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <label htmlFor="dueDate">Project Duedate</label>
                    <input 
                        id="dueDate"
                        type="date" 
                        name="dueDate" 
                        placeholder="Due Date" 
                        value={newProject.dueDate} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <label htmlFor="tags">Tags</label>
                    <input 
                        id="tags"
                        type="text" 
                        name="tags" 
                        placeholder="Tags (comma separated)" 
                        value={newProject.tags} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <label htmlFor="backgroundColor">Background Color</label>
                    <div className="relative">
                        <select
                            id="backgroundColor"
                            name="backgroundColor"
                            value={newProject.backgroundColor}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none"
                        >
                            {colorOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            {colorOptions.map(option => (
                                newProject.backgroundColor === option.value && (
                                    <FaSquare key={option.value} style={{ color: option.color }} />
                                )
                            ))}
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                        Create Project
                    </button>
                </form>
            </div>
        </div>
    );
}