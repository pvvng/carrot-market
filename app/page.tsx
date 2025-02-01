export default function Home() {
  // mac 자동완성 커맨드 -> cmd + i
  return (
    <main className="bg-gray-100 h-screen flex justify-center items-center p-5">
      <div className="bg-white w-full shadow-lg p-5 rounded-3xl max-w-screen-sm flex flex-col gap-3">
        {["kim", "me", "you", "yourself", undefined].map((person, index) => (
          <div
            key={index}
            className="group flex items-center gap-5 p-2.5 odd:bg-gray-100 even:bg-cyan-50 rounded-xl"
          >
            <div className="size-10 rounded-full bg-blue-400" />
            <span
              className="text-lg font-medium 
              empty:w-24 empty:h-5 empty:rounded-full animate-pulse empty:bg-gray-400 
             group-hover:text-red-500"
            >
              {person}
            </span>
            <div className="size-6 bg-red-500 text-white flex justify-center rounded-full relative">
              <span className="z-10">{index}</span>
              <div className="size-6 bg-red-500 rounded-full absolute group-hover:animate-ping" />
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-3 group">
          <input
            className="w-full bg-gray-200 px-2"
            placeholder="write email"
            type="text"
          />
          <span className="group-focus-within:block hidden">
            Make sure it is a invaild email
          </span>
          <button className="bg-blue-500 rounded-full text-white px-2">
            submit
          </button>
        </div>
      </div>
    </main>
  );
}
