export default function Loading() {
  return (
    <div className="p-5 mb-20">
      <div className="mb-5 bg-black w-full grid grid-cols-2 text-center rounded-md *:p-2 *:rounded-md *:transition-colors">
        <div className="bg-neutral-600">판매중</div>
        <div>판매완료</div>
      </div>
      <div className="*:animate-pulse flex flex-col gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="*:rounded-md flex gap-5">
            <div className="bg-neutral-700 size-28" />
            <div className="flex flex-col gap-2 *:h-5 *:rounded-md">
              <div className="bg-neutral-700 w-40" />
              <div className="bg-neutral-700 w-20" />
              <div className="bg-neutral-700 w-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
