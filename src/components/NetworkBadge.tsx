import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const NetworkBadge = ({ children }: Props) => {
  return (
    <span
      data-test="network-badge"
      className="text-caption-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-primary"
    >
      {children}
    </span>
  );
};

export default NetworkBadge;
