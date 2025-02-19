import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getIsLiked(postId: number) {
  const session = await getSession();
  const like = await db.like.findUnique({
    where: { id: { postId, userId: session.id! } },
  });

  return Boolean(like);
}

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
          select: { comments: true, likes: true },
        },
      },
    });

    return post;
  } catch (e) {
    return null;
  }
}

export default async function PostDetail({ params }: PostDetailPageProps) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    return notFound();
  }

  const post = await getPost(id);

  if (!post) {
    return notFound();
  }

  const likePost = async () => {
    "use server";
    try {
      const session = await getSession();

      // composite id 때문에 중복 좋아요는 불가능함
      await db.like.create({
        data: {
          postId: id,
          //로그인하지 않은 유저는 미들웨어 덕분에 이 페이지에 못들어옴
          userId: session.id!,
        },
      });

      revalidatePath(`/posts/${id}`);
    } catch (e) {}
  };

  const dislikePost = async () => {
    "use server";
    try {
      const session = await getSession();

      await db.like.delete({
        where: {
          id: {
            postId: id,
            userId: session.id!,
          },
        },
      });

      revalidatePath(`/posts/${id}`);
    } catch (e) {}
  };

  const isLiked = await getIsLiked(id);

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
            className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 hover:bg-neutral-800 transition-colors`}
          >
            <HandThumbUpIcon className="size-5" />
            <span>공감하기 ({post._count.likes})</span>
          </button>
        </form>
      </div>
    </div>
  );
}
