import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider as JotaiProvider, useAtom } from "jotai";
import theme from "./theme";
import { themeAtom } from "./atoms/theme";

const ThemedApp = () => {
  const [themeName] = useAtom(themeAtom); // Get the current theme
  const activeTheme = { ...theme, colors: theme.colors[themeName] }; // Use selected theme colors

  return (
    <ChakraProvider theme={activeTheme}>
      <App />
    </ChakraProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <JotaiProvider>
      <ThemedApp />
    </JotaiProvider>
  </React.StrictMode>
);

reportWebVitals();
