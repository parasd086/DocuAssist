import { AppRouter } from "@/trpc";
import { createTRPCReact } from "@trpc/react-query";

// This is going to be instance of trpc to our client
//we need to pass the type of our main router(where all our routes are written) in trpc as a generic into this function so it knows all the routes thus know what are the types of arguments/returns.
export const trpc = createTRPCReact<AppRouter>({});
