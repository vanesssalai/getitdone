import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { FaPlus, FaCheck, FaAngleRight, FaExclamationCircle } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RenderTasks from "../../components/Tasks/RenderTasks";
import Format from "../../layout/Format";
import NewTaskForm from "../../components/NewTask/NewTask";
import { calculateProgress, timeToEnd } from "../../components/ProgressCalculator/ProgressCalculator";

export default function ViewProject() {
    const { projectID } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState({ high: [], medium: [], low: [] });
    const [error, setError] = useState(null);
    const [createTask, setCreateTask] = useState(false);
    const [taskPriority, setTaskPriority] = useState(null);
    const [openSubtasks, setOpenSubtasks] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchProject();
        fetchTasks();
    }, [projectID]);

    //project handling
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

    //task handling
    const fetchTasks = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/projects/${projectID}/tasks?includeSubtasks=true`);
            const fetchedTasks = response.data;
            console.log(response.data);
    
            const sortedTasks = {
                high: fetchedTasks.filter(task => task.priority === 'high'),
                medium: fetchedTasks.filter(task => task.priority === 'medium'),
                low: fetchedTasks.filter(task => task.priority === 'low')
            };
            
            setTasks(sortedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error.response ? error.response.data : error.message);
        }
    }

    const toggleTaskCompletion = async (taskId, currentStatus) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/projects/${projectID}/tasks/${taskId}`, {
                completed: !currentStatus
            });
            if (response.status === 200) {
                fetchTasks(); 
            }
        } catch (error) {
            console.error("Error updating task:", error.response ? error.response.data : error.message);
            setError("Failed to update task. Please try again.",  {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });;
        }
    };

    const toggleSubtaskCompletion = async (taskId, subtaskId, currentStatus) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/projects/${projectID}/tasks/${taskId}/subtasks/${subtaskId}`, {
                completed: !currentStatus
            });
            if (response.status === 200) {
                fetchTasks();
            }
        } catch (error) {
            console.error("Error updating subtask:", error.response ? error.response.data : error.message);
            toast.error("Failed to update subtask. Please try again.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };
    
    const handleCreateTask = (priority) => {
        setTaskPriority(priority);
        setCreateTask(true);
    }

    const closeNewTaskForm = () => {
        setCreateTask(false);
        fetchTasks(); 
    }

    if (error) {
        return <Format content={<div>Error: {error}</div>} />;
    }

    if (!project) {
        return <Format content={<div>Loading...</div>} />;
    }

    return (
        <Format userID={project.userID} content={
            <div className="px-12 py-4">
                <ToastContainer />
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col flex-start w-4/5">
                        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
                        <p className="mb-4">{project.description}</p>
                        <div className="w-1/2 bg-gray-100 rounded-full h-2.5 my-2 border border-gray-300">
                            <div className="bg-green-400 h-2.5 rounded-full" style={{ width: `${calculateProgress(project.startDate, project.endDate)}%` }}></div>
                        </div>
                        {timeToEnd(project.endDate) > 7 ? (
                            <p>{timeToEnd(project.endDate)} days to end date</p>
                        ) : timeToEnd(project.endDate) > 1 ? (
                            <p><FaExclamationCircle className="inline-block align-middle mr-1"  style={{ color: "#dc2626" }}/> {timeToEnd(project.endDate)} days to end date</p>
                        ) : (
                            <p><FaExclamationCircle className="inline-block align-middle mr-1" style={{ color: "#dc2626" }}/> {timeToEnd(project.endDate)} day to end date</p>
                        )}
                        {project.tags && (
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
                    </div>
                    <button 
                        onClick={handleDeleteProject}
                        className="bg-red-300 text-white px-4 py-2 rounded hover:bg-red-500 h-fit"
                    >
                        Delete Project
                    </button>
                </div>
                <div className="w-4/5 flex justify-around ml-auto mr-auto p-4">
                    <RenderTasks
                        tasks={tasks}
                        toggleTaskCompletion={toggleTaskCompletion}
                        toggleSubtaskCompletion={toggleSubtaskCompletion}
                        handleCreateTask={handleCreateTask}
                    />
                </div>
                {createTask && (
                    <NewTaskForm 
                        handleClose={closeNewTaskForm} 
                        priority={taskPriority} 
                        projectID={projectID} 
                        projectEndDate={project.endDate} 
                        projectStartDate={project.startDate}
                    />
                )}
            </div>
        } />
    );
}