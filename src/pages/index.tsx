import React, { useEffect, useState } from "react";
import NowPlaying from "@/components/NowPlaying";
import SearchSong from "@/components/SearchSong";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeToggle from "@/components/ThemeToggle";
import { useAtom } from "jotai";
import { themeAtom } from "@/atoms/theme";
import theme from "@/theme";
import { Flex, Button, Text, useBreakpointValue, Link } from "@chakra-ui/react";
import QueueDisplay from "@/components/QueueDisplay";
import Navbar from "@/components/Navbar";

interface SpotifyCredentials {
  client_id: string;
  client_secret: string;
  refresh_token: string;
}

const Home: React.FC = () => {
  const [spotifyCredentials, setSpotifyCredentials] = useState<SpotifyCredentials | null>(null);
  const [themeName] = useAtom(themeAtom);
  const isMobile = useBreakpointValue({ base: true, xl: false });
  const activeTheme = theme.colors[themeName] || theme.colors.black || {
    background: "#ffffff",
    primary: "#444",
  };

  return (
    <Flex
      height={{ base: "100vh", lg: "100vh" }}
      width="100vw"
      gap={{ base: 4, lg: 0 }}
      flexDirection="column"
      justifyContent={{ base: "flex-start", lg: "flex-start" }}
      alignItems={{ base: "center", lg: "flex-start" }}
      style={{
        backgroundColor: activeTheme.background,
        transition: "background-color 0.5s ease, color 0.5s ease",
      }}
      pb={{ base: 0, lg: 0 }}
    >
      <Flex width={{ base: "100vw", lg: "100vw" }} height={{ base: "auto", lg: "auto" }} justifyContent="center" alignItems="center">
        <Flex width="100%" justifyContent="space-between" alignItems="center" height="80px">
          {/* <Link href="/signup">
            <Button>Sign up</Button>
          </Link> */}
          <Navbar />
        </Flex>
      </Flex>
      <Flex
        pt={{ base: 0, lg: 6 }}
        height="100%"
        width="100vw"
        overflowY="scroll"
        gap={{ base: 4, lg: 8 }}
        flexDirection="row"
        justifyContent={{ base: "center", lg: "center" }}
        alignItems={{ base: "flex-start", lg: "flex-start" }}
      >
        <Flex
          mt={{ base: 0, lg: 0 }}
          gap={{ base: 2, lg: 6 }}
          width={{ base: "auto", xl: "80vw" }}
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
          <ToastContainer autoClose={1500} hideProgressBar closeOnClick position="top-center" />
        </Flex>
        <Flex flexDirection="column" alignItems="center" gap={8}>
          {spotifyCredentials && !isMobile && (
            <QueueDisplay
              client_id={spotifyCredentials.client_id}
              client_secret={spotifyCredentials.client_secret}
              refresh_token={spotifyCredentials.refresh_token}
            />
          )}

        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;