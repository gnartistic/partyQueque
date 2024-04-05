const request = require('request');

module.exports = async (req, res) => {
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            res.status(200).json({ accessToken: body.access_token });
        } else {
            console.error('Error details:', error || body);
            res.status(500).json({
                error: 'Internal Server Error',
                details: error ? error.message : 'Unknown error',
                response: body || 'No response data'
            });
        }
    });
};
