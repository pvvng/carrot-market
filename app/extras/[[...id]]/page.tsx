interface Props {
  params: Promise<{ id: string[] }>;
}
export default async function CatchAllSegment({ params }: Props) {
  const ids = (await params).id;
  console.log(ids);

  return (
    <div>
      <h1 className="text-4xl font-sigmar">Sigmar</h1>
      <p className="text-4xl font-roboto">roboto</p>
      <p className="text-4xl font-metalica">metalica</p>
      {ids?.map((id) => (
        <div key={id}>{id}</div>
      ))}
    </div>
  );
}
