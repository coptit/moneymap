import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, createTRPCProxyClient } from "@trpc/client";
import { useEffect, useState } from "react";
import { Login } from "./components/Login";
import { AppRouter } from "../../server";
import { trpc } from "./utils/trpc";
import React from "react";
import Header from "./components/Header";
import { Home } from "./components/Home";
import { Spending } from "./components/Spending";

export type User = {
  name: string;
  email: string;
  auth: boolean;
};

const backendURL = "http://localhost:4001";

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

  useEffect(() => {
    const userAlready = window.localStorage.getItem("user");

    if (userAlready != null) {
      const userAlreadySignUp: User = JSON.parse(userAlready);
      setUser({
        name: userAlreadySignUp.name,
        email: userAlreadySignUp.email,
        auth: userAlreadySignUp.auth,
      });
    }
  }, []);

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
        <Header />
        <div className="max-w-7xl h-full w-full mx-auto">
          <Home user={user} />
          <Spending user={user} />
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
