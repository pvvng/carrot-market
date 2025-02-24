import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import ProfileEditForm from "@/components/profile-edit";

async function getUser() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: { id: session.id! },
    select: {
      avatar: true,
      email: true,
      id: true,
      phone: true,
      username: true,
    },
  });

  return user;
}

export type UserType = NonNullable<Prisma.PromiseReturnType<typeof getUser>>;

export default async function ProfileEdit() {
  const user = await getUser();

  if (!user) {
    return notFound();
  }

  return <ProfileEditForm user={user} />;
}
