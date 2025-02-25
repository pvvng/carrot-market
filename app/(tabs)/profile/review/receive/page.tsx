import ReviewList from "@/components/review-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";

async function getRecievedReviews() {
  const session = await getSession();

  const receivedReviews = await db.review.findMany({
    where: { receiverId: session.id! },
    select: {
      id: true,
      rating: true,
      payload: true,
      created_at: true,
      sender: { select: { avatar: true, username: true } },
      product: { select: { title: true } },
    },
  });

  return receivedReviews;
}

export type Reviews = Prisma.PromiseReturnType<typeof getRecievedReviews>;

export default async function ReceivedReviews() {
  const reviews = await getRecievedReviews();

  return <ReviewList reviews={reviews} />;
}
