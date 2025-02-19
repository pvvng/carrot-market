import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";
import db from "../db";

export type Comments = Prisma.CommentGetPayload<{
  select: {
    id: true;
    payload: true;
    created_at: true;
    postId: true;
    userId: true;
    user: {
      select: { avatar: true; username: true };
    };
  };
  orderBy: {
    created_at: "asc";
  };
}>;

export function getCachedcomments(postId: number) {
  const cachedOperation = nextCache(getComments, ["post-comments"], {
    tags: [`#post-comments-${postId}`],
  });

  return cachedOperation(postId);
}
export async function getComments(postId: number): Promise<Comments[]> {
  // await new Promise((r) => setTimeout(r, 8000));
  const comments: Comments[] = await db.comment.findMany({
    where: { postId },
    select: {
      id: true,
      payload: true,
      created_at: true,
      postId: true,
      userId: true,
      user: {
        select: { avatar: true, username: true },
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });

  return comments;
}
