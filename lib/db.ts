// client 호출
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function test() {
  const token = await db.sMSToken.findUnique({
    where: {
      id: 1,
    },
    // smsToken와 관계된(relation) user data 불러오기
    include: {
      user: true,
    },
  });
  console.log(token);
}

test();

export default db;
