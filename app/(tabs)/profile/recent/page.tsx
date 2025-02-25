import RecentProductList from "@/components/recent-product-list";
import { PAGE_DATA_COUNT } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";

async function getRecents(userId: number) {
  const recents = await db.recent.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          title: true,
          price: true,
          created_at: true,
          photo: true,
          id: true,
          sold_out: true,
          _count: {
            select: { heart: true },
          },
        },
      },
    },
    take: PAGE_DATA_COUNT,
    orderBy: [{ updated_at: "desc" }],
  });

  return recents;
}

export type RecentsType = Prisma.PromiseReturnType<typeof getRecents>;

export default async function Recent() {
  const session = await getSession();
  const recents = await getRecents(session.id!);
  return <RecentProductList initialProducts={recents} />;
}
