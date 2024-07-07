//endpoint for asking a question to a pdf file

import { db } from "@/db";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidators";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  //This is how to get access to POST req body
  const body = await req.json();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const userId = user?.id;

  if (!userId) return new Response("Unauthorized", { status: 401 });

  //body is of "any" type(anyone can make any req to this endpoint), however when below parsing is success, we always have our data i.e. fileId and message(else the route will automatically throw error ) so now we can freely work on the data knowing we have it.

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) return new Response("Not found", { status: 404 });
};
