export default function Home() {
  // mac 자동완성 커맨드 -> cmd + i
  return (
    <main className="bg-gray-300 h-screen flex justify-center items-center p-5">
      <div className="bg-white w-full shadow-lg p-5 rounded-2xl">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-gray-600 font-semibold -mb-1">
              In transit
            </span>
            <span className="text-4xl font-semibold">Coolblue</span>
          </div>
          <div className="size-12 rounded-full bg-orange-400" />
        </div>
        <div className="my-2 flex items-center gap-2">
          <span className="bg-green-400 text-white uppercase px-2.5 py-1.5 text-xs font-semibold rounded-full">
            today
          </span>
          <span className="font-semibold">9:30-10:30</span>
        </div>
        <div className="relative">
          <div className="bg-gray-200 absolute rounded-full w-full h-2" />
          <div className="bg-green-400 absolute rounded-full w-2/3 h-2" />
        </div>
        <div className="flex justify-between items-center text-gray-600 mt-5">
          <span>Expected</span>
          <span>Sorting Center</span>
          <span>In Transit</span>
          <span className="text-gray-400">Delivered</span>
        </div>
      </div>
    </main>
  );
}
