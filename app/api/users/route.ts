import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return Response.json({
    ok: true,
  });
}

export async function POST(req: NextRequest) {
  // read req cookies
  // const cookies = req.cookies.get("cookie name");

  // read req body
  const data = await req.json();

  return Response.json(data);
}
