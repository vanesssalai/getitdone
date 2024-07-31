import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus } from "react-icons/fa";

import Format from "../../layout/Format";

export default function ProjectManager() {
    const { userID } = useParams();
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ title: "", description: "", dueDate: "", tags: "", userID });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            console.log("Sending request to:", `http://localhost:3000/api/projects/${userID}`);
            const response = await axios.get(`http://localhost:3000/api/projects/${userID}`);
            console.log("Received response:", response.data);
            setProjects(response.data);
        } catch (error) {
          console.error("Error fetching projects:", error.response ? error.response.data : error.message);
        }
      };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject({ ...newProject, [name]: name === 'tags' ? value.split(',').map(tag => tag.trim()) : value });
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3000/api/projects`, { ...newProject, userID });
            setProjects([...projects, response.data]);
            setNewProject({ title: "", description: "", dueDate: "", tags: "", userID });
        } catch (error) {
            console.error("Error creating project:", error.message);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await axios.delete(`http://localhost:3000/api/projects/${userID}/${projectId}`);
            setProjects(projects.filter(project => project._id !== projectId));
        } catch (error) {
            console.error("Error deleting project:", error.message);
        }
    };

    return (
        <Format content={
            <>
                <h1>Project Manager</h1>
                <form onSubmit={handleCreateProject}>
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Title" 
                        value={newProject.title} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="description" 
                        placeholder="Description" 
                        value={newProject.description} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <input 
                        type="date" 
                        name="dueDate" 
                        placeholder="Due Date" 
                        value={newProject.dueDate} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="tags" 
                        placeholder="Tags (comma separated)" 
                        value={newProject.tags} 
                        onChange={handleInputChange} 
                    />
                    <button type="submit"><FaPlus /> Add New Project</button>
                </form>
                <ul>
                    {projects.map(project => (
                        <li key={project._id}>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <p>Due: {project.dueDate}</p>
                            <p>Tags: {project.tags.join(", ")}</p>
                            <button onClick={() => handleDeleteProject(project._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </>
        } />
    );
}