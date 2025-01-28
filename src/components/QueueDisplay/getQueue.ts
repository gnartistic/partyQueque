import queryString from "query-string";
import { queueAtom } from "@/atoms/queueAtom";
import { SetStateAction } from "jotai";

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const QUEUE_ENDPOINT = `https://api.spotify.com/v1/me/player/queue`;

// Type definitions
interface SpotifyTrack {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
    external_urls: {
        spotify: string;
    };
}

interface SpotifyQueueResponse {
    queue: SpotifyTrack[];
}

interface AccessTokenResponse {
    access_token: string;
}

const getAccessToken = async (
    client_id: string,
    client_secret: string,
    refresh_token: string
): Promise<AccessTokenResponse> => {
    const basic = btoa(`${client_id}:${client_secret}`);

    const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Basic ${basic}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: queryString.stringify({
            grant_type: "refresh_token",
            refresh_token,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to fetch access token: ${error.error}`);
    }

    return response.json();
};

export const fetchQueue = async (
    client_id: string,
    client_secret: string,
    refresh_token: string
): Promise<SpotifyQueueResponse> => {
    const { access_token } = await getAccessToken(
        client_id,
        client_secret,
        refresh_token
    );

    const response = await fetch(QUEUE_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Queue API Error:", errorData);
        throw new Error("Failed to fetch queue items");
    }

    return response.json();
};

interface ProcessedTrack {
    id: string;
    title: string;
    artist: string;
    album: string;
    albumImageUrl: string;
    songUrl: string;
}

export default async function getQueueItems(
    client_id: string,
    client_secret: string,
    refresh_token: string,
    setQueue: (value: SetStateAction<ProcessedTrack[]>) => void // Pass `setQueue` function to update the atom
): Promise<ProcessedTrack[]> {
    try {
        const queueData = await fetchQueue(client_id, client_secret, refresh_token);

        // If the queue is empty, clear the atom
        if (!queueData.queue || queueData.queue.length === 0) {
            setQueue([]); // Update queueAtom with an empty array
            return [];
        }

        // Process the queue data
        const processedQueue: ProcessedTrack[] = queueData.queue.map((track) => ({
            id: track.id,
            title: track.name,
            artist: track.artists.map((artist) => artist.name).join(", "),
            album: track.album.name,
            albumImageUrl: track.album.images[0]?.url || "",
            songUrl: track.external_urls.spotify,
        }));

        // Update the queueAtom with the processed queue
        setQueue(processedQueue);

        return processedQueue;
    } catch (error) {
        console.error("Error fetching queue items:", error);
        throw error;
    }
}