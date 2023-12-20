import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import './CreateVotable.css';

function CreateVotable() {
    const [votableType, setVotableType] = useState('Question'); // Capitalized the default value to match our backend choices
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            console.log("Submitting votable with type:", votableType);

            const response = await axiosInstance.post(`/api/v1/create_votable/`, {
                title: title,
                text: text,
                votable_type: votableType
            });

            if (response.status === 201) {
                console.log("Successfully created votable. Navigating to DisplayVotables.");
                navigate('/dashboard/display_votables');
            } else {
                console.error("Unexpected response status:", response.status);
                setErrorMessage('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error("Error during votable submission:", error);
            setErrorMessage('Error: ' + error.message);
        }
    }

    return (
        <div className="container create-votable-container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className="text-center mb-4">Vote On Anything.</h1>
                    <h4 className="text-center mb-4">Create A New Votable</h4>
                    {errorMessage &&
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    }
                    <form onSubmit={handleSubmit} className="border p-4 rounded">
                        <div className="mb-3">
                            <label className="form-label">Select Votable Type</label>
                            <select value={votableType} onChange={(e) => setVotableType(e.target.value)} className="form-control">
                                <option value="Question">Question</option>
                                <option value="Statement">Statement</option>
                                <option value="Proposal">Proposal</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Enter Votable Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Enter Votable Text</label>
                            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Text" className="form-control"></textarea>
                        </div>
                        <button type="submit" className="create-votable-button">Create New Votable</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateVotable;
