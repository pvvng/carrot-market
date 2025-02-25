"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const titleSchema = z.string().min(0).max(30);

export async function startStream(_: any, formData: FormData) {
  const titleResult = titleSchema.safeParse(formData.get("title"));
  if (!titleResult.success) {
    return titleResult.error.flatten();
  }

  // cloudflare steram api로 stream 제목 전송
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
      body: JSON.stringify({
        meta: { name: titleResult.data },
        recording: { mode: "automatic" },
      }),
    }
  );

  const data = await response.json();

  const session = await getSession();
  // db에 stream id, key 저장
  const stream = await db.liveStream.create({
    data: {
      title: titleResult.data,
      stream_id: data.result.uid,
      stream_key: data.result.rtmps.streamKey,
      userId: session.id!,
    },
    select: { id: true },
  });

  // 리다이렉트
  return redirect(`/streams/${stream.id}`);
}
