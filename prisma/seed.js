const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

/** 즉시 실행 함수 (IIFE) */
/** 목업 제품 데이터 심기 */
(async () => {
  for (let i = 0; i < 100; i++) {
    const randomPrice = Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000;

    await db.product.create({
      data: {
        price: randomPrice,
        description: `자동으로 생성된 세구세구 ${i + 1}번째`,
        photo: "/gosegu.png",
        title: `세구 ${i + 1}`,
        userId: 19,
      },
    });
  }

  console.log("목업 데이터 삽입 완료!");
  await db.$disconnect();
})();