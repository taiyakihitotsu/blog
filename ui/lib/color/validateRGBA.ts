import { foxp } from "@taiyakihitotsu/foxp";

export const rgbaCheck = foxp.bi.rematch<foxp.pre.match>();
export const rgbaRegex = foxp.putPrim(foxp.regex.rgbaRegex);
