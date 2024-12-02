import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.scss';
import QueueButton from '../QueueButton';
import 'boxicons';
import { themeAtom } from "../../atoms/theme";
import { useAtom } from 'jotai';
import theme from "../../theme";
import { Flex, Text, Input, Image, Box } from '@chakra-ui/react';
import { Search2Icon } from "@chakra-ui/icons";

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
    const [ searchResFlexts, setSearchResFlexts ] = useState( [] );
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

            setSearchResFlexts( response.data.tracks.items );
        } catch( error ) {
            console.error( 'Error searching songs:', error );
        }
    };

    const handleSearchInputChange = ( event ) =>
    {
        const inputText = event.target.value;
        setSearchQuery( inputText );

        if( inputText.trim() === '' ) {
            // Clear search resFlexts if the input is empty
            setSearchResFlexts( [] );
        } else {
            // Otherwise, perform search
            searchSongs();
        }
    };

    const [ themeName, setThemeName ] = useAtom( themeAtom );
    const activeTheme = theme.colors[ themeName ] || theme.colors.black;

    return (
        <Flex className='songSearch' gap={6}>
            <Flex flexDirection="row" height="70px" justifyContent="flex-start" alignItems="center" pl={4} py={2} width={{ base: "90vw", lg: "100%" }} borderRadius="20px" bg={activeTheme.accent}>
                <Search2Icon name='search-alt' color={activeTheme.background} />
                <Input
                    fontSize={{ base: "16px", lg: "20px" }}
                    color={activeTheme.background}
                    _focus={{ outline: "none", border: "none", boxShadow: "none" }}
                    _hover={{}}
                    border="none"
                    bg="transparent"
                    pl={2}
                    width="90%"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Search for a song..."
                />
            </Flex>
            <Flex flexDirection="column" justifyContent="flex-start" alignItems="center" overflowY="scroll" height="450px" width={{ base: "90vw", lg: "100%" }} borderRadius="20px"
                bg={activeTheme.primary}>
                {searchResFlexts.map( ( song ) => (
                    <Flex key={song.id} justifyContent="space-between" px={4} py={6} width="90%">
                        <Flex gap={4}>
                            <Image height={{ base: "75px", lg: "75px" }} src={song.album.images[ 0 ].url} alt={song.name} />
                            <Flex justifyContent="flex-start" flexDirection="column" textAlign="left">
                                <Text color={activeTheme.background}  className='song' fontSize={{base: "16px", lg: "18px"}}>{song.name}</Text>
                                <Text color={activeTheme.background}  className='artist' fontSize={{base: "18px", lg: "20px"}}>{song.artists.map( ( artist ) => artist.name ).join( ', ' )}</Text>
                                {/* Render the QueueButton component */}
                                <Flex className='plus-button'>
                                </Flex>
                            </Flex>
                        </Flex>
                        <QueueButton
                            accessToken={accessToken}
                            client_id={client_id}
                            client_secret={client_secret}
                            refresh_token={refresh_token}
                            song={song}
                            songURI={song.uri}
                        />
                    </Flex>
                ) )}
            </Flex>
        </Flex>
    );
};

export default SearchSong;