import React, { useState } from 'react';
import { FaPlus } from "react-icons/fa";
import RenderTask from './RenderTask';

const RenderAllTasks = ({ tasks, toggleTaskCompletion, toggleSubtaskCompletion, handleCreateTask }) => {
    const [openSubtasks, setOpenSubtasks] = useState(null);

    return (
        <>
            <div className="flex flex-col items-center py-4 px-2 bg-red-50 flex-1 m-2 h-fit">
                <h3 className="text-l font-bold text-red-600">High Priority</h3>
                <ul className="flex flex-col items-center space-y-4 w-full">
                    {tasks.high.map(task => (
                        <RenderTask
                            key={task._id}
                            task={task}
                            toggleTaskCompletion={toggleTaskCompletion}
                            toggleSubtaskCompletion={toggleSubtaskCompletion}
                            openSubtasks={openSubtasks}
                            setOpenSubtasks={setOpenSubtasks}
                        />
                    ))}
                    <li className="w-4/5 m-0">
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
                <h3 className="text-l font-bold text-amber-600">Medium Priority</h3>
                <ul className="flex flex-col items-center space-y-4 w-full">
                    {tasks.medium.map(task => (
                        <RenderTask
                            key={task._id}
                            task={task}
                            toggleTaskCompletion={toggleTaskCompletion}
                            toggleSubtaskCompletion={toggleSubtaskCompletion}
                            openSubtasks={openSubtasks}
                            setOpenSubtasks={setOpenSubtasks}
                        />
                    ))}
                    <li className="w-4/5 m-0">
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
                <h3 className="text-l font-bold text-green-600">Low Priority</h3>
                <ul className="flex flex-col items-center space-y-4 w-full">
                    {tasks.low.map(task => (
                        <RenderTask
                            key={task._id}
                            task={task}
                            toggleTaskCompletion={toggleTaskCompletion}
                            toggleSubtaskCompletion={toggleSubtaskCompletion}
                            openSubtasks={openSubtasks}
                            setOpenSubtasks={setOpenSubtasks}
                        />
                    ))}
                    <li className="w-4/5 m-0">
                        <button 
                            className="bg-green-100 p-2 rounded-lg flex items-center justify-center w-full hover:bg-green-200"
                            onClick={() => handleCreateTask("low")}
                        >
                            <FaPlus />  Add Task
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default RenderAllTasks;