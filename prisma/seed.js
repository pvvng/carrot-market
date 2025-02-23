// npx prisma db seed 

const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

/** 즉시 실행 함수 (IIFE) */
/** 목업 제품 데이터 심기 */
(async () => {
  for (let i = 0; i < 100; i++) {
    const randomPrice = Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000;

    const randomNumberForImage = Math.floor(Math.random() * 2);
    const randomNumberForSoldOut = Math.floor(Math.random() * 2); 

    const photos = [
      "https://imagedelivery.net/MR01-6_39Z4fkK0Q1BsXww/9c95a50b-e666-4087-198b-99464e46f800",
      "https://imagedelivery.net/MR01-6_39Z4fkK0Q1BsXww/bcd07328-3812-498f-375c-74b65e0f2b00"
    ]

    await db.product.create({
      data: {
        price: randomPrice,
        description: `자동으로 생성된 ${!randomNumberForImage ? "세구" : "산호"} ${i + 1}번째`,
        photo: photos[randomNumberForImage],
        sold_out : Boolean(randomNumberForSoldOut),
        title: `랜덤 ${i + 1}`,
        userId: 19,
      },
    });
  }

  console.log("목업 데이터 삽입 완료!");
  await db.$disconnect();
})();