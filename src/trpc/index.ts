import { router } from "./trpc";

// All API logic will be here
export const appRouter = router({});

// This knows which API routes exists and also which data they return
export type AppRouter = typeof appRouter;
