import Input, { InputProps } from "./Input";
import { ChangeEvent } from "react";

const inputRegex = /^(?!0\d)[0-9]*(?:[\.])?[0-9]*$/; // match escaped "." characters via in a non-capturing group

type Props = Omit<InputProps, 'onChange'> & {
  onChange: (input: string) => void;
  prependSymbol?: string;
};

const NumberInput = ({ value, onChange, placeholder, prependSymbol, name }: Props) => {
  return (
    <Input
      name={name}
      value={prependSymbol && value ? prependSymbol + value : value}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        let nextUserInput = "";

        if (prependSymbol) {
          const value = event.target.value;

          // cut off prepended symbol
          const formattedValue = value.toString().includes(prependSymbol)
            ? value.toString().slice(1, value.toString().length + 1)
            : value;

          // replace commas with periods, because uniswap exclusively uses period as the decimal separator
          nextUserInput = formattedValue.replace(/,/g, ".");
        } else {
          nextUserInput = event.target.value.replace(/,/g, ".");
        }

        if (nextUserInput === "" || inputRegex.test(nextUserInput)) {
          onChange(nextUserInput);
        }
      }}
      // universal input options
      inputMode="decimal"
      autoComplete="off"
      autoCorrect="off"
      // text-specific options
      type="text"
      pattern="^(?!0\d)[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder || "0"}
      minLength={1}
      maxLength={79}
      spellCheck="false"
    />
  );
};

export default NumberInput;
