import { IncomingMessage, ServerResponse } from "http";

const getSpotifyCredentials = (req: IncomingMessage, res: ServerResponse): void => {
    try {
        // Retrieve the token from the request headers
        const token = req.headers.authorization;

        // Check if the token is present and valid
        if (token && token === `Bearer ${process.env.AUTH_TOKEN}`) {
            // Send the Spotify credentials
            const response = JSON.stringify({
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET,
                refresh_token: process.env.REFRESH_TOKEN,
            });

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(response);
        } else {
            // Unauthorized access
            const errorResponse = JSON.stringify({ error: "Unauthorized" });
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(errorResponse);
        }
    } catch (error) {
        console.error(error);
        const errorResponse = JSON.stringify({ error: "An internal server error occurred" });
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(errorResponse);
    }
};

export default getSpotifyCredentials;
