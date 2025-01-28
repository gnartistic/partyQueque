import { type NextApiRequest, type NextApiResponse } from "next";

export default function logout(req: NextApiRequest, res: NextApiResponse) {
  const issuer = process.env.AUTH0_ISSUER;
  const clientId = process.env.AUTH0_CLIENT_ID;
  //TODO:(Charles ignore) replace with the URL of your app when set
  const returnUrl = process.env.NEXTAUTH_URL ?? "http://google.com";

  const auth0LogoutUrl = `${issuer}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(returnUrl)}`;
  res.redirect(auth0LogoutUrl);
  res.end();
}