import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Live() {
  return (
    <div>
      <h1 className="text-4xl text-white">Live!</h1>
      <Link
        href="/streams/add"
        className="bg-orange-500 text-white flex items-center justify-center rounded-full size-16 
        fixed bottom-24 right-8 transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
