import queryString from "query-string";

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const QUEUE_ENDPOINT = `https://api.spotify.com/v1/me/player/queue`;

const getAccessToken = async (client_id, client_secret, refresh_token) => {
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

export const fetchQueue = async (client_id, client_secret, refresh_token) => {
    const { access_token } = await getAccessToken(
        client_id,
        client_secret,
        refresh_token
    );

    return fetch(QUEUE_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};

export default async function getQueueItems(client_id, client_secret, refresh_token) {
    const response = await fetchQueue(client_id, client_secret, refresh_token);

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Queue API Error:", errorData);
        throw new Error("Failed to fetch queue items");
    }

    const queueData = await response.json();

    if (!queueData.queue || queueData.queue.length === 0) {
        return [];
    }

    const processedQueue = queueData.queue.map((track) => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        album: track.album.name,
        albumImageUrl: track.album.images[0]?.url,
        songUrl: track.external_urls.spotify,
    }));
    return processedQueue;
}