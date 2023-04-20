import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, createTRPCProxyClient } from "@trpc/client";
import { useState } from "react";
import { Login } from "./components/Login";
import { AppRouter } from "../../server";
import { trpc } from "./utils/trpc";
import React from "react";

export type User = {
  name: string;
  email: string;
  auth: boolean;
};

const backendURL = "http://localhost:4001";
// const backendURL = "https://capb.hop.sh";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: backendURL,
    }),
  ],
});

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: backendURL,
        }),
      ],
    })
  );

  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    auth: false,
  });

  if (!user.auth) {
    return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <div className="h-screen bg-[#f7f7f7]">
            <Login setUser={setUser} />
          </div>
        </QueryClientProvider>
      </trpc.Provider>
    );
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <h1>Hello, You are Logged in</h1>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
