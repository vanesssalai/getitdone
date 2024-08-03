import React, { useState } from 'react';
import { FaPlus, FaCheck, FaAngleRight } from "react-icons/fa";

const RenderTask = ({ task, toggleTaskCompletion, toggleSubtaskCompletion, openSubtasks, setOpenSubtasks }) => {
    const areAllSubtasksCompleted = (subtasks) => {
        return subtasks.length > 0 && subtasks.every(subtask => subtask.completed);
    };

    const allSubtasksCompleted = areAllSubtasksCompleted(task.subTasks);

    return (
        <div key={task._id} className="w-4/5 relative mb-2">
            <li className="bg-white p-2 rounded-lg flex items-center justify-between">
                <div className="flex flex-col">
                    <span className={task.completed || allSubtasksCompleted ? "line-through" : ""}>
                        {task.title}
                    </span>
                    <span className="text-xs text-gray-400">
                        {task.dueDate}
                    </span>
                </div>
                {task.subTasks && task.subTasks.length > 0 ? (
                    <button onClick={() => setOpenSubtasks(openSubtasks === task._id ? null : task._id)}>
                        <FaAngleRight 
                            style={{fill: allSubtasksCompleted ? 'green' : 'gray'}} 
                            className={openSubtasks === task._id ? 'transform rotate-90' : ''}
                        />
                    </button>
                ) : (
                    <button
                        onClick={() => toggleTaskCompletion(task._id, task.completed)}
                        className={`p-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                        {task.completed && <FaCheck className="text-white w-2 h-2" />}
                    </button>
                )}
            </li>
            {openSubtasks === task._id && (
                <div className="absolute left-full top-0 ml-4 bg-gray-100 p-2 rounded-lg shadow-md z-10" style={{ minWidth: '200px' }}>
                    <h4 className="font-bold mb-2">Subtasks:</h4>
                    <ul>
                        {task.subTasks.map(subtask => (
                            <li key={subtask._id} className="flex items-center justify-between mb-1">
                                <span className={subtask.completed ? "line-through" : ""}>{subtask.title}</span>
                                <button
                                    onClick={() => toggleSubtaskCompletion(task._id, subtask._id, subtask.completed)}
                                    className={`p-1 rounded-full ${subtask.completed ? 'bg-green-500' : 'bg-gray-200'}`}
                                >
                                    {subtask.completed && <FaCheck className="text-white w-2 h-2" />}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RenderTask;