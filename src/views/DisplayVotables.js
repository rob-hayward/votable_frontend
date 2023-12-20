import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import './DisplayVotables.css';
import PieChart from '../components/PieChart';
import { VOTE_LABELS } from '../components/constants';

function DisplayVotables() {
    const [votables, setVotables] = useState([]);
    const [orderBy, setOrderBy] = useState('created_at'); // Default to newest

    useEffect(() => {
        async function fetchVotables() {
            try {
                const response = await axiosInstance.get(`/api/v1/get_all_votables/?order_by=${orderBy}`);
                setVotables(response.data);
            } catch (error) {
                console.error("Failed to fetch votables:", error.message);
            }
        }

        fetchVotables();
    }, [orderBy]);

    const handleVote = async (votableId, voteValue) => {
        try {
            const voteResponse = await axiosInstance.post(`/api/v1/vote/${votableId}/`, { vote: voteValue });

            if (voteResponse.status === 200) {
                const response = await axiosInstance.get(`/api/v1/get_votable/${votableId}/`);
                const updatedVotable = response.data;

                setVotables(prevVotables => {
                    return prevVotables.map(votable =>
                        votable.id === updatedVotable.id ? updatedVotable : votable
                    );
                });
            }

        } catch (error) {
            console.error("Failed to cast vote:", error.message);
        }
    };

    return (
        <div className="votables-container">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1>Vote On Everything.</h1>
                <select
                    value={orderBy}
                    onChange={e => setOrderBy(e.target.value)}
                    className="orderby-dropdown"
                >
                    <option value="created_at">Newest</option>
                    <option value="votes">Most Votes</option>
                    <option value="consensus">Consensus</option>
                    <option value="popularity">Popularity</option>
                </select>
            </div>
            <div className="votables-list">
                {votables.map(votable => {
                    const positiveLabel = VOTE_LABELS[votable.votable_type].positive;
                    const negativeLabel = VOTE_LABELS[votable.votable_type].negative;

                    return (
                        <div className="votable-item" key={votable.id}>
                            <div className="votable-content">
                                <h6>{votable.votable_type}:</h6>
                                <h6>{votable.title}</h6>
                                <p>{votable.text}</p>
                                <button
                                    className="positive-button"
                                    onClick={() => handleVote(votable.id, 1)}
                                >
                                    {positiveLabel}
                                </button>
                                <button
                                    className="negative-button"
                                    onClick={() => handleVote(votable.id, -1)}
                                >
                                    {negativeLabel}
                                </button>
                            </div>
                            <div className="votable-stats">
                                <PieChart votable={votable} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DisplayVotables;
