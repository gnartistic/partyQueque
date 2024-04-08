module.exports = (req, res) => {
    try {
        // Retrieve the token from the request headers
        const token = req.headers.authorization;

        // Check if the token is present and valid
        if (token && token === `Bearer ${process.env.AUTH_TOKEN}`) {
            // Send the Spotify credentials
            res.status(200).json({
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET,
                refresh_token: process.env.REFRESH_TOKEN
            });
        } else {
            // Unauthorized access
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};


