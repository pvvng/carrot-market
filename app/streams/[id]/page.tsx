import db from "@/lib/db";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";

interface StreamDetailProps {
  params: Promise<{ id: string }>;
}

async function getStream(id: number) {
  const stream = await db.liveStream.findUnique({
    where: { id },
    select: {
      title: true,
      stream_key: true,
      stream_id: true,
      userId: true,
      user: {
        select: { avatar: true, username: true },
      },
    },
  });

  return stream;
}

export default async function StreamDetail({ params }: StreamDetailProps) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    return notFound();
  }

  const stream = await getStream(id);

  if (!stream) {
    return notFound();
  }

  const session = await getSession();

  return (
    <div className="p-5">
      <div className="aspect-video relative">
        <iframe
          src={`https://${process.env.CLOUDFLARE_DOMAIN}/7650211c404a9daaf378dff246623a0c/iframe`}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          className="w-full h-full rounded-md"
        ></iframe>
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {stream.user.avatar ? (
            <Image
              src={stream.user.avatar}
              alt={stream.user.username}
              width={40}
              height={40}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{stream.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{stream.title}</h1>
      </div>
      {session.id && session.id === stream.userId && (
        <div className="flex flex-col gap-3 bg-yellow-300 text-black p-5 rounded-md">
          <div>
            <span className="font-semibold">Stream URL</span>
            <p>rtmps://live.cloudflare.com:443/live/</p>
          </div>
          <div className="break-words">
            <span className="font-semibold">Secret Key</span>
            <p>{stream.stream_key}</p>
          </div>
        </div>
      )}
    </div>
  );
}
