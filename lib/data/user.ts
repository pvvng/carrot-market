import { unstable_cache as nextCache } from "next/cache";
import db from "../db";
import { Prisma } from "@prisma/client";

export const getCachedUser = nextCache(getUser, ["user"], {
  tags: ["#user"],
});

export async function getUser(userId: number) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { avatar: true, username: true, id: true },
  });

  return user;
}

export type UserType = NonNullable<Prisma.PromiseReturnType<typeof getUser>>;
