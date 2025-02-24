"use client";

import { uploadPost } from "@/app/posts/add/actions";
import Button from "@/components/button";
import Input from "@/components/input";
import { useActionState } from "react";

export default function PostForm() {
  const [state, action] = useActionState(uploadPost, null);

  return (
    <form action={action} className="p-5 mb-24 flex flex-col gap-3">
      <h1 className="text-xl font-semibold">🥕 동네생활 게시물 등록하기</h1>
      <Input
        name="title"
        required
        placeholder="제목을 입력하세요"
        errors={state?.fieldErrors.title}
      />
      <Input
        name="description"
        placeholder="내용을 입력하세요"
        errors={state?.fieldErrors.description}
      />
      <Button text="등록하기" />
    </form>
  );
}
