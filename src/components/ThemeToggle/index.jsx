import React, { useState } from "react";
import { IconButton, Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useAtom } from "jotai";
import { themeAtom } from "../../atoms/theme";
import theme from "../../theme";

const ThemeToggle = () =>
{
  const [ themeName, setThemeName ] = useAtom( themeAtom );
  const themes = [ "black", "red", "blue", "orange", "green", "yellow", "pink", "purple", "white" ];
  const [ isAnimating, setIsAnimating ] = useState( false );

  const toggleTheme = () =>
  {
    setIsAnimating( true );
    setTimeout( () =>
    {
      const nextThemeIndex = ( themes.indexOf( themeName ) + 1 ) % themes.length;
      setThemeName( themes[ nextThemeIndex ] );
      setIsAnimating( false );
    }, 1000 ); // Matches animation duration
  };

  const hexToRgba = ( hex, opacity ) =>
  {
    const bigint = parseInt( hex.replace( "#", "" ), 16 );
    const r = ( bigint >> 16 ) & 255;
    const g = ( bigint >> 8 ) & 255;
    const b = bigint & 255;
    return `rgba(${ r }, ${ g }, ${ b }, ${ opacity })`;
  };

  const activeTheme = theme.colors[ themeName ] || theme.colors.white;
  const popEffect = keyframes`
    0% { transform: scale(1); box-shadow: 0 0 0 0 ${ hexToRgba( activeTheme.primary, 0.5 ) }; }
    80% { transform: scale(1.3); box-shadow: 0 0 0 8px ${ hexToRgba( activeTheme.primary, 0.5 ) }; }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
  `;

  return (
    <Box borderRadius="full">
      <IconButton
        aria-label="Toggle theme"
        borderRadius="50%"
        onClick={toggleTheme}
        bg="transparent"
        color={activeTheme.primary}
        border="12px solid"
        borderColor={activeTheme.primary}
        _hover={{}}
        _active={{}}
        _focus={{ boxShadow: "none" }}
        width={{ base: "44px", lg: "6.12em" }}
        height={{ base: "44px", lg: "6.12em" }}
        animation={isAnimating ? `${ popEffect } 1s ease` : "none"}
      />
    </Box>
  );
};

export default ThemeToggle;