export default function PostLoading() {
  return (
    <div className="p-5 *:animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-neutral-700 size-7 rounded-full" />
        <div className="*:h-4 *:rounded-md flex flex-col gap-1">
          <div className="bg-neutral-700 w-20" />
          <div className="bg-neutral-700 w-12" />
        </div>
      </div>
      <div className="*:rounded-md flex flex-col gap-2">
        <div className="bg-neutral-700 w-20 h-7" />
        <div className="bg-neutral-700 w-40 h-6 mb-5" />
      </div>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm *:rounded-md">
          <div className="size-5 bg-neutral-700" />
          <div className="bg-neutral-700 w-8 h-5" />
        </div>
        <div className="bg-neutral-700 w-28 h-9 rounded-full" />
      </div>
      <hr className="my-5 text-neutral-700" />
    </div>
  );
}
