import React from 'react';
import './Home.css';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home-container">
            <img src={logo} alt="Logo" />
            <h1>Vote on anything. Vote on everything.</h1>

            <p><Link to="/login">login</Link> or <Link to="/register">register</Link> to start voting.</p>
        </div>
    );
}

export default Home;
