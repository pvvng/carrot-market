export default function Home() {
  // mac 자동완성 커맨드 -> cmd + i
  return (
    <main className="bg-gray-100 h-screen flex justify-center items-center p-5">
      <div className="bg-white w-full shadow-lg p-5 rounded-3xl max-w-screen-sm flex flex-col gap-2">
        <input
          className="w-full rounded-full py-3 bg-gray-200 pl-5 outline-none 
          ring ring-transparent focus:ring-orange-500 focus:ring-offset-2 transition-shadow
          placeholder:drop-shadow"
          type="text"
          placeholder="search here"
        />
        <button
          className="bg-black text-white py-2 rounded-full font-medium outline-none 
        transition-transform active:scale-90"
        >
          search
        </button>
      </div>
    </main>
  );
}
