import queryString from "query-string";

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

// Define the types for the access token and the song data
interface SpotifyAccessTokenResponse {
    access_token: string;
}

interface SpotifySong {
    album: {
        name: string;
        images: { url: string }[];
    };
    artists: { name: string }[];
    external_urls: { spotify: string };
    name: string;
}

interface SpotifyCurrentlyPlayingResponse {
    is_playing: boolean;
    item: SpotifySong;
}

// Type for the return value of getNowPlayingItem
interface NowPlayingItem {
    album: string;
    albumImageUrl: string;
    artist: string;
    isPlaying: boolean;
    songUrl: string;
    title: string;
}

// Type definitions for the function parameters
type SpotifyCredentials = {
    client_id: string;
    client_secret: string;
    refresh_token: string;
};

// Function to get access token
const getAccessToken = async ({
    client_id,
    client_secret,
    refresh_token,
}: SpotifyCredentials): Promise<SpotifyAccessTokenResponse> => {
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
        throw new Error("Failed to fetch access token");
    }

    return response.json();
};

// Function to get the currently playing song
export const getNowPlaying = async ({
    client_id,
    client_secret,
    refresh_token,
}: SpotifyCredentials): Promise<Response> => {
    const { access_token } = await getAccessToken({
        client_id,
        client_secret,
        refresh_token,
    });

    return fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};

// Main function to get now-playing item
export default async function getNowPlayingItem({
    client_id,
    client_secret,
    refresh_token,
}: SpotifyCredentials): Promise<NowPlayingItem | false> {
    const response = await getNowPlaying({ client_id, client_secret, refresh_token });

    if (response.status === 204 || response.status > 400) {
        return false;
    }

    const song: SpotifyCurrentlyPlayingResponse = await response.json();

    return {
        album: song.item.album.name,
        albumImageUrl: song.item.album.images[0]?.url ?? "",
        artist: song.item.artists.map((artist) => artist.name).join(", "),
        isPlaying: song.is_playing,
        songUrl: song.item.external_urls.spotify,
        title: song.item.name,
    };
}