import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'boxicons';
import { Flex, Spinner, useDisclosure } from '@chakra-ui/react';
import { themeAtom } from "../../atoms/theme";
import { queueAtom } from "../../atoms/queueAtom";
import { useAtom } from 'jotai';
import theme from "../../theme";
import getQueueItems from "../QueueDisplay/getQueue";
import TipModal from "../TipModal"; // Import the modal component

const QUEUE_ENDPOINT = `https://api.spotify.com/v1/me/player/queue`;

const QueueButton = ( { accessToken, songURI, client_id, client_secret, refresh_token, song } ) =>
{
    const [ queue, setQueue ] = useAtom( queueAtom );
    const [ isLoading, setIsLoading ] = useState( false ); // State for spinner
    const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI modal state
    const addedSongsCount = localStorage.getItem( "addedSongsCount" ) || 0;
    const [ themeName ] = useAtom( themeAtom );
    const activeTheme = theme.colors[ themeName ] || theme.colors.black;

    // Function to handle adding to the queue
    const addToQueue = async () =>
    {
        // Check for duplicate songs in the queue
        const isDuplicate = queue.some( ( track ) => track.id === song.id );
        if( isDuplicate ) {
            toast.error( "This song is already in the queue!" );
            return;
        }

        setIsLoading( true ); // Show spinner
        try {
            // Add the song to the Spotify queue
            await axios.post(
                QUEUE_ENDPOINT,
                {},
                {
                    params: {
                        uri: songURI,
                    },
                    headers: {
                        Authorization: `Bearer ${ accessToken }`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success( "Song added to queue successfully!" );

            // Update the queue atom with the latest data
            const updatedQueue = await getQueueItems( client_id, client_secret, refresh_token, setQueue );
            setQueue( updatedQueue );

            // Track the number of songs the user has added
            const newCount = Number( addedSongsCount ) + 1;
            localStorage.setItem( "addedSongsCount", newCount );

            // Trigger the Tip DJ modal every 5 songs added
            if( newCount % 5 === 0 ) {
                onOpen();
            }
        } catch( error ) {
            console.error( "Error adding song to queue:", error );
            toast.error( "Failed to add song to queue" );
        } finally {
            setIsLoading( false ); // Hide spinner
        }
    };

    return (
        <>
            <Flex
                width={{ base: "12%", lg: "5%" }}
                justifyContent="center"
                alignItems="center"
                height="100%"
                cursor="pointer"
                onClick={!isLoading ? addToQueue : undefined} // Prevent multiple clicks while loading
                transform="scale(1)"
                transition="transform 0.2s ease, background-color 0.2s ease"
                _hover={{
                    transform: "scale(1.2)", // Hover effect
                    backgroundColor: activeTheme.accent2,
                }}
            >
                {isLoading ? (
                    <Spinner color={activeTheme.background} size="md" />
                ) : (
                    <box-icon name="plus-circle" color={activeTheme.background} size="lg" />
                )}
            </Flex>
            <TipModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default QueueButton;