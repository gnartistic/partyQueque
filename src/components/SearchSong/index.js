import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.scss';
import QueueButton from '../QueueButton'; // Import the QueueButton component
import 'boxicons';

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const SEARCH_ENDPOINT = `https://api.spotify.com/v1/search`;

const getAccessToken = async ( client_id, client_secret, refresh_token ) =>
{
    try {
        const basic = btoa( `${ client_id }:${ client_secret }` ).toString( 'base64' );
        const response = await fetch( TOKEN_ENDPOINT, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${ basic }`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams( {
                grant_type: "refresh_token",
                refresh_token: refresh_token,
            } ),
        } );

        if( !response.ok ) {
            throw new Error( 'Failed to fetch access token' );
        }

        return response.json();
    } catch( error ) {
        console.error( 'Error fetching access token:', error );
        throw error; // Rethrow the error to handle it in the component
    }
};

const SearchSong = ( { client_id, client_secret, refresh_token } ) =>
{
    const [ searchQuery, setSearchQuery ] = useState( '' );
    const [ searchResults, setSearchResults ] = useState( [] );
    const [ accessToken, setAccessToken ] = useState( '' );

    useEffect( () =>
    {
        const fetchAccessToken = async () =>
        {
            try {
                const { access_token } = await getAccessToken( client_id, client_secret, refresh_token );
                setAccessToken( access_token );
            } catch( error ) {
                console.error( 'Error fetching access token:', error );
            }
        };

        fetchAccessToken();
    }, [ client_id, client_secret, refresh_token ] );

    const searchSongs = async () =>
    {
        try {
            const response = await axios.get( SEARCH_ENDPOINT, {
                params: {
                    q: searchQuery,
                    type: 'track',
                },
                headers: {
                    Authorization: `Bearer ${ accessToken }`,
                },
            } );

            setSearchResults( response.data.tracks.items );
        } catch( error ) {
            console.error( 'Error searching songs:', error );
        }
    };

    const handleSearchInputChange = ( event ) =>
    {
        const inputText = event.target.value;
        setSearchQuery( inputText );

        if( inputText.trim() === '' ) {
            // Clear search results if the input is empty
            setSearchResults( [] );
        } else {
            // Otherwise, perform search
            searchSongs();
        }
    };

    return (
        <div className='songSearch'>
            <div className='input-box'>
                <box-icon name='search-alt' color='	#1db954' size='cssSize'></box-icon>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Search for a song..."
                />
            </div>
                <ul>
                    {searchResults.map( ( song ) => (
                        <li key={song.id}>
                                <img className='album' src={song.album.images[ 0 ].url} alt={song.name} />
                                <div className='songInfo'>
                                    <h5 className='song'>{song.name}</h5>
                                    <h5 className='artist'>{song.artists.map( ( artist ) => artist.name ).join( ', ' )}</h5>
                                    {/* Render the QueueButton component */}
                                    <div className='plus-button'>
                                    </div>
                                </div>
                            <QueueButton
                                accessToken={accessToken}
                                client_id={client_id}
                                client_secret={client_secret}
                                refresh_token={refresh_token}
                                song={song}
                                songURI={song.uri}
                            />
                        </li>
                    ) )}
                </ul>
        </div>
    );
};

export default SearchSong;
