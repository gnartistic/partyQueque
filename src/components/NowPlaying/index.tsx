import { useEffect, useState } from "react";
import getNowPlayingItem from "./nowPlaying";
import { themeAtom } from "@/atoms/theme";
import { useAtom } from "jotai";
import theme from "@/theme";
import { Box, Flex, Text, Image } from "@chakra-ui/react";

interface SpotifyPlayerProps {
    client_id: string;
    client_secret: string;
    refresh_token: string;
}

interface NowPlayingItem {
    album: string;
    albumImageUrl: string;
    artist: string;
    isPlaying: boolean;
    songUrl: string;
    title: string;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({
    client_id,
    client_secret,
    refresh_token,
}) => {
    const [nowPlaying, setNowPlaying] = useState<NowPlayingItem | null>(null);
    const [themeName] = useAtom(themeAtom);
    const activeTheme = theme.colors[themeName] || theme.colors.black;

    const fetchData = async () => {
        try {
            const result = await getNowPlayingItem({
                client_id,
                client_secret,
                refresh_token,
            });
            setNowPlaying(result === false ? null : result);
        } catch (error) {
            console.error("Error fetching now playing:", error);
        }
    };

    useEffect(() => {
        // Immediately fetch data when the component mounts
        fetchData();

        // Set up a timer to fetch data periodically after an initial load
        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [client_id, client_secret, refresh_token, fetchData]);

    return nowPlaying ? (
        <Flex
            height={{ base: "150px", lg: "300px" }}
            width={{ base: "90vw", lg: "100%" }}
            borderTopRadius="20px"
            alignItems={{ base: "flex-start", lg: "center" }}
            bgGradient={`linear(to-t, ${activeTheme.background}, ${activeTheme.primary})`}
        >
            <Flex
                flexDirection="row"
                alignItems="center"
                p={{ base: 4, lg: 4 }}
                justifyContent="center"
                px="20px"
                gap={{ base: 4, lg: 10 }}
                width="100%"
            >
                <Image
                    width={{ base: "80px", lg: "250px" }}
                    borderRadius="20px"
                    src={nowPlaying.albumImageUrl}
                    alt="album cover"
                />
                <Flex
                    justifyContent="center"
                    alignItems="flex-start"
                    width="75%"
                    flexDirection="column"
                >
                    <Text
                        fontWeight="500"
                        color={activeTheme.background}
                        textAlign="left"
                        fontSize={{ base: "14px", lg: "26px" }}
                        className="trackTitle"
                    >
                        {nowPlaying.title}
                    </Text>
                    <Text
                        fontWeight="600"
                        textAlign="left"
                        fontSize={{ base: "16px", lg: "28px" }}
                        color={activeTheme.background}
                        className="trackArtist"
                    >
                        {nowPlaying.artist}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    ) : (
        <Flex
            height={{ base: "120px", lg: "300px" }}
            width={{ base: "90vw", lg: "75vw" }}
            justifyContent="center"
            alignItems="center"
        >
            <Text
                color={activeTheme.primary}
                fontSize={{ base: "20px", lg: "52px" }}
                fontWeight={700}
            >
                Let me cook...
            </Text>
        </Flex>
    );
};

export default SpotifyPlayer;
