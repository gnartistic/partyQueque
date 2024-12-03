import { createTRPCReact } from "@trpc/react-query";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

export const trpc = createTRPCReact();

export const trpcClient = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc", // Ensure this matches your backend URL
    }),
  ],
});