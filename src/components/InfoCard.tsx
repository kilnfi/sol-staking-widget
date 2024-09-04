import { InfoIcon } from "./Icons";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  label?: string;
  icon?: ReactNode;
};

const InfoCard = ({ children, className = "", label = "Info", icon }: Props) => {
  return (
    <div
      data-test="info-cards"
      className={`
        relative rounded border border-gray-200
        bg-white px-5 py-4 ${className}
      `}
    >
      <div className={`flex gap-x-3 ${children ? "mb-2" : ""}`}>
        {icon ? icon : <InfoIcon className="h-[18px] w-[18px] flex-shrink-0 text-gray-700"/>}
        <span className={`text-caption-2 block text-gray-700`}>{label}</span>
      </div>
      {children && (
        <div className="text-body-2 text-black">{children}</div>
      )}
    </div>
  );
};

export default InfoCard;
