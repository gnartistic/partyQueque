import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Image, useBreakpointValue } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { themeAtom } from "../../atoms/theme";
import theme from "../../theme";
import getQueueItems from "./getQueue.js";
import getNowPlayingItem from "../NowPlaying/nowPlaying.js";

const QueueDisplay = ( { client_id, client_secret, refresh_token } ) =>
{
  const hiddenScrollbarStyle = {
    scrollbarWidth: "none", // For Firefox
    msOverflowStyle: "none", // For Internet Explorer and Edge
    overflowY: "scroll",
  };

  const hiddenScrollbarWebkit = {
    "::-webkit-scrollbar": {
      display: "none", // For WebKit browsers like Chrome, Safari
    },
  };

  const [ queue, setQueue ] = useState( [] );
  const [ themeName ] = useAtom( themeAtom );
  const activeTheme = theme.colors[ themeName ] || theme.colors.black;

  const isSidebar = useBreakpointValue( { base: false, md: true } ); // Sidebar for md+, row for base

  useEffect( () =>
  {
    const fetchData = async () =>
    {
      try {
        // Fetch queue items
        const queueItems = await getQueueItems(
          client_id,
          client_secret,
          refresh_token
        );
        setQueue( queueItems );
      } catch( error ) {
        console.error( "Error fetching Spotify data:", error );
      }
    };

    fetchData();
  }, [ client_id, client_secret, refresh_token ] );

  return (
    <Flex
      direction={isSidebar ? "column" : "row"}
      width={isSidebar ? "150px" : "90vw"}
      height={isSidebar ? "768px" : "100px"}
      bgGradient={`linear(to-b, ${ activeTheme.accent }, ${ activeTheme.primary })`}
      alignItems="center"
      gap={4}
      py={{ base: 0, lg: 4 }} px={{ base: 4, lg: 0 }}
      borderRadius={{ base: '20px', lg: "20px" }}
    >
      {isSidebar && (
        <Text color={activeTheme.background} fontWeight="bold" mt={2} fontSize={{ base: '14px', lg: "16px" }}>
          Up Next
        </Text>
      )}
      {/* Up Next */}
      <Box flex="1" overflowY={isSidebar ? "scroll" : "hidden"}
        overflowX={!isSidebar ? "scroll" : "hidden"}
        style={{ ...hiddenScrollbarStyle, ...hiddenScrollbarWebkit }}>
        <Flex
          direction={isSidebar ? "column" : "row"}
          gap={isSidebar ? 4 : 2}
        >
          {queue.map( ( track, index ) => (
            <Flex
              key={track.id}
              direction={isSidebar ? "row" : "column"}
              alignItems="center"
              bg={index === 0 ? activeTheme.primary : activeTheme.secondary}
              borderRadius="10px"
              p={2}
              flexShrink={0}
              width={isSidebar ? "auto" : "auto"} // Row item width for mobile
            >
              <Image
                src={track.albumImageUrl}
                alt={track.title}
                boxSize={{ base: "50px", lg: "100px" }}
                borderRadius="10px"
              />
              {/* <Box>
                <Text
                  fontWeight="bold"
                  noOfLines={1}
                  color={
                    index === 0 ? activeTheme.background : activeTheme.primary
                  }
                >
                  {track.title}
                </Text>
                <Text
                  fontSize="sm"
                  color={
                    index === 0 ? activeTheme.accent : activeTheme.accent2
                  }
                  noOfLines={1}
                >
                  {track.artist}
                </Text>
              </Box> */}
            </Flex>
          ) )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default QueueDisplay;