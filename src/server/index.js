const express = require("express");
const { createExpressMiddleware } = require("@trpc/server/adapters/express");
const { appRouter } = require("./routers/appRouter");
const { createContext } = require("./context");
const cors = require("cors"); // Add this line
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for all origins
app.use(cors()); // Add this line

// Middleware for tRPC
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Add the new Spotify credentials route
app.get("/spotify-credentials", (req, res) => {
  try {
    const token = req.headers.authorization;

    if (token && token === `Bearer ${process.env.AUTH_TOKEN}`) {
      res.status(200).json({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        refresh_token: process.env.REFRESH_TOKEN,
      });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/trpc`);
});
