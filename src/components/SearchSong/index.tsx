import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import axios from "axios";
import QueueButton from "@/components/QueueButton";
import { themeAtom } from "@/atoms/theme";
import { useAtom } from "jotai";
import theme from "@/theme";
import { Flex, Text, Input, Image } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import debounce from "lodash.debounce";
import { ProcessedTrack } from "@/atoms/queueAtom";

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const SEARCH_ENDPOINT = `https://api.spotify.com/v1/search`;

interface SearchSongProps {
    client_id: string;
    client_secret: string;
    refresh_token: string;
}

interface SpotifyCredentials {
    access_token: string;
}

interface Song {
    id: string;
    name: string;
    uri: string;
    album: {
        name: string; // Include 'name' property here
        images: { url: string }[]; // Existing 'images' property
    };
    artists: { name: string }[];
}

const getAccessToken = async (
    client_id: string,
    client_secret: string,
    refresh_token: string
): Promise<SpotifyCredentials> => {
    try {
        const basic = btoa(`${client_id}:${client_secret}`);
        const response = await fetch(TOKEN_ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: `Basic ${basic}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refresh_token,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch access token");
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching access token:", error);
        throw error;
    }
};

const SearchSong: React.FC<SearchSongProps> = ({
    client_id,
    client_secret,
    refresh_token,
}) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Song[]>([]);
    const [accessToken, setAccessToken] = useState<string>("");
    const [themeName] = useAtom(themeAtom);
    const activeTheme = theme.colors[themeName] || theme.colors.black;

    // Fetch Access Token
    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const { access_token } = await getAccessToken(
                    client_id,
                    client_secret,
                    refresh_token
                );
                setAccessToken(access_token);
            } catch (error) {
                console.error("Error fetching access token:", error);
            }
        };

        fetchAccessToken();
    }, [client_id, client_secret, refresh_token]);

    // Search Songs API Call
    const searchSongs = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await axios.get(SEARCH_ENDPOINT, {
                params: {
                    q: query.trim(),
                    type: "track",
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setSearchResults(response.data.tracks.items);
        } catch (error) {
            console.error("Error searching songs:", error);
        }
    };

    // Debounce the search function to reduce API calls
    const debouncedSearch = useCallback(
        debounce((query: string) => searchSongs(query), 500),
        [accessToken]
    );

    // Handle Input Changes
    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputText = event.target.value;
        setSearchQuery(inputText);

        // Call the debounced search function
        debouncedSearch(inputText);
    };

    // Convert `Song` to `ProcessedTrack`
    const convertToProcessedTrack = (song: Song): ProcessedTrack => ({
        id: song.id,
        title: song.name,
        artist: song.artists.map((artist) => artist.name).join(", "),
        album: song.album.name,
        albumImageUrl: song.album.images[0]?.url || "", // Fallback to empty string
        songUrl: song.uri,
    });

    return (
        <Flex className="songSearch" gap={{ base: 4, lg: 6 }}>
            <Flex
                flexDirection="row"
                height={{ base: "50px", lg: "70px" }}
                justifyContent="flex-start"
                alignItems="center"
                pl={4}
                py={2}
                width={{ base: "90vw", lg: "100%" }}
                borderRadius="20px"
                bg={activeTheme.accent}
            >
                <Search2Icon name="search-alt" color={activeTheme.background} />
                <Input
                    fontSize={{ base: "16px", lg: "20px" }}
                    color={activeTheme.background}
                    _focus={{ outline: "none", border: "none", boxShadow: "none" }}
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
            <Flex
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="center"
                overflowY="scroll"
                height={{ base: "450px", md: "580px", lg: "680px", xl: "477px" }}
                width={{ base: "90vw", lg: "100%" }}
                borderRadius="20px"
                bg={activeTheme.primary}
                mb={{ base: "120px", lg: "0px" }}
            >
                {searchResults.map((song) => {
                    const processedTrack = convertToProcessedTrack(song);
                    return (
                        <Flex
                            key={song.id}
                            justifyContent="space-between"
                            px={4}
                            py={6}
                            width="90%"
                        >
                            <Flex gap={4}>
                                <Image
                                    height={{ base: "75px", lg: "75px" }}
                                    src={song.album.images[0]?.url}
                                    alt={song.name}
                                />
                                <Flex
                                    justifyContent="flex-start"
                                    flexDirection="column"
                                    textAlign="left"
                                >
                                    <Text
                                        color={activeTheme.background}
                                        className="song"
                                        fontSize={{ base: "16px", lg: "18px" }}
                                    >
                                        {song.name}
                                    </Text>
                                    <Text
                                        color={activeTheme.background}
                                        className="artist"
                                        fontSize={{ base: "18px", lg: "20px" }}
                                    >
                                        {song.artists.map((artist) => artist.name).join(", ")}
                                    </Text>
                                </Flex>
                            </Flex>
                            <QueueButton
                                accessToken={accessToken}
                                client_id={client_id}
                                client_secret={client_secret}
                                refresh_token={refresh_token}
                                song={processedTrack}
                                songURI={song.uri}
                            />
                        </Flex>
                    );
                })}
            </Flex>
        </Flex>
    );
};

export default SearchSong;