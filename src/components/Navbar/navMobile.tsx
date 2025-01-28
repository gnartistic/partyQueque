import { useClickAway } from "react-use";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, IconButton, Link, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useRoutes } from "./routes";
import { useAtom } from "jotai";
import { themeAtom } from "@/atoms/theme";
import theme from "@/theme";

const NavMobile = () => {
  const [isOpen, setOpen] = useState(false);
  const ref = useRef(null);
  const isMobile = useBreakpointValue({ base: true, md: false })
  const routes = useRoutes();

  const [themeName] = useAtom(themeAtom);
  const activeTheme = theme.colors[themeName] || theme.colors.black || {
    background: "#ffffff",
    primary: "#444",
  };

  // Close menu when clicking outside
  useClickAway(ref, () => setOpen(false));

  return (
    <Box ref={ref} className="lg:hidden">
      {/* Button to open/close the menu */}
      {isMobile && (
        <IconButton
          aria-label="Toggle Navigation"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={() => setOpen((prev) => !prev)}
          _hover={{}}
          size="lg"
          color={activeTheme.primary}
          position="absolute"
          top={4}
          right={4}
          zIndex={20}
        />
      )}

      {/* Menu items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 top-[3.5rem] right-0 p-5 bg-neutral-950 border-b border-b-white/20"
          >
            <Box>
              <Flex direction="column" align="center" gap={4}>
                {routes.map((route, idx) => {
                  const { Icon, href, title } = route;

                  return (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.1 + idx / 10,
                      }}
                      key={title}
                    >
                      <Link
                        onClick={() => setOpen(false)}
                        href={href}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        w="full"
                        p={5}
                        color={activeTheme.primary}
                        borderRadius="xl"
                        _hover={{ background: "gray.700", color: activeTheme.secondary }}
                      >
                        <Flex gap={1}>{title}</Flex>
                        <Icon />
                      </Link>
                    </motion.div>
                  );
                })}
              </Flex>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default NavMobile;