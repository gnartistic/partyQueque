import React, { useState } from "react";
import { Box, Flex, IconButton, Link } from "@chakra-ui/react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the hamburger menu state when clicked
  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <Box position="relative">
      {/* Button to open the hamburger menu */}
      <MotionIconButton
        aria-label="Open Menu"
        icon={isOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        onClick={toggleMenu}
        display={{ base: "block", lg: "block" }} // Always visible on mobile and desktop
        position="absolute"
        top="20px"
        left="20px"
        zIndex={20}
        // transition="transform 0.3s ease-in-out, opacity 0.3s ease-in-out"
        transform={isOpen ? "scale(1.1)" : "scale(1)"} // Scale effect on button click
        opacity={isOpen ? 0.8 : 1} // Fade effect for button
        animate={{
          scale: isOpen ? 1.1 : 1,
          opacity: isOpen ? 0.8 : 1,
        }}
      />

      {/* The hamburger menu itself */}
      <MotionBox
        display={isOpen ? "block" : "none"}
        position="fixed"
        top="0"
        left={isOpen ? "0" : "-100%"} // Sidebar animation (off-screen initially)
        width="250px" // Width of the sidebar
        height="100vh"
        bg="rgba(0, 0, 0, 0.8)"
        zIndex={10}
        paddingTop="50px" // Push the content down to avoid overlap with the header
        // transition="left 0.3s ease-in-out" // Sliding effect for the menu
        initial={{ left: "-100%" }} // Initially position the menu off-screen
        animate={{ left: isOpen ? "0" : "-100%" }} // Slide in/out animation
        exit={{ left: "-100%" }} // Exit animation for when the menu closes
      >
        {/* Menu Links */}
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          transform="translateY(50px)" // Move down slightly before the animation starts
          // animate={{
          //   opacity: isOpen ? 1 : 0,
          //   translateY: isOpen ? "0px" : "-20px",
          // }}
          // transition={{ duration: 0.3 }}
        >
          {["Home", "About", "Services", "Contact"].map((item, index) => (
            <MotionBox
              key={item}
              textAlign="center"
              mt={4}
              initial={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: isOpen ? 1 : 0, translateY: isOpen ? 0 : -20 }}
              transition={{ delay: index * 0.2, duration: 0.3 }}
            >
              <Link
                href={`/${item.toLowerCase()}`}
                color="white"
                fontSize="xl"
                fontWeight="bold"
                onClick={toggleMenu}
              >
                {item}
              </Link>
            </MotionBox>
          ))}
        </Flex>
      </MotionBox>
    </Box>
  );
};

export default HamburgerMenu;