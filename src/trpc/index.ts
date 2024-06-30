import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";

// All API logic will be here
export const appRouter = router({
  //publicProcedure.query mainly for GET
  //publicProcedure.mutation mainly for mutation
  authCallback: publicProcedure.query(async () => {
    const { getUser } = await getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id || !user.email)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    // check if the user is in the database

    return { success: true };
  }),
});

// This knows which API routes exists and also which data they return
export type AppRouter = typeof appRouter;
