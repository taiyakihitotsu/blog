import path from "node:path";
import { docDir } from "../../shared/common.js";

export const resolveDocPath = (id: string) => path.resolve(process.cwd(), `${docDir}/${id}.md`);
