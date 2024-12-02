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
import { Flex, Box } from "@chakra-ui/react";
import QueueDisplay from "./components/QueueDisplay";

function App ()
{
  const [ spotifyCredentials, setSpotifyCredentials ] = useState( null );
  const [ themeName ] = useAtom( themeAtom );
  const activeTheme = theme.colors[ themeName ] || theme.colors.black || {
    background: "#ffffff",
    primary: "#444",
  };

  useEffect( () =>
  {
    const fetchSpotifyCredentials = async () =>
    {
      try {
        const authToken = "xS3adzX3byAGXiEzpw";
        const headers = new Headers( {
          Authorization: `Bearer ${ authToken }`,
        } );
        const response = await fetch( "/api/spotify-auth", { headers } );
        if( !response.ok ) {
          throw new Error( "Failed to fetch Spotify credentials" );
        }
        const data = await response.json();
        setSpotifyCredentials( data );
      } catch( error ) {
        console.error( error );
      }
    };

    fetchSpotifyCredentials();
  }, [] );

  return (
    <Flex
      height={{base: "100vh", lg: "100vh"}}
      width="100vw"
      overflowY="scroll"
      gap={{base: 4, lg: 10}}
      flexDirection={{base: "column-reverse", lg: "row"}}
      justifyContent={{base: 'flex-start', lg: "center"}}
      alignItems={{base: "center", lg: "flex-start"}}
        style={{
          backgroundColor: activeTheme.background,
          color: activeTheme.primary,
          transition: "background-color 0.5s ease, color 0.5s ease",
        }}>
      <Flex
        mt={{base: 0, lg: 8}}
        gap={6}
        width="auto"
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
      {/* Positioning the ThemeToggle button */}
      <Flex mt={8} alignItems="center" flexDirection={{base: "column", lg: 'column'}} gap={{base: 4, lg: 10}}>
        <ThemeToggle />
        {spotifyCredentials ? (
          <QueueDisplay
            client_id={spotifyCredentials.client_id}
            client_secret={spotifyCredentials.client_secret}
            refresh_token={spotifyCredentials.refresh_token}
          />
        ) : (
          <p>Loading...</p> // Or any other placeholder while credentials are being fetched
        )}

      </Flex>
    </Flex>
  );
}

export default App;