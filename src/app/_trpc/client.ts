import { AppRouter } from "@/trpc";
import { createTRPCReact } from "@trpc/react-query";

// This is going to be instance of trpc
//we need to pass the type of our main router in trpc as a generic into this function
export const trpc = createTRPCReact<AppRouter>({});
