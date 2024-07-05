import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError, initTRPC } from "@trpc/server";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});

export const router = t.router;
//publicProcedure allows us to create API endpoint regardless of authentication
export const publicProcedure = t.procedure;
//Whenever somebdoy call privateProc.. make sure to run isAuth beforehand
export const privateProcedure = t.procedure.use(isAuth);
