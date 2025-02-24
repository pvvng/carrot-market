"use client";

import { Reviews } from "@/app/(tabs)/profile/review/send/page";
import { FaceFrownIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function ReviewList({ reviews }: { reviews: Reviews }) {
  const [reviewState, setReviewState] = useState(1);

  const goodRatingReviewsCount = reviews.filter(
    (review) => review.rating === 1
  ).length;

  const badRatingReviewsCount = reviews.filter(
    (review) => review.rating === -1
  ).length;

  const toggleReviewState = () => {
    if (reviewState === 1) {
      setReviewState(-1);
    }
    if (reviewState === -1) {
      setReviewState(1);
    }
  };

  const replacePayload = (rating: number) => {
    if (rating === -1) return "별로에요.";
    else return "좋아요!";
  };

  return (
    <div className="p-5 flex flex-col gap-3">
      <div
        className="bg-black w-full grid grid-cols-2 text-center rounded-md cursor-pointer 
    *:p-2 *:rounded-md *:transition-colors *:flex *:gap-2 *:items-center *:justify-center *:font-semibold"
      >
        <div
          className={reviewState === 1 ? "bg-orange-500" : ""}
          onClick={toggleReviewState}
        >
          <FaceSmileIcon className="size-6" />
          <p>좋아요! ({goodRatingReviewsCount})</p>
        </div>
        <div
          className={reviewState === -1 ? "bg-orange-500" : ""}
          onClick={toggleReviewState}
        >
          <FaceFrownIcon className="size-6" />
          <p>별로에요 ({badRatingReviewsCount})</p>
        </div>
      </div>
      {reviews
        .filter((v) => v.rating === reviewState)
        .map((review) => (
          <div
            key={review.id}
            className="relative bg-neutral-200 rounded-md text-black p-2 text-center"
          >
            <p>
              {review.payload ? review.payload : replacePayload(review.rating)}
            </p>
            <div className="absolute -left-2 bottom-1/3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-neutral-200" />
          </div>
        ))}
    </div>
  );
}
