"use client";

import { addComment } from "@/app/posts/[id]/actions";
import { Comments } from "@/lib/data/post-comments";
import { formatToTimeAgo } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import {
  startTransition,
  useEffect,
  useOptimistic,
  useRef,
  useState,
} from "react";

interface AddCommentProps {
  comments: Comments[];
  user: {
    id: number;
    username: string;
    avatar: string | null;
  };
  postId: number;
}

export default function AddComment({
  comments,
  user,
  postId,
}: AddCommentProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [state, reducerFn] = useOptimistic(
    comments,
    (prevState, payload: string) => {
      const lastComment = prevState[prevState.length - 1];
      const lastIndex = lastComment ? lastComment.id : 0;
      const newComment: Comments = {
        id: lastIndex + 1,
        payload: payload,
        created_at: new Date(),
        postId,
        userId: user.id,
        user: {
          username: user.username,
          avatar: user.avatar,
        },
      };
      return [...prevState, { ...newComment }];
    }
  );

  const onClick = async () => {
    const payload = inputRef.current?.value;
    if (!payload) return;

    startTransition(() => {
      reducerFn(payload);
    });

    const error = await addComment(postId, payload);
    if (error) {
      setErrors([...error]);
    }

    // 값 초기화
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 기본 엔터 제출 방지
      onClick(); // 버튼 클릭 이벤트 실행
    }
  };

  return (
    <div className="flex flex-col">
      {state.map((comment) => (
        <div
          key={comment.id + comment.payload}
          className="flex flex-col gap-2 border-b border-neutral-200 py-5 first:pt-0 last:border-b-0"
        >
          <div className="flex items-center gap-2">
            {comment.user.avatar ? (
              <Image
                src={comment.user.avatar}
                alt={comment.user.username}
                width={28}
                height={28}
                className="size-7 rounded-full bg-white"
              />
            ) : (
              <UserIcon className="size-7 rounded-full bg-white text-black" />
            )}
            <div>
              <span className="text-sm font-semibold">
                {comment.user.username}
              </span>
              <div className="text-xs">
                <span>{formatToTimeAgo(comment.created_at.toString())}</span>
              </div>
            </div>
          </div>
          <p>{comment.payload}</p>
        </div>
      ))}
      <div className="flex gap-3 items-center pt-5">
        <input
          ref={inputRef}
          className="w-3/5 bg-transparent rounded-md h-10 border-none transition
      focus:outline-none ring-2 ring-neutral-200 focus:ring-4 focus:ring-orange-500 
      placeholder:text-neutral-400"
          name="payload"
          placeholder="내용을 입력하세요."
          minLength={0}
          maxLength={100}
          onKeyDown={onKeyDown}
        />
        <button onClick={onClick} className="primary-btn h-10 w-2/5 px-4">
          댓글 등록
        </button>
      </div>
      <div className="mt-1 flex flex-col gap-2">
        {errors.map((error, i) => (
          <p key={error + i} className="text-red-500">
            {error}
          </p>
        ))}
      </div>
    </div>
  );
}
