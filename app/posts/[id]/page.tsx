import CommentForm from "@/components/comment-form";
import LikeButton from "@/components/like-button";
import { getCachedcomments } from "@/lib/data/post-comments";
import { getCachedUser } from "@/lib/data/user";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: number) {
  try {
    const post = db.post.update({
      where: { id },
      // 조회수 1 증가
      data: { views: { increment: 1 } },
      include: {
        user: { select: { username: true, avatar: true } },
        _count: { select: { comments: true } },
      },
    });

    return post;
  } catch (e) {
    return null;
  }
}

// 전체 like-status의 revalidation을 막기 위해 태그에 postId 추가
function getCachedLikeStatus(userId: number, postId: number) {
  const cachedOperation = nextCache(getLikeStatus, ["post-liketSatus"], {
    tags: [`#post-like-status-${postId}`],
  });

  return cachedOperation(userId, postId);
}

async function getLikeStatus(userId: number, postId: number) {
  const isLiked = await db.like.findUnique({
    where: { id: { postId, userId } },
  });

  // 이 post id에 대한 좋아요 개수 세기
  const likeCount = await db.like.count({ where: { postId } });

  return { isLiked: Boolean(isLiked), likeCount };
}

export default async function PostDetail({ params }: PostDetailPageProps) {
  const postId = Number((await params).id);

  if (isNaN(postId)) {
    return notFound();
  }

  const post = await getPost(postId);

  if (!post) {
    return notFound();
  }

  const session = await getSession();

  if (!session.id) {
    return notFound();
  }

  const user = await getCachedUser(session.id);

  if (!user) {
    return notFound();
  }

  const { isLiked, likeCount } = await getCachedLikeStatus(session.id, postId);
  const comments = await getCachedcomments(postId);

  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <div className="relative size-7 rounded-full overflow-hidden bg-neutral-200">
          {post.user.avatar ? (
            <Image
              src={post.user.avatar}
              alt={post.user.username}
              fill
              priority
              sizes="28"
              className="object-cover"
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={postId} />
      </div>
      <hr className="my-5" />
      <CommentForm comments={comments} user={user} postId={postId} />
    </div>
  );
}
