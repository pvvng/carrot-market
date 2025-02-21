import Image from "next/image";
import Sango from "@/public/sango.png";
import Segu from "@/public/gosegu.webp";

interface Props {
  params: Promise<{ id: string[] }>;
}

export default async function CatchAllSegment({ params }: Props) {
  const ids = (await params).id;

  return (
    <div>
      {/* 로컬 이미지는 placholer로 blur 주는거 추천 */}
      <Image src={Sango} alt="이미지" placeholder="blur" />
      {/* 외부 이미지인 경우엔 placholder로 base64 인코딩된 이미지 넣으면 됨 */}
      <Image
        src={Segu}
        alt="이미지"
        // placehlder image blur 처리
        placeholder="blur"
        // placeholder 이미지
        blurDataURL="base24IncodedImage"
      />
      {/* 이미지 base 64 인코딩하는 곳 */}
      <a>https://www.base64-image.de</a>
    </div>
  );
}
