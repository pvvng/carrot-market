export default function PostLoading() {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5 mb-24">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="*:rounded-md flex gap-5">
          <div className="flex flex-col gap-2 *:h-5 *:rounded-md">
            <div className="bg-neutral-700 w-20" />
            <div className="bg-neutral-700 w-40" />
            <div className="flex gap-2 *:rounded-md">
              <div className="bg-neutral-700 w-5" />
              <div className="bg-neutral-700 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
