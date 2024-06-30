import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  //get the login session
  const { getUser } = await getKindeServerSession();
  //get all the user properties
  const user = await getUser();

  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  return <div>{user?.email}</div>;
};

export default Page;
