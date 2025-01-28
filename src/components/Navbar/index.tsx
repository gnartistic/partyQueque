import { Box, Flex, Text } from "@chakra-ui/react";
import NavMobile from "./navMobile";
import NavDesktop from "./navDesktop";
import { useAtom } from "jotai";
import { themeAtom } from "@/atoms/theme";
import theme from "@/theme";

const Navbar = () => {
  const [themeName] = useAtom(themeAtom);
  const activeTheme = theme.colors[themeName] || theme.colors.black || {
    background: "#ffffff",
    primary: "#444",
  };

  return (
    <Box position="fixed" mt={2} top={0} left={0} right={0} bg="gray.800" zIndex={99}>
      <Flex justify="space-between" align="center" p={4} maxW="1400px" mx="auto">
          <Text className="app-name" color={activeTheme.primary} fontSize={{ base: "40px", lg: "68px" }}>
            VIBEIFY.AI
          </Text>
        <NavMobile />
        <NavDesktop />
      </Flex>
    </Box>
  );
};

export default Navbar;