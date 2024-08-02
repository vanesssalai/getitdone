import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus } from "react-icons/fa";
import { FaExclamationCircle } from "react-icons/fa";

import Format from "../../layout/Format";
import NewProjectForm from "../../components/NewProject/NewProject";

function timeToDue(dueDate) {
    const currentDate = new Date();
    const dueDateObject = new Date(dueDate);
    const timeDifference = dueDateObject - currentDate;
    const daysToDue = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
    return daysToDue;
}

export default function ProjectManager() {
    const { userID } = useParams();
    const [projects, setProjects] = useState([]);
    const [createProject, setCreateProject] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            console.log("Sending request to:", `http://localhost:3000/api/projects/user/${userID}`);
            const response = await axios.get(`http://localhost:3000/api/projects/user/${userID}`);
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error.response ? error.response.data : error.message);
        }
    };


    const handleCreateProject = () => {
        setCreateProject(true);
    }

    const handleCloseCreateProject = () => {
        setCreateProject(false);
        fetchProjects();
    }

    const handleProjectNavigation = (projectID) => {
        navigate(`/Project/${projectID}`);
    };

    return (
        <Format content={
            <div className="px-12 py-4">
                {createProject && (<NewProjectForm handleClose={handleCloseCreateProject} />)}
                <div className="py-4">
                    <h2 className="text-3xl font-bold my-2">Projects</h2>
                    <ul className="flex flex-wrap gap-4">
                        {projects.map(project => (
                            <li 
                                key={project._id} 
                                className="relative p-4 rounded-lg min-w-[200px] min-h-[150px] cursor-pointer"
                                style={{ 
                                    border: `1px solid ${project.backgroundColor || 'grey'}`
                                }}
                                onClick={() => handleProjectNavigation(project._id)} // Add this line
                            >
                                <span 
                                    className="absolute inset-0 rounded-lg"
                                    style={{ 
                                        backgroundColor: project.backgroundColor || 'grey', 
                                        opacity: 0.6,
                                        zIndex: -1 
                                    }}
                                    
                                />
                                <h3 className="text-xl font-semibold">{project.title}</h3>
                                {timeToDue(project.dueDate) > 7 ? (
                                    <p>{timeToDue(project.dueDate)} days to due date</p>
                                ) : timeToDue(project.dueDate) > 1 ? (
                                    <p><FaExclamationCircle className="inline-block align-middle mr-1"  style={{ color: "#dc2626" }}/> {timeToDue(project.dueDate)} days to due date</p>
                                ) : (
                                    <p><FaExclamationCircle className="inline-block align-middle mr-1" style={{ color: "#dc2626" }}/> {timeToDue(project.dueDate)} day to due date</p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag, index) => (
                                        <span key={index} className="bg-gray-300 px-2 py-1 rounded-md text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </li>
                        ))}
                        <li>
                            <button 
                                className="bg-gray-100 p-4 rounded-lg flex items-center justify-center min-w-[200px] min-h-[150px] hover:bg-gray-200"
                                onClick={handleCreateProject}
                            >
                                <FaPlus />  Add New Project
                            </button>
                        </li>
                    </ul>
                </div>
                <div>
                    <h1>Due Soon</h1>
                </div>
            </div>
        } />
    );
}