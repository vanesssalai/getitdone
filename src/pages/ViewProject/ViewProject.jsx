import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { FaPlus } from "react-icons/fa";

import Format from "../../layout/Format";

export default function ViewProject() {
    const { projectID } = useParams();
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchProject();
    }, [projectID]);

    const fetchProject = async () => {
        try {
            console.log("Sending request to:", `http://localhost:3000/api/projects/project/${projectID}`);
            const response = await axios.get(`http://localhost:3000/api/projects/project/${projectID}`);
            setProject(response.data);
        } catch (error) {
            console.error("Error fetching project:", error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    const handleDeleteProject = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/projects/project/${projectID}`);
            navigate('/Home/' + project.userID); 
        } catch (error) {
            console.error("Error deleting project:", error.message);
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    if (error) {
        return <Format content={<div>Error: {error}</div>} />;
    }

    if (!project) {
        return <Format content={<div>Loading...</div>} />;
    }

    return (
        <Format content={
            <div className="p-6">
                <div>
                    <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
                    <p className="mb-4">{project.description}</p>
                    <p className="mb-4">Due Date: {new Date(project.dueDate).toLocaleDateString()}</p>
                    {!project.tags && (
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag, index) => (
                                    <span key={index} className="bg-green-200 px-2 py-1 rounded-md text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <button 
                        onClick={handleDeleteProject}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Delete Project
                    </button>
                </div>
                <div className="w-4/5 flex justify-around ml-auto mr-auto p-4">
                    <div className="flex flex-col items-center py-4 px-2 bg-red-50 flex-1 m-2">
                        <h3>High Priority</h3>
                        <ul className="flex flex-col items-center space-y-4 w-full">
                        <li className="w-4/5">
                                <button 
                                    className="bg-red-100 p-2 rounded-lg flex items-center justify-center w-full hover:bg-red-200"
                                    // onClick={handleCreateProject}
                                >
                                    <FaPlus />  Add Task
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center py-4 px-2 bg-amber-50 flex-1  m-2">
                        <h3>Medium Priority</h3>
                        <ul className="flex flex-col items-center space-y-4 w-full">
                            <li className="w-4/5">
                                <button 
                                    className="bg-amber-100 p-2 rounded-lg flex items-center justify-center w-full hover:bg-amber-200"
                                    // onClick={handleCreateProject}
                                >
                                    <FaPlus />  Add Task
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center py-4 px-2 bg-green-50 flex-1 m-2">
                        <h3>Low Priority</h3>
                        <ul className="flex flex-col items-center space-y-4 w-full">
                            <li className="w-4/5">
                                <button 
                                    className="bg-green-100 p-2 rounded-lg flex items-center justify-center w-full hover:bg-green-200"
                                    // onClick={handleCreateProject}
                                >
                                    <FaPlus />  Add Task
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        } />
    );
}