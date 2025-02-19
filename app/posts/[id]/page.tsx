import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import {
  EyeIcon,
  HandThumbUpIcon as OutlineHandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { HandThumbUpIcon as SolidHandThumbUpIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

const getCachedPost = nextCache(getPost, ["post-detatil"], {
  tags: ["#post"],
  revalidate: 60,
});

async function getPost(id: number) {
  try {
    const post = db.post.update({
      where: { id },
      data: {
        //  조회수 1 증가
        views: { increment: 1 },
      },
      include: {
        user: {
          select: { username: true, avatar: true },
        },
        _count: {
          select: { comments: true },
        },
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
  const id = Number((await params).id);

  if (isNaN(id)) {
    return notFound();
  }

  const post = await getCachedPost(id);

  if (!post) {
    return notFound();
  }

  const session = await getSession();

  if (!session.id) {
    return notFound();
  }

  const likePost = async () => {
    "use server";
    await new Promise((res) => setTimeout(res, 5000));
    try {
      // composite id 때문에 중복 좋아요는 불가능함
      await db.like.create({
        data: {
          postId: id,
          //로그인하지 않은 유저는 미들웨어 덕분에 이 페이지에 못들어옴
          userId: session.id!,
        },
      });

      revalidateTag(`#post-like-status-${id}`);
    } catch (e) {}
  };

  const dislikePost = async () => {
    "use server";
    try {
      await db.like.delete({
        where: {
          id: {
            postId: id,
            userId: session.id!,
          },
        },
      });

      revalidateTag(`#post-like-status-${id}`);
    } catch (e) {}
  };

  const { isLiked, likeCount } = await getCachedLikeStatus(session.id, id);

  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Image
          src={post.user.avatar!}
          alt={post.user.username}
          width={28}
          height={28}
          className="size-7 rounded-full bg-white"
        />
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
        <form action={isLiked ? dislikePost : likePost}>
          <button
            className={`flex items-center gap-2 text-sm border border-neutral-400 rounded-full p-2 transition-colors 
              ${
                isLiked
                  ? "bg-orange-500 text-white border-orange-500 hover:border-orange-400 hover:bg-orange-400"
                  : "text-neutral-400 hover:bg-neutral-800 hover:border-neutral-400"
              }`}
          >
            {isLiked ? (
              <SolidHandThumbUpIcon className="size-5" />
            ) : (
              <OutlineHandThumbUpIcon className="size-5" />
            )}
            {isLiked ? (
              <span>{likeCount}</span>
            ) : (
              <span>공감하기 ({likeCount})</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
