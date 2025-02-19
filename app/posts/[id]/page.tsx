interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetail({ params }: PostDetailPageProps) {
  const id = (await params).id;

  return <div>{id}</div>;
}
