"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useActionState } from "react";
import { startStream } from "./actions";

export default function Stream() {
  const [state, action] = useActionState(startStream, null);

  return (
    <form className="p-5 flex flex-col gap-3" action={action}>
      <Input
        name="title"
        required
        placeholder="title of your steram"
        errors={state?.formErrors}
      />
      <Button text="start streaming" />
    </form>
  );
}
