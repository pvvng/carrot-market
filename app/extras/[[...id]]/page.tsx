import { revalidatePath } from "next/cache";
import Hacked from "./hacked-component";
import {
  experimental_taintObjectReference,
  experimental_taintUniqueValue,
} from "react";

interface Props {
  params: Promise<{ id: string[] }>;
}

function getData() {
  const secret = {
    api_key: "1234",
    secret_key: "secret",
  };

  // prevent licking
  // experimental_taintObjectReference("secret key 유출시 1억", secret);

  // 특정 key만 유출 방지
  // experimental_taintUniqueValue("1억끼얏호우", secret, secret.secret_key);

  //   ⨯ Error: api key 유출시 1억
  //   at stringify (<anonymous>) {
  // digest: '847966630'
  // }

  // 중요 키 누출
  return secret;
}

export default async function CatchAllSegment({ params }: Props) {
  const ids = (await params).id;

  const data = getData();

  return (
    <div>
      <h1 className="text-4xl font-sigmar">Sigmar</h1>
      <p className="text-4xl font-roboto">roboto</p>
      <p className="text-4xl font-metalica">metalica</p>
      <Hacked data={data} />
    </div>
  );
}
