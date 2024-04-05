import { useEffect, useState } from "react";
import getNowPlayingItem from "./nowPlaying.js";

import "./SpotifyPlayer.scss";

function SpotifyPlayer ( props )
{
    const [ result, setResult ] = useState( {} );

    useEffect( () =>
    {
        Promise.all( [
            getNowPlayingItem(
                props.client_id,
                props.client_secret,
                props.refresh_token
            ),
        ] ).then( ( results ) =>
        {
            setResult( results[ 0 ] );
        } );
    }, [] );

    return result.isPlaying ? (
        <div className="nowplayingcard">
            <div className="nowplayingcontainer-inner">
                <img id="trackart" src={result.albumImageUrl} alt="album cover"></img>
                <div className="trackInfo">
                    <h1 className="trackTitle">
                        {result.title}
                    </h1>
                    <h2 className="trackArtist">
                        {result.artist}
                    </h2>
                </div>
            </div>
        </div>
    ) : (
            <div className="waiting-text">
                <h1>
                    Music will starts soon!
                </h1>
        </div>
    );
}

export default SpotifyPlayer;
