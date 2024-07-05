//Only purpose of this page is sync logged-in user and make sure they also exist in DB
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";

const Page = () => {
  const router = useRouter(); //allow us to do programmatic navigation

  const searchParams = useSearchParams(); //is a Client Component hook that lets you read the current URL's query string.
  const origin = searchParams.get("origin"); //origin=dashboard

  //If authCallback would have been mutation we would had used useMutation
  // First arg inside useQuery is data we expect ex POST body
  const { data, error } = trpc.authCallback.useQuery(undefined, {
    retry: true,
    retryDelay: 500, //every half a sec we are checking if user is sync with DB
  });

  useEffect(() => {
    if (error) {
      if (error.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    } else if (data && data.success) {
      router.push(origin ? `/${origin}` : "/dashboard");
    }
  }, [router, error, data, origin]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

const SuspensePage = () => {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
};

export default SuspensePage;
