import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginSignup from './pages/LoginSignup/LoginSignup';
import ProjectManager from "./pages/ProjectManager/ProjectManager";
import ViewProject from "./pages/ViewProject/ViewProject";
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginSignup />} />
                <Route path='/Home/:userID' element={<ProjectManager />} />
                <Route path="/Project/:projectID" element={<ViewProject />} />
            </Routes>
        </Router>
    )
}

export default App
