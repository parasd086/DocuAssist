"use client";

//This is going to be simple component but its goint to make trpc work in our app

import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { httpBatchLink } from "@trpc/client";

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  //trpc is thin type safe wrapper around react-query
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          // This is where all the request from trpc are going to sent to
          url: `http://localhost:3000/api/trpc`,
        }),
      ],
    })
  );

  return (
    // We will use trpc throughout the app in any component that we want to use it in thats what this provider is for
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {/* This is to independently use react-query without trpc */}
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default Providers;
