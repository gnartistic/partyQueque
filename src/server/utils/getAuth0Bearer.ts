import { env } from "@/env.mjs";

const AUTH0URL = env.AUTH0URL; // e.g., "https://dev-yourtenant.us.auth0.com/oauth/token"
const AUTH0CLIENTID = env.AUTH0CLIENTID;
const AUTH0SECRET = env.AUTH0SECRET;
const AUTH0AUDIENCE = env.AUTH0AUDIENCE;

interface Auth0Response {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export const getAuth0Bearer = async (): Promise<string> => {
  const url = AUTH0URL;

  const body = JSON.stringify({
    client_id: AUTH0CLIENTID,
    client_secret: AUTH0SECRET,
    audience: AUTH0AUDIENCE,
    grant_type: "client_credentials",
  });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Log the error response for debugging
      const errorText = await response.text();
      console.error("Failed to fetch Auth0 token:", errorText);
      throw new Error(`Auth0 token fetch failed with status ${response.status}`);
    }

    const data = (await response.json()) as Auth0Response;

    if (!data.access_token) {
      throw new Error("No access token returned from Auth0");
    }

    return data.access_token;
  } catch (error) {
    console.error("Error fetching Auth0 token:", error);
    throw new Error("Error fetching Auth0 token");
  }
};
