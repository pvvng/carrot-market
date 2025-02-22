import { ArrowUpCircleIcon } from "@heroicons/react/16/solid";

export default function Loading() {
  return (
    <div className="p-5 flex flex-col gap-5 h-screen justify-end">
      <div className="text-center h-full flex items-center justify-center animate-pulse">
        loading...
      </div>
      <div className="flex relative animate-pulse">
        <input
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 
          ring-2 focus:ring-4 transition ring-neutral-500 focus:ring-neutral-500 border-none placeholder:text-neutral-400"
          type="text"
          disabled
          name="message"
          placeholder="Loading..."
          autoComplete="off"
        />
        <button className="absolute right-0" disabled={true}>
          <ArrowUpCircleIcon className="size-10 text-neutral-600" />
        </button>
      </div>
    </div>
  );
}
