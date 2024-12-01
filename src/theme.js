import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  useSystemColorMode: false ,
  colors: {
    // Red customTheme
    red: {
      background: "#fff5f5", // Soft red background
      primary: "#e53e3e",   // Primary red
      secondary: "#9b2c2c", // Dark red
      accent: "#f56565",    // Lighter red
    },
    // Blue customTheme
    blue: {
      background: "#ebf8ff", // Soft blue background
      primary: "#3182ce",    // Primary blue
      secondary: "#2b6cb0",  // Dark blue
      accent: "#63b3ed",     // Lighter blue
    },
    // Orange customTheme
    orange: {
      background: "#fffaf0", // Soft orange background
      primary: "#dd6b20",    // Primary orange
      secondary: "#c05621",  // Dark orange
      accent: "#ed8936",     // Lighter orange
    },
    // Pink customTheme
    pink: {
      background: "#fff5f7", // Soft pink background
      primary: "#d53f8c",    // Primary pink
      secondary: "#97266d",  // Dark pink
      accent: "#ed64a6",     // Lighter pink
    },
    // Purple customTheme
    purple: {
      background: "#faf5ff", // Soft purple background
      primary: "#805ad5",    // Primary purple
      secondary: "#6b46c1",  // Dark purple
      accent: "#9f7aea",     // Lighter purple
    },
    // Green customTheme
    green: {
      background: "#f0fff4", // Soft green background
      primary: "#38a169",    // Primary green
      secondary: "#2f855a",  // Dark green
      accent: "#68d391",     // Lighter green
    },
    // Yellow customTheme
    yellow: {
      background: "#fffff0", // Soft yellow background
      primary: "#d69e2e",    // Primary yellow
      secondary: "#b7791f",  // Dark yellow
      accent: "#ecc94b",     // Lighter yellow
    },
    // Black customTheme
    black: {
      background: "#000000", // Dark gray background
      primary: "#B0B8BF",    // White text
      secondary: "#2d3748",  // Gray
      accent: "#F4F5F6",     // Lighter gray
    },
    // White customTheme
    white: {
      background: "#ffffff", // White background
      primary: "#1a202c",    // Black text
      secondary: "#718096",  // Gray
      accent: "#444444",     // Lighter gray
    },
  },
});

export default customTheme;
