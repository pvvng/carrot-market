export default function DeleteModalLoading() {
  return (
    <div className="absolute w-full h-full left-0 top-0 z-50 flex justify-center items-center">
      <div className="text-center bg-white rounded-md p-5 min-w-80 *:animate-pulse">
        <div className="flex flex-col gap-1">
          <div className="w-full h-7 bg-neutral-700 rounded-md" />
          <div className="w-full h-6 bg-neutral-700 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-5 *:h-12">
          <span className="bg-red-500 p-3 rounded-md text-white font-semibold mt-2 disabled:bg-neutral-700"></span>
          <span className="bg-black p-3 rounded-md text-white font-semibold mt-2 cursor-pointer"></span>
        </div>
      </div>
    </div>
  );
}
