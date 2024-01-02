// App.js
import React, { useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthContext from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import { configureAxios } from './axiosConfig';

import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import CreateVotable from './views/CreateVotable';
import DisplayVotables from './views/DisplayVotables';

// Add faBars to the library
library.add(faBars);

configureAxios(); // Run the configuration function

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('access_token');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            <Router>
                <Navbar isLoggedIn={isAuthenticated} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<ProtectedRoute />}>
                        <Route index element={<Dashboard />} />
                        <Route path="create_votable" element={<CreateVotable />} />
                        <Route path="display_votables" element={<DisplayVotables />} />
                    </Route>
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
