export default function ProfileLoading() {
  return (
    <div className="p-5 flex flex-col gap-4 mb-24 *:animate-pulse">
      <div className="bg-neutral-950 rounded-md flex flex-col gap-5 justify-center items-start p-5">
        <div className="flex items-center gap-3">
          <div className="size-14 rounded-full bg-neutral-600" />
          <div className="w-24 h-4 rounded-md bg-neutral-600" />
        </div>
        <div className="w-full h-8 rounded-md bg-neutral-600" />
      </div>
      <div className="bg-neutral-950 rounded-md flex flex-col gap-5 justify-center items-start p-5">
        <div className="w-24 h-4 rounded-md bg-neutral-600" />
        <div className="w-full h-6 rounded-md bg-neutral-600" />
        <div className="w-full h-6 rounded-md bg-neutral-600" />
        <div className="w-full h-6 rounded-md bg-neutral-600" />
      </div>
      <div className="bg-neutral-950 rounded-md flex flex-col gap-5 justify-center items-start p-5">
        <div className="w-24 h-4 rounded-md bg-neutral-600" />
        <div className="w-full h-6 rounded-md bg-neutral-600" />
        <div className="w-full h-6 rounded-md bg-neutral-600" />
        <div className="w-full h-6 rounded-md bg-neutral-600" />
      </div>
    </div>
  );
}
