import { LoadingIcon } from "./Icons.tsx";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const LoadingCard = ({ children, className = "" }: Props) => {
  return (
    <div
      data-test="loading-card"
      className={`
        flex items-center justify-center gap-x-3
        rounded border border-primary bg-primary-tint-200
        p-4 ${className}
      `}
    >
      <LoadingIcon className="h-4 w-4 text-primary" />
      <span className="text-subtitle-2 text-gray-900">{children}</span>
    </div>
  );
};

export default LoadingCard;
