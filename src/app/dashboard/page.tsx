import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  //get the login session
  const { getUser } = await getKindeServerSession();
  //get all the user properties
  const user = await getUser();

  // Make sure user is logged-in
  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  //Make sure user is synced to DB
  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });
  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  return <Dashboard />;
};

export default Page;
