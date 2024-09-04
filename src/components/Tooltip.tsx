import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  open?: boolean;
  className?: string;
  hidden?: boolean;
};

const Trigger = ({ children }: Props) => (
  <TooltipPrimitive.TooltipTrigger asChild data-test="tooltip-trigger">
    {children}
  </TooltipPrimitive.TooltipTrigger>
);

const Content = ({ children, hidden, className = "" }: Props) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      side="top"
      hidden={hidden}
      sideOffset={5}
      data-test="tooltip-content"
      className={`
        animate-fade-in text-small-3 z-50 max-w-md
        rounded-md bg-white p-4 text-sm text-gray-800
        shadow-md ${className}
      `}
    >
      {children}
      <TooltipPrimitive.Arrow className="fill-white" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
);

const Tooltip = ({ children, open, delayDuration = 0 }: Props & { delayDuration?: number }) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root open={open} delayDuration={delayDuration}>
        {children}
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

Tooltip.Trigger = Trigger;
Tooltip.Content = Content;

export default Tooltip;
