import CloseButton from "@/components/close-button";
import ModalBackground from "@/components/modal-background";
import { PhotoIcon } from "@heroicons/react/16/solid";

export default function Loading() {
  return (
    <div className="absolute w-full h-full left-0 top-0 z-50 flex justify-center items-center">
      <ModalBackground />
      <CloseButton />
      <div className="bg-neutral-900 aspect-square w-full max-w-screen-sm rounded-md overflow-scroll p-5">
        <div
          className="aspect-square border-neutral-700 border-4 border-dashed rounded-md 
        flex justify-center items-center text-neutral-700"
        >
          <PhotoIcon className="animate-pulse h-28" />
        </div>
        <div className="p-5 flex gap-3 items-center border-b border-neutral-700">
          <div className="size-14 rounded-full bg-neutral-700" />
          <div className="flex flex-col gap-1">
            <div className="h-5 w-40 bg-neutral-700 rounded-md " />
            <div className="h-5 w-20 bg-neutral-700 rounded-md " />
          </div>
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div className="h-5 w-20 bg-neutral-700 rounded-md " />
          <div className="h-5 w-full bg-neutral-700 rounded-md " />
        </div>
      </div>
    </div>
  );
}
