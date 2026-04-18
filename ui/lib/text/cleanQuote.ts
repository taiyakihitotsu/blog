export const cleanQuote = (text: string) => text.trim().replace(/^'/g, "").replace(/'$/g, "");
