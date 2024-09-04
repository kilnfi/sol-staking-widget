import { LoadingIcon, PlusIcon } from "./Icons.tsx";
import Tooltip from "./Tooltip";

const VARIANT_STYLES = {
  primary:
    "min-w-[200px] text-white bg-primary shadow-md hover:shadow-none focus:shadow-none disabled:shadow-none hover:bg-primary-hover border-0 focus:bg-primary-pressed disabled:bg-primary-disabled",
  secondary:
    "min-w-[200px] text-black bg-primary-tint-200 border border-primary hover:bg-primary-tint-100 focus:bg-primary-tint-300 disabled:border-0 disabled:shadow-none disabled:bg-primary-disabled disabled:text-white",
  tertiary:
    "text-gray-800 bg-white border border-gray-100 hover:bg-gray-50 hover:border-gray-500 focus:bg-gray-100 focus:border-gray-800 disabled:opacity-50 disabled:bg-gray-100",
  danger:
    "text-white bg-error hover:bg-error-hover border-0 focus:bg-error-pressed disabled:bg-primary-disabled disabled:text-white",
  circle: "text-black border-0",
} as const;

const SIZE_STYLES = {
  normal: "h-[56px] px-6",
  small: "h-[40px] px-4",
  xsmall: "h-[27px] px-[10px] py-[4px]",
} as const;

export function getButtonStyles(variant: Variant, size: Size, className = "") {
  const variantStyles = VARIANT_STYLES[variant];
  const sizeStyles = SIZE_STYLES[size];

  return `
    inline-flex items-center gap-x-2 justify-center
    focus:outline-none
    transition duration-150 ease-in-out
    disabled:cursor-not-allowed
    whitespace-no-wrap
    rounded
    no-underline
    text-subtitle-2
    group
    ${variantStyles} ${sizeStyles} ${className}`;
}

type Variant = keyof typeof VARIANT_STYLES;

type Size = keyof typeof SIZE_STYLES;

type Props = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: (e: React.MouseEvent<HTMLButtonElement & HTMLAnchorElement>) => void;
  loading?: boolean;
  disabled?: boolean;
  download?: boolean | string;
  variant: Variant;
  size: Size;
  tooltip?: React.ReactNode;
  "data-test"?: string;
};

const Plus = () => (
  <span className="ml-4 rounded-full bg-primary p-2 group-hover:bg-primary-hover group-focus:bg-primary-pressed group-disabled:bg-primary-disabled">
    <PlusIcon className="h-2 w-2" />
  </span>
);

const Loading = ({ variant }: { variant: Variant }) => {
  const textColor =
    variant === "primary" || variant === "danger"
      ? "text-white"
      : variant === "secondary" || variant === "tertiary"
        ? "text-black"
        : "";

  return <LoadingIcon className={`me-2 h-4 w-4 ${textColor}`} />;
};

const Button = ({
  children,
  className = "",
  href,
  type = "button",
  variant = "primary",
  size = "normal",
  tooltip,
  loading = false,
  disabled = false,
  ...props
}: Props) => {
  props["data-test"] ??= "button";

  const renderLink = (href: string) => {
    return (
      <a {...props} href={href} className={getButtonStyles(variant, size, className)}>
        {children}
        {variant === "circle" && <Plus />}
      </a>
    );
  };

  const renderButton = () => {
    return (
      <button
        {...props}
        type={type}
        disabled={disabled || loading}
        className={getButtonStyles(variant, size, className)}
      >
        {loading && <Loading variant={variant} />}
        {children}
        {variant === "circle" && <Plus />}
      </button>
    );
  };

  const content = href ? renderLink(href) : renderButton();

  return tooltip ? (
    <Tooltip>
      <Tooltip.Trigger>{content}</Tooltip.Trigger>
      <Tooltip.Content>{tooltip}</Tooltip.Content>
    </Tooltip>
  ) : (
    content
  );
};

export default Button;
