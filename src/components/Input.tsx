import { HTMLProps, ReactNode } from "react";

export type InputProps = {
  label?: string;
  name: string;
  className?: string;
  icon?: ReactNode;
  button?: ReactNode;
} & HTMLProps<HTMLInputElement>;

const Input = ({ label, name, className = "", icon, button, type, ...props }: InputProps) => {
  return (
    <div className={`${label ? "mb-4" : ""}`}>
      {label && (
        <label htmlFor={name} className="text-caption-3">
          {label}
        </label>
      )}
      <div className="relative rounded">
        <input
          id={name}
          name={name}
          data-test="input"
          className={`
            text-body-1 relative block w-full appearance-none
            rounded border border-gray-200 bg-white
            p-4 text-left font-sans text-black
            transition duration-150 ease-in
            placeholder:text-gray-700
            focus:border-primary focus:outline-none focus:ring-0
            disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-100 disabled:text-gray-500
            ${
              type === "file" &&
              `cursor-pointer !px-3 file:-my-1 file:mr-3 file:rounded-full
              file:border-0 file:bg-primary-tint-100 file:px-4
              file:py-2 file:text-sm file:font-semibold
              file:text-primary hover:file:bg-primary-tint-300`
            }
            ${className}
         `}
          type={type}
          {...props}
        />
        {icon && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">{icon}</div>}
        {button && <div className="absolute inset-y-0 right-0 flex items-center pr-3">{button}</div>}
      </div>
    </div>
  );
};

export default Input;
