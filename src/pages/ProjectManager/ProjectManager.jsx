import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus } from "react-icons/fa";
import { FaExclamationCircle } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Format from "../../layout/Format";
import NewProjectForm from "../../components/NewProject/NewProject";
import { calculateProgress, timeToEnd } from "../../components/ProgressCalculator/ProgressCalculator";

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
        <Format userID={userID} content={
            <>
                <ToastContainer />
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
                                    onClick={() => handleProjectNavigation(project._id)}
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
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 my-2 border border-gray-300">
                                        <div className="bg-green-400 h-2.5 rounded-full" style={{ width: `${calculateProgress(project.startDate, project.endDate)}%` }}></div>
                                    </div>
                                    {timeToEnd(project.endDate) > 7 ? (
                                        <p>{timeToEnd(project.endDate)} days to end date</p>
                                    ) : timeToEnd(project.endDate) > 1 ? (
                                        <p><FaExclamationCircle className="inline-block align-middle mr-1"  style={{ color: "#dc2626" }}/> {timeToEnd(project.endDate)} days to end date</p>
                                    ) : (
                                        <p><FaExclamationCircle className="inline-block align-middle mr-1" style={{ color: "#dc2626" }}/> {timeToEnd(project.endDate)} day to end date</p>
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
                    <div className="py-4">
                        <h2 className="text-3xl font-bold my-2">Due Soon</h2>
                    </div>
                </div>
            </>
        } />
    );
}