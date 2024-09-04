import { CheckIcon } from "./Icons.tsx";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  label?: ReactNode;
};

const SuccessCardWhite = ({ children, className = "", label = <>Success!</> }: Props) => {
  return (
    <div
      data-test="success-card-white"
      className={`
        relative rounded border border-gray-200
        bg-white px-4 py-4 ${className}
      `}
    >
      <div className="flex gap-x-3">
        <div className="flex-shrink-0">
          <CheckIcon className="h-[18px] w-[18px] text-success" />
        </div>
        <div>
          <span className={`text-caption-2 block text-black ${children ? "mb-2" : ""}`}>{label}</span>
          <div className="text-body-2 text-gray-800">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SuccessCardWhite;
