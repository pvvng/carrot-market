import { revalidatePath } from "next/cache";

interface Props {
  params: Promise<{ id: string[] }>;
}

// 실제 api 호출
async function getData() {
  const response = await fetch(
    "https://nomad-movies.nomadcoders.workers.dev/movies",
    { cache: "force-cache" }
  );
}

export default async function CatchAllSegment({ params }: Props) {
  const ids = (await params).id;

  await getData();

  const action = async () => {
    "use server";
    revalidatePath("/extras");
  };

  return (
    <div>
      <h1 className="text-4xl font-sigmar">Sigmar</h1>
      <p className="text-4xl font-roboto">roboto</p>
      <p className="text-4xl font-metalica">metalica</p>
      <form action={action}>
        <button>revalidate</button>
      </form>
    </div>
  );
}
