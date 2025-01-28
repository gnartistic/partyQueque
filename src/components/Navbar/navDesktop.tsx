import { Box, Flex, Link, Button, useBreakpointValue } from "@chakra-ui/react";
import { useRoutes } from "./routes";
import { useAtom } from "jotai";
import { themeAtom } from "@/atoms/theme";
import theme from "@/theme";
import ThemeToggle from "@/components/ThemeToggle";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

const NavDesktop = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { data: session } = useSession();
  const routes = useRoutes();
  const router = useRouter();

  const [themeName] = useAtom(themeAtom);
  const activeTheme = theme.colors[themeName] || theme.colors.black || {
    background: "#ffffff",
    primary: "#444",
  };

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/", // Redirect to home after logout
      redirect: true,
    });
  };

  const handleLogin = async () => {
    console.log("redirecting to login");
    await router.push("/api/auth/signin");
  };

  return (
    <>
      {!isMobile && (
        <Flex alignItems="center" gap={8} justifyContent="space-between">
          {/* Dynamic Routes */}
          <Flex gap={5} textStyle="sm">
            {routes.map(({ Icon, href, title }) => (
              <Box key={title}>
                <Link
                  href={href}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  fontFamily="AvenirLTPro"
                  fontSize={{ base: "18px", lg: "25px" }}
                  color={activeTheme.primary}
                  transition="all 0.3s ease"
                  px={4}
                  py={1}
                  fontWeight="600"
                  borderRadius="20px"
                  border={`2px solid ${activeTheme.primary}`}
                  _hover={{ bg: activeTheme.primary, color: activeTheme.background }}
                >
                  {title}
                </Link>
              </Box>
            ))}
            {/* Static Login/Logout Button */}
            {session ? (
              <Button
                display="flex"
                alignItems="center"
                fontFamily="AvenirLTPro"
                fontSize={{ base: "18px", lg: "25px" }}
                color={activeTheme.primary}
                transition="all 0.3s ease"
                px={4}
                py={1}
                fontWeight="600"
                borderRadius="20px"
                border={`2px solid ${activeTheme.primary}`}
                _hover={{ bg: activeTheme.primary, color: activeTheme.background }}
                onClick={handleSignOut}
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={handleLogin}
                display="flex"
                alignItems="center"
                fontFamily="AvenirLTPro"
                fontSize={{ base: "18px", lg: "25px" }}
                color={activeTheme.primary}
                transition="all 0.3s ease"
                px={4}
                py={1}
                fontWeight="600"
                borderRadius="20px"
                border={`2px solid ${activeTheme.primary}`}
                _hover={{ bg: activeTheme.primary, color: activeTheme.background }}
              >
                Login
              </Button>
            )}
          </Flex>


          <ThemeToggle />
        </Flex>
      )}
    </>
  );
};

export default NavDesktop;