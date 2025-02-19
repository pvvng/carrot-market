"use client";

import { dislikePost, likePost } from "@/app/posts/[id]/actions";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as SolidHandThumbUpIcon } from "@heroicons/react/24/solid";
import { startTransition, useOptimistic } from "react";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  /**
   * 첫번째 인자 - mutation이 발생하기 전 initial data
   * 두번째 인자 - 이전 상태를 조작할 콜백 함수
   */
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (prevState, _) => ({
      isLiked: !prevState.isLiked,
      likeCount: prevState.isLiked
        ? prevState.likeCount - 1
        : prevState.likeCount + 1,
    })
  );

  const onClick = async () => {
    // useOptimistic을 통해 서버의 결과가 결정되기 전 먼저 결과를 ui에 보여준다
    startTransition(() => {
      reducerFn(null);
    });

    // 먼저 결과를 보여준 후 실제 서버가 동작한다.
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-sm border border-neutral-400 rounded-full p-2 transition-colors 
      ${
        state.isLiked
          ? "bg-orange-500 text-white border-orange-500 hover:border-orange-400 hover:bg-orange-400"
          : "text-neutral-400 hover:bg-neutral-800 hover:border-neutral-400"
      }`}
    >
      {state.isLiked ? (
        <SolidHandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      {state.isLiked ? (
        <span>{state.likeCount}</span>
      ) : (
        <span>공감하기 ({state.likeCount})</span>
      )}
    </button>
  );
}
