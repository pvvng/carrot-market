import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
}
export default function ListProduct({
  title,
  price,
  created_at,
  photo,
  id,
}: ListProductProps) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5">
      {/* 부모 div에서 이미지 사이즈 컨트롤 가능 -> 스타일, 반응형 적용이 된다는 의미 */}
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image
          src={photo}
          alt={title}
          // fill = {boolean}을 주면 style : absolute가 됨
          fill
        />
      </div>
      <div className="flex flex-col gap-2 *:text-white">
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold">{formatToWon(price)}원</span>
      </div>
    </Link>
  );
}
