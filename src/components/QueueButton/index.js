import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'boxicons';
import { Flex } from '@chakra-ui/react';
import { AddIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { themeAtom } from "../../atoms/theme";
import { useAtom } from 'jotai';
import theme from "../../theme";

const QUEUE_ENDPOINT = `https://api.spotify.com/v1/me/player/queue`;

const QueueButton = ( { accessToken, songURI } ) =>
{
    const addToQueue = async () =>
    {
        try {
            const response = await axios.post(
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

            console.log( 'Song added to queue:', response.data );
            // Show success toast notification
            toast.success( 'Song added to queue successfully!' );
        } catch( error ) {
            console.error( 'Error adding song to queue:', error );
            // Show error toast notification
            toast.error( 'Failed to add song to queue' );
        }
    };

    const [ themeName, setThemeName ] = useAtom( themeAtom );
    const activeTheme = theme.colors[ themeName ] || theme.colors.black;

    return (
        <Flex justifyContent="center" alignItems="center" height="100%">
            <box-icon name='plus-circle' color={activeTheme.background} size='lg' onClick={addToQueue}></box-icon>
            </Flex>
    );
};

export default QueueButton;
