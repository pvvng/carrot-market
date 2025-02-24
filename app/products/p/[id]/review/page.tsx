import Button from "@/components/button";
import Input from "@/components/input";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import { FaceFrownIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

interface ProductReviewProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    select: {
      id: true,
      buyerId: true,
      buyerUser: {
        select: { username: true },
      },
      userId: true,
      user: {
        select: { username: true },
      },
      photo: true,
      title: true,
      price: true,
      created_at: true,
    },
  });

  return product;
}

const reviewSchema = z.object({
  rating: z.enum(["-1", "1"], {
    errorMap: () => ({
      message: "리뷰는 '좋음' 또는 '나쁨'만 입력할 수 있습니다.",
    }),
  }),
  payload: z.string({
    invalid_type_error: "잘못된 타입입니다.",
  }),
});

export default async function ProductReview({ params }: ProductReviewProps) {
  const id = Number((await params).id);
  const session = await getSession();

  if (isNaN(id)) notFound();

  if (!session || !session.id) notFound();

  const userId = session.id;
  const product = await getProduct(id);

  if (!product) notFound();

  if (!product.buyerId || !product.buyerUser) return notFound();

  if (product.buyerId !== userId && product.userId !== userId) notFound();

  const userPosition = getUserPosition(product.buyerId, product.userId, userId);
  if (!userPosition) notFound();

  const reviewAction = async (formdata: FormData) => {
    "use server";

    const data = {
      rating: formdata.get("rating"),
      payload: formdata.get("payload"),
    };

    const result = reviewSchema.safeParse(data);

    if (!result.success) {
      console.log(result.error.flatten().fieldErrors);
      return;
    }

    await db.review.create({
      data: {
        buyerId: product.buyerId!,
        sellerId: product.userId,
        productId: product.id,
        rating: parseInt(result.data.rating),
        payload: result.data.payload !== "" ? result.data.payload : null,
      },
    });

    return redirect("/profile");
  };

  return (
    <form action={reviewAction} className="p-5 flex flex-col gap-3">
      <div className="flex gap-5 bg-neutral-950 p-5 rounded-md">
        <div className="relative size-28 rounded-md overflow-hidden bg-gray-200">
          <Image
            src={`${product.photo}/smaller`}
            alt={product.title}
            fill
            sizes="112"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 *:text-white">
          <span className="text-lg">{product.title}</span>
          <span className="text-sm text-neutral-500">
            {formatToTimeAgo(product.created_at.toString())}
          </span>
          <span className="text-lg font-semibold">
            {formatToWon(product.price)}원
          </span>
        </div>
      </div>
      <div className="bg-neutral-950 p-5 rounded-md flex flex-col gap-5">
        <p className="font-semibold">
          🥕 {userPosition == "seller" ? "구매" : "판매"}자{" "}
          {userPosition == "seller"
            ? product.buyerUser.username
            : product.user.username}
          님과의 거래가 어땠는지 적어주세요!
        </p>
        <div className="flex gap-3 items-center justify-center *:w-full *:p-3 *:text-center *:rounded-md *:font-semibold">
          <label className="ring-2 ring-white has-[:checked]:ring-orange-500 has-[:checked]:text-orange-500">
            <Input
              type="radio"
              name="rating"
              value="-1"
              className="hidden"
              required
              defaultChecked
            />
            <div className="flex gap-2 items-center justify-center">
              <FaceSmileIcon className="size-6" />
              <p>좋아요!</p>
            </div>
          </label>
          <label className="ring-2 ring-white has-[:checked]:ring-orange-500 has-[:checked]:text-orange-500">
            <Input
              type="radio"
              name="rating"
              value="-1"
              className="hidden"
              required
            />
            <div className="flex gap-2 items-center justify-center">
              <FaceFrownIcon className="size-6" />
              <p>별로였어요</p>
            </div>
          </label>
        </div>
        <Input
          name="payload"
          autoComplete="off"
          placeholder="구체적인 리뷰를 작성해주세요!"
        />
        <Button text="리뷰 등록하기" />
      </div>
    </form>
  );
}

function getUserPosition(buyerId: number, sellerId: number, userId: number) {
  if (buyerId === userId) {
    return "buyer";
  }

  if (sellerId === userId) {
    return "seller";
  }

  return null;
}
