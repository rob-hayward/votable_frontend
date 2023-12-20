import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext';
import logo from '../assets/logo.png';
import './Dashboard.css';

function Dashboard() {
    const { user: contextUser } = useContext(AuthContext);
    const [user, setUser] = useState(contextUser || { username: '' });


    useEffect(() => {
        // Fetch the current user's data when the dashboard mounts
        axiosInstance.get('/api/v1/current_user/')
        .then(response => {
            setUser(response.data);
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
    }, []);

    return (
        <>
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo-image"/>
                <h2>Welcome to Votable {user && user.username}</h2>
            </div>

            <div className="dashboard-container">
                <div className="dashboard-options">
                    {/* Option 1 */}
                    <div className="option">
                        <h2>Vote On Anything.</h2>
                        <p>If there's a subject that you feel passionately about you can make your very own Votable for it! Enter here to create a question, statement, or proposal for the community to vote on.</p>
                        <Link to="/dashboard/create_votable">
                            <button>Create A New Votable Now</button>
                        </Link>
                    </div>

                    {/* Option 2 */}
                    <div className="option">
                        <h2>Vote On Everything.</h2>
                        <p>Each Votable is a question, proposal or statement that you can have your say. See how your thoughts and feelings compare to the rest of the community.</p>
                        <Link to="/dashboard/display_votables">
                            <button>Start Voting Now</button>
                        </Link>
                    </div>
                </div>


            </div>
        </>
    );
}

export default Dashboard;
