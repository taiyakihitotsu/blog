export const hexToRGBA = (hex: string, alpha: number = 1): string => {
  const cleanHex = hex.replace("#", "");

  if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  let r: number, g: number, b: number;

  if (
    cleanHex.length === 3 &&
    cleanHex[0] !== null &&
    cleanHex[1] !== null &&
    cleanHex[2] !== null
  ) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else {
    const num = parseInt(cleanHex, 16);
    r = (num >> 16) & 255;
    g = (num >> 8) & 255;
    b = num & 255;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
