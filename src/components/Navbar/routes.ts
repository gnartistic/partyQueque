import { useSession } from "next-auth/react";
import { FaHome, FaMusic, FaUsers, FaSignInAlt, FaUserPlus, FaSearch } from "react-icons/fa";

// Define the routes based on whether the user is logged in or not
export const useRoutes = () => {
  const { data: session } = useSession();
  

  // Routes visible when logged in
  const loggedInRoutes = [
    { Icon: FaHome, href: "/", title: "Home" }, // Home page
    { Icon: FaMusic, href: "/partysessions", title: "Party Sessions" }, // Party session management page
    { Icon: FaUsers, href: "/account", title: "My Account" }, // User's account page (linked Spotify, saved songs)
  ];

  // Routes visible when logged out
  const loggedOutRoutes = [
    { Icon: FaHome, href: "/", title: "Home" }, // Home page
    { Icon: FaUserPlus, href: "/signup", title: "Sign Up" }, // Sign-up page
  ];

  // Return routes based on the session
  return session ? loggedInRoutes : loggedOutRoutes;
};