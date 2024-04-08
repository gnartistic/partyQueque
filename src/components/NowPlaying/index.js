import { useEffect, useState } from "react";
import getNowPlayingItem from "./nowPlaying.js";

import "./SpotifyPlayer.scss";

function SpotifyPlayer(props) {
    const [nowPlaying, setNowPlaying] = useState(null);

    useEffect(() => {
        // Immediately fetch data when the component mounts
        fetchData();

        // Set up a timer to fetch data periodically after an initial load
        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [props.client_id, props.client_secret, props.refresh_token]);

    const fetchData = async () => {
        try {
            const result = await getNowPlayingItem(
                props.client_id,
                props.client_secret,
                props.refresh_token
            );
            setNowPlaying(result);
        } catch (error) {
            console.error('Error fetching now playing:', error);
        }
    };

    return nowPlaying ? (
        <div className="nowplayingcard">
            <div className="nowplayingcontainer-inner">
                <img id="trackart" src={nowPlaying.albumImageUrl} alt="album cover"></img>
                <div className="trackInfo">
                    <h1 className="trackTitle">{nowPlaying.title}</h1>
                    <h2 className="trackArtist">{nowPlaying.artist}</h2>
                </div>
            </div>
        </div>
    ) : (
        <div className="waiting-text">
            <h1>Let me cook...</h1>
        </div>
    );
}

export default SpotifyPlayer;

