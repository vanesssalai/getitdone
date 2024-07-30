import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginSignup from './pages/LoginSignup.jsx/LoginSignup';
import TaskManager from "./pages/TaskManager/TaskManager";
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginSignup />} />
                <Route path='/tasks/:userID' element={<TaskManager />} />
            </Routes>
        </Router>
    )
}

export default App
