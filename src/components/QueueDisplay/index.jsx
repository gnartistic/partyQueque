import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Image, useBreakpointValue } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { themeAtom } from "../../atoms/theme";
import theme from "../../theme";
import { queueAtom } from "../../atoms/queueAtom";
import getQueueItems from "./getQueue.js";

const QueueDisplay = ( { client_id, client_secret, refresh_token } ) =>
{
  const hiddenScrollbarStyle = {
    scrollbarWidth: "none", // For Firefox
    msOverflowStyle: "none", // For Internet Explorer and Edge
    overflowY: "scroll",
  };

  const [ themeName ] = useAtom( themeAtom );
  const [ queue, setQueue ] = useAtom( queueAtom );
  const activeTheme = theme.colors[ themeName ] || theme.colors.black;

  const isSidebar = useBreakpointValue( { base: false, xl: true } ); // Sidebar for md+, row for base

  useEffect( () =>
  {
    const updateQueue = async () =>
    {
      try {
        await getQueueItems( client_id, client_secret, refresh_token, setQueue );
      } catch( error ) {
        console.error( "Error updating queue:", error );
      }
    };

    // Periodically update the queue every 5 seconds
    const interval = setInterval( updateQueue, 5000 );

    return () => clearInterval( interval ); // Cleanup interval
  }, [ client_id, client_secret, refresh_token, setQueue ] );

  return (
    <Flex
      mt={{ base: -4, lg: 0 }}
      direction={isSidebar ? "column" : "row"}
      width={{base: "90vw", xl: "150px"}}
      height={isSidebar ? "753px" : "100px"}
      bgGradient={{ base: "none", xl: `linear(to-b, ${ activeTheme.accent }, ${ activeTheme.primary })` }}
      alignItems="center"
      gap={2}
      py={{ base: 0, lg: 4 }}
      borderRadius={{ base: '20px', lg: "20px" }}
      borderTopRadius={{ base: "0px", lg: "20px" }}
      style={{ ...hiddenScrollbarStyle }}
    >
      {isSidebar && (
        <Text color={activeTheme.background} fontWeight="bold" fontSize={{ base: '14px', lg: "16px" }}>
          Up Next
        </Text>
      )}
      {/* Up Next */}
      <Box flex="1" overflowY={isSidebar ? "scroll" : "hidden"}
        overflowX={!isSidebar ? "scroll" : "hidden"}
        style={{ ...hiddenScrollbarStyle }}>
        <Flex
          direction={isSidebar ? "column" : "row"}
          gap={isSidebar ? 3 : 2}
        >
          {queue.map( ( track, index ) => (
            <Flex
              key={track.id}
              direction={isSidebar ? "row" : "column"}
              alignItems="center"
              bg={index === 0 ? activeTheme.background : activeTheme.secondary}
              borderRadius="10px"
              p={2}
              flexShrink={0}
              width={isSidebar ? "auto" : "auto"} // Row item width for mobile
            >
              <Image
                src={track.albumImageUrl}
                alt={track.title}
                boxSize={{ base: "50px", xl: "100px" }}
                borderRadius="10px"
              />
            </Flex>
          ) )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default QueueDisplay;