import ReviewList from "@/components/review-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";

async function getSendReviews() {
  const session = await getSession();

  const sendReviews = await db.review.findMany({
    where: { senderId: session.id! },
    select: {
      id: true,
      rating: true,
      payload: true,
      created_at: true,
      product: { select: { title: true } },
    },
  });

  return sendReviews;
}

export type Reviews = Prisma.PromiseReturnType<typeof getSendReviews>;

export default async function GivenReviews() {
  const reviews = await getSendReviews();

  return <ReviewList reviews={reviews} />;
}
