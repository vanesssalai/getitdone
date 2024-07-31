import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginSignup from './pages/LoginSignup.jsx/LoginSignup';
import ProjectManager from "./pages/ProjectManager/ProjectManager";
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginSignup />} />
                <Route path='/Projects/:userID' element={<ProjectManager />} />
            </Routes>
        </Router>
    )
}

export default App
