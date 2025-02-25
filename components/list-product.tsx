import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import { HeartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
  sold_out: boolean;
  _count: { heart: number };
}
export default function ListProduct({
  title,
  price,
  created_at,
  photo,
  id,
  sold_out,
  _count,
}: ListProductProps) {
  const { heart: heartCount } = _count;

  return (
    <Link
      href={`/products/p/${id}`}
      // modal 창 떴을때 상단 스크롤 안되도록 scroll false
      scroll={false}
      className="flex gap-5"
    >
      {/* 부모 div에서 이미지 사이즈 컨트롤 가능 -> 스타일, 반응형 적용이 된다는 의미 */}
      <div className="relative size-28 rounded-md overflow-hidden bg-gray-200">
        {sold_out && (
          <div className="absolute inset-0 text-black font-semibold flex justify-center items-center">
            판매완료
          </div>
        )}
        <Image
          src={`${photo}/smaller`}
          alt={title}
          // fill = {boolean}을 주면 style : absolute가 됨
          fill
          sizes="112"
          className={`object-cover ${sold_out && "opacity-50"}`}
        />
      </div>
      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-lg">{title}</span>
        <span className="text-lg font-semibold">{formatToWon(price)}원</span>
        <span className="text-sm text-neutral-600">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="flex gap-1 items-center justify-start *:text-neutral-400">
          <HeartIcon className="size-3" />
          <span className="text-sm">{heartCount}</span>
        </span>
      </div>
    </Link>
  );
}
