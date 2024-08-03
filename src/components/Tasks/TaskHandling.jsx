import axios from "axios";

export const createToggleTaskCompletion = (fetchTasks, toast) => async (taskId, currentStatus) => {
    try {
        const response = await axios.put(`http://localhost:3000/api/projects/tasks/${taskId}`, {
            completed: !currentStatus
        });
        if (response.status === 200) {
            fetchTasks(); 
        }
    } catch (error) {
        console.error("Error updating task:", error.response ? error.response.data : error.message);
        toast.error("Failed to update task. Please try again.", {
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

export const createToggleSubtaskCompletion = (fetchTasks, toast) => async (taskId, subtaskId, currentStatus) => {
    try {
        const response = await axios.put(`http://localhost:3000/api/projects/tasks/${taskId}/subtasks/${subtaskId}`, {
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