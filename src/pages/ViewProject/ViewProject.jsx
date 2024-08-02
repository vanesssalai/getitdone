import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { FaPlus, FaCheck, FaAngleRight } from "react-icons/fa";
import Format from "../../layout/Format";
import NewTaskForm from "../../components/NewTask/NewTask";

export default function ViewProject() {
    const { projectID } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState({ high: [], medium: [], low: [] });
    const [error, setError] = useState(null);
    const [createTask, setCreateTask] = useState(false);
    const [taskPriority, setTaskPriority] = useState(null);
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
            const response = await axios.get(`http://localhost:3000/api/projects/${projectID}/tasks`);
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
            setError("Failed to update task. Please try again.");
        }
    };

    const renderTask = (task) => (
        <li key={task._id} className="w-4/5 bg-white p-2 rounded-lg flex items-center justify-between">
            <span className={task.completed ? "line-through" : ""}>{task.title}</span>
            {task.subTasks && task.subTasks.length > 0 ? (
                <button
                    onClick={() => toggleTaskCompletion(task._id, task.completed)}
                    className={`p-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                    {task.completed && <FaCheck className="text-white w-2 h-2" />}
                </button>
            ) : (
                <button>
                    <FaAngleRight style={{fill: 'gray'}}/>
                </button>
            )}
            
        </li>
    );

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
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col flex-start">
                        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
                        <p className="mb-4">{project.description}</p>
                        <p className="mb-4">Due Date: {new Date(project.dueDate).toLocaleDateString()}</p>
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
                    <div className="flex flex-col items-center py-4 px-2 bg-red-50 flex-1 m-2 h-fit">
                        <h3>High Priority</h3>
                        <ul className="flex flex-col items-center space-y-4 w-full">
                            {tasks.high.map(renderTask)}
                            <li className="w-4/5">
                                <button 
                                    className="bg-red-100 p-2 rounded-lg flex items-center justify-center w-full hover:bg-red-200"
                                    onClick={() => handleCreateTask("high")}
                                >
                                    <FaPlus />  Add Task
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center py-4 px-2 bg-amber-50 flex-1 m-2 h-fit">
                        <h3>Medium Priority</h3>
                        <ul className="flex flex-col items-center space-y-4 w-full">
                            {tasks.medium.map(renderTask)}
                            <li className="w-4/5">
                                <button 
                                    className="bg-amber-100 p-2 rounded-lg flex items-center justify-center w-full hover:bg-amber-200"
                                    onClick={() => handleCreateTask("medium")}
                                >
                                    <FaPlus />  Add Task
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center py-4 px-2 bg-green-50 flex-1 m-2 h-fit">
                        <h3>Low Priority</h3>
                        <ul className="flex flex-col items-center space-y-4 w-full">
                            {tasks.low.map(renderTask)}
                            <li className="w-4/5">
                                <button 
                                    className="bg-green-100 p-2 rounded-lg flex items-center justify-center w-full hover:bg-green-200"
                                    onClick={() => handleCreateTask("low")}
                                >
                                    <FaPlus />  Add Task
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                {createTask && (
                    <NewTaskForm 
                        handleClose={closeNewTaskForm} 
                        priority={taskPriority} 
                        projectID={projectID}
                    />
                )}
            </div>
        } />
    );
}