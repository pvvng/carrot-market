"use client";

import Button from "@/components/button";
import Input from "@/components/input";

import { useActionState } from "react";
import { smsLogin } from "./actions";

const initialState = {
  token: false,
  phone: undefined,
  error: undefined,
};

export default function SMSLogin() {
  const [state, action] = useActionState(smsLogin, initialState);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number</h2>
      </div>
      <form action={action} className="flex flex-col gap-3 ">
        <Input
          name="phone"
          type="text"
          placeholder="phone number"
          required
          defaultValue={state.phone}
          readOnly={Boolean(state.phone)}
          errors={!Boolean(state.phone) ? state.error?.formErrors : []}
        />
        {state.token ? (
          <Input
            name="token"
            type="number"
            placeholder="Verification code"
            required
            min={100000}
            max={999999}
            errors={state.error?.formErrors}
          />
        ) : null}
        <Button text={state.token ? "Verify" : "Send SMS Message"} />
      </form>
    </div>
  );
}
