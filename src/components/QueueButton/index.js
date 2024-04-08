import React from 'react';
import axios from 'axios';
import './index.scss';
import 'boxicons';

const QUEUE_ENDPOINT = `https://api.spotify.com/v1/me/player/queue`;

const QueueButton = ({ accessToken, songURI }) => {
    const addToQueue = async () => {
        try {
            const response = await axios.post(
                QUEUE_ENDPOINT,
                {},
                {
                    params: {
                        uri: songURI,
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log('Song added to queue:', response.data);
        } catch (error) {
            console.error('Error adding song to queue:', error);
        }
    };

    return (
        <div className='plus-button' onClick={addToQueue}>
            <box-icon name='plus-circle' color='	#1db954' size='md'></box-icon>
        </div>
    );
};

export default QueueButton;
