import HeartedProductList from "@/components/hearted-product-list";
import { PAGE_DATA_COUNT } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";

async function getHearts(userId: number) {
  const hearts = await db.heart.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          photo: true,
          price: true,
          title: true,
          created_at: true,
          sold_out: true,
          _count: {
            select: { heart: true },
          },
        },
      },
    },
    take: PAGE_DATA_COUNT,
    orderBy: [{ created_at: "desc" }],
  });

  return hearts;
}

export type HeartsType = Prisma.PromiseReturnType<typeof getHearts>;

export default async function Hearts() {
  const session = await getSession();
  const hearts = await getHearts(session.id!);

  return <HeartedProductList initialProducts={hearts} />;
}
