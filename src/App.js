import React, { useEffect, useState } from "react";
import NowPlaying from "./components/NowPlaying";
import SearchSong from "./components/SearchSong";
import CashAppSection from "./components/CashAppSection";
import "./App.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeToggle from "./components/ThemeToggle";
import { useAtom } from "jotai";
import { themeAtom } from "./atoms/theme";
import theme from "./theme";
import { Flex, Box, Text, useBreakpointValue } from "@chakra-ui/react";
import QueueDisplay from "./components/QueueDisplay";

function App ()
{
  const [ spotifyCredentials, setSpotifyCredentials ] = useState( null );
  const [ themeName ] = useAtom( themeAtom );
  const isMobile = useBreakpointValue( { base: true, xl: false } );
  const activeTheme = theme.colors[ themeName ] || theme.colors.black || {
    background: "#ffffff",
    primary: "#444",
  };

  useEffect(() => {
    const fetchSpotifyCredentials = async () => {
      try {
        const authToken = "xS3adzX3byAGXiEzpw"; // Replace with your actual token
        const headers = new Headers({
          Authorization: `Bearer ${authToken}`,
        });

        // Fetch credentials from the backend server
        const response = await fetch("http://localhost:4000/spotify-credentials", { headers });
        if (!response.ok) {
          throw new Error("Failed to fetch Spotify credentials");
        }
        const data = await response.json();
        setSpotifyCredentials(data);
      } catch (error) {
        console.error("Error fetching Spotify credentials:", error);
      }
    };

    fetchSpotifyCredentials();
  }, []);

  return (
    <Flex
      height={{ base: "100vh", lg: "100vh" }}
      width="100vw"
      gap={{ base: 4, lg: 0 }}
      flexDirection="column"
      justifyContent={{ base: 'flex-start', lg: "flex-start" }}
      alignItems={{ base: "center", lg: "flex-start" }}
      style={{
        backgroundColor: activeTheme.background,
        transition: "background-color 0.5s ease, color 0.5s ease",
      }}
      pb={{ base: 0, lg: 0 }}>
      <Flex width={{ base: '100vw', lg: "100vw" }} height={{ base: "auto", lg: "auto" }} justifyContent="center" alignItems="center">
        <Flex width="90vw" justifyContent="space-between" alignItems="center" height="80px">
          <Text className="app-name" color={activeTheme.primary} fontSize={{ base: "40px", lg: "68px" }}>
            VIBEIFY.AI
          </Text>
          {isMobile && (
            <ThemeToggle />
          )}
        </Flex>
      </Flex>
      <Flex pt={{base: 0, lg: 6}}
        height="100%"
        width="100vw"
        overflowY="scroll"
        gap={{ base: 4, lg: 8 }}
        flexDirection="row"
        justifyContent={{ base: 'center', lg: "center" }}
        alignItems={{ base: "flex-start", lg: "flex-start" }}>
        <Flex
          mt={{ base: 0, lg: 0 }}
          gap={{base:2 ,lg: 6}}
          width={{base: "auto", xl: "80vw"}}
          height="auto"
          minHeight="auto"
          flexDirection="column"
          justifyContent="center"
        >
          {/* Main Content */}
          {spotifyCredentials && (
            <NowPlaying
              client_id={spotifyCredentials.client_id}
              client_secret={spotifyCredentials.client_secret}
              refresh_token={spotifyCredentials.refresh_token}
            />
          )}
          {spotifyCredentials && isMobile && (
            <QueueDisplay
              client_id={spotifyCredentials.client_id}
              client_secret={spotifyCredentials.client_secret}
              refresh_token={spotifyCredentials.refresh_token}
            />
          )}
          {spotifyCredentials && (
            <SearchSong
              client_id={spotifyCredentials.client_id}
              client_secret={spotifyCredentials.client_secret}
              refresh_token={spotifyCredentials.refresh_token}
            />
          )}
          {/* <CashAppSection /> */}

          <ToastContainer autoClose={1500} hideProgressBar closeOnClick position="top-center" />
        </Flex>
        {spotifyCredentials && !isMobile && (
          <Flex flexDirection="column" alignItems="center" gap={8}>
            {!isMobile && (
              <ThemeToggle />
            )}
            <QueueDisplay
              client_id={spotifyCredentials.client_id}
              client_secret={spotifyCredentials.client_secret}
              refresh_token={spotifyCredentials.refresh_token}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

export default App;