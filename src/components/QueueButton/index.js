import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'boxicons';
import { Flex, Spinner } from '@chakra-ui/react';
import { themeAtom } from "../../atoms/theme";
import { queueAtom } from "../../atoms/queueAtom";
import { useAtom } from 'jotai';
import theme from "../../theme";
import getQueueItems from "../QueueDisplay/getQueue";

const QUEUE_ENDPOINT = `https://api.spotify.com/v1/me/player/queue`;

const QueueButton = ( { accessToken, songURI, client_id, client_secret, refresh_token } ) =>
{
    const [ queue, setQueue ] = useAtom( queueAtom );
    const [ themeName ] = useAtom( themeAtom );
    const [ isLoading, setIsLoading ] = useState( false ); // State for spinner
    const activeTheme = theme.colors[ themeName ] || theme.colors.black;

    const addToQueue = async () =>
    {
        setIsLoading( true ); // Show spinner
        try {
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

            // Fetch and update the queue atom
            await getQueueItems( client_id, client_secret, refresh_token, setQueue );
        } catch( error ) {
            console.error( "Error adding song to queue:", error );
            toast.error( "Failed to add song to queue" );
        } finally {
            setIsLoading( false ); // Hide spinner
        }
    };

    return (
        <Flex
            width={{base: "12%", lg: "5%"}}
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
    );
};

export default QueueButton;