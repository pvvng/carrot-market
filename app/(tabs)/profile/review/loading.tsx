import { FaceFrownIcon, FaceSmileIcon } from "@heroicons/react/24/outline";

export default function Loading() {
  return (
    <div className="p-5 flex flex-col gap-3 *:animate-pulse">
      <div className="mb-5 bg-black w-full grid grid-cols-2 rounded-md *:p-2 *:rounded-md *:transition-colors">
        <div className="bg-neutral-600 flex gap-2 justify-center items-center">
          <FaceSmileIcon className="size-6" />
          <p>좋아요!</p>
        </div>
        <div className="flex gap-2 justify-center items-center">
          <FaceFrownIcon className="size-6" />
          <p>별로에요</p>
        </div>
      </div>
      <div
        className="bg-black w-full grid grid-cols-2 text-center rounded-md cursor-pointer 
        *:p-2 *:rounded-md *:transition-colors *:flex *:gap-2 *:items-center *:justify-center *:font-semibold"
      ></div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="relative w-full h-10 bg-neutral-600 rounded-md text-black p-2 text-center"
        >
          <div className="absolute -left-2 bottom-1/3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-neutral-600" />
        </div>
      ))}
    </div>
  );
}
