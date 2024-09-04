export const formatAddress = (address: string, length: number = 5) => {
  return `${address.substring(0, length)}...${address.slice(address.length - length)}`;
};

export const formatNumber = (number: number | bigint, maximumFractionDigits = 2): string => {
  return new Intl.NumberFormat("en-EN", {
    maximumFractionDigits: maximumFractionDigits,
    signDisplay: "negative" as any,
    // TypeScript doesn't know that format can take a number or string
    // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/format#number
    // this allows keeping full precision
  }).format(number);
};

export const solToLamports = (sol: number | string): number => {
  return sol ? Number(sol) * 10 ** 9 : 0;
};

export const formatPrice = (price: number, currency: "USD" | "EUR" | "GBP" = "USD"): string => {
  return new Intl.NumberFormat("en-EN", {
    style: "currency",
    currency: currency,
    // TypeScript doesn't know that format can take a number or string
    // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/format#number
    // this allows keeping full precision
  }).format(price);
};