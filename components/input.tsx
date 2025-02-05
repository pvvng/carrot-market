import { InputHTMLAttributes } from "react";

interface InputProps {
  name: string;
  errors?: string[];
}
// InputHTMLAttributes<HTMLInputElement>
// input이 받을수 있는 모든 props 받을 수 있음

export default function Input({
  name,
  errors = [],
  // name과 error를 제외한 모든 InputHTMLAttributes<HTMLInputElement> props 한번에 받기
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent rounded-md w-full h-10 border-none transition
      focus:outline-none ring-2 ring-neutral-200 focus:ring-4 focus:ring-orange-500 
      placeholder:text-neutral-400"
        name={name}
        {...rest}
        // autoComplete="off"
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
