interface FormInputProps {
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
  errors?: string[];
}

export default function FormInput({
  name,
  type,
  placeholder,
  required,
  errors = [],
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent rounded-md w-full h-10 border-none transition
      focus:outline-none ring-2 ring-neutral-200 focus:ring-4 focus:ring-orange-500 
      placeholder:text-neutral-400"
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
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
