import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const router = t.router;
//publicProcedure allows us to create API endpoint regardless of authentication
export const publicProcedure = t.procedure;
