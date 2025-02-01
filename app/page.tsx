export default function Home() {
  // mac 자동완성 커맨드 -> cmd + i
  return (
    <main className="bg-gray-100 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-blue-100 h-screen flex justify-center items-center p-5">
      <div className="bg-white w-full shadow-lg p-5 rounded-3xl max-w-screen-sm flex flex-col gap-2 md:flex-row">
        <input
          className="w-full rounded-full py-3 bg-gray-200 pl-5 outline-none 
          ring ring-transparent focus:ring-orange-500 focus:ring-offset-2 transition-shadow
          placeholder:drop-shadow"
          type="text"
          placeholder="search here"
        />
        <button
          className="bg-black text-white py-2 rounded-full font-medium outline-none 
        transition-transform active:scale-90 md:px-10"
        >
          search
        </button>
      </div>
    </main>
  );
}
