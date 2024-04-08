import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
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
            // Show success toast notification
            toast.success('Song added to queue successfully!');
        } catch (error) {
            console.error('Error adding song to queue:', error);
            // Show error toast notification
            toast.error('Failed to add song to queue');
        }
    };

    return (
        <div className='plus-button' onClick={addToQueue}>
            <box-icon name='plus-circle' color='#1db954' size='md'></box-icon>
        </div>
    );
};

export default QueueButton;
