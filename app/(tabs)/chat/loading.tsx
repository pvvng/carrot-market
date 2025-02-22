export default function Loading() {
  return (
    <div className="p-5 flex flex-col mb-16">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="border-b p-5 border-neutral-500 flex items-center gap-5"
        >
          <div className="flex gap-2 items-center">
            <div className="bg-neutral-500 size-8 rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 *:h-5 *:rounded-md">
              <div className="w-20 bg-neutral-500 " />
              <div className="w-8 bg-neutral-500 " />
            </div>
            <div className="w-40 h-6 bg-neutral-500 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
