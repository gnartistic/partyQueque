import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider, useAtom } from "jotai";
import theme from "../theme";
import { themeAtom } from "../atoms/theme";
import "@/styles/index.scss";
import React from "react";
import { api } from "@/utils/api";
import { type Session } from "next-auth";
import { type AppType } from "next/app";
import { SessionProvider } from "next-auth/react";

// Create the QueryClient instance
const queryClient = new QueryClient();

// Themed App Component
const ThemedApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName] = useAtom(themeAtom); // Get the current theme
  const activeTheme = { ...theme, colors: theme.colors[themeName] }; // Use selected theme colors

  return <ChakraProvider theme={activeTheme}>{children}</ChakraProvider>;
};

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps }: AppProps) => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <SessionProvider session={pageProps.session}>
            <ThemedApp>
              <Component {...pageProps} />
            </ThemedApp>
          </SessionProvider>
        </JotaiProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default api.withTRPC(MyApp);