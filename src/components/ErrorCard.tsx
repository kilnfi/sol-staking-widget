import { CrossIcon } from "./Icons.tsx";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const ErrorCard = ({ children, className = "" }: Props) => {
  return (
    <div
      data-test="error-card"
      className={`relative rounded border border-error bg-error-light px-4 py-4 ${className}`}
    >
      <div className="flex gap-x-3">
        <div className="flex-shrink-0">
          <CrossIcon className="h-4 w-4 text-error" aria-hidden="true" />
        </div>

        <div className="text-body-2">{children}</div>
      </div>
    </div>
  );
};

export default ErrorCard;
