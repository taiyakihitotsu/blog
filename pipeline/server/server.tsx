import fs from "node:fs";
import path from "node:path";
import { docDir as _docDir } from "../../shared/common.js";
import { handleRequest } from "./handleRequest.js";

const getStaticPaths = () => {
  const docDir = path.resolve(process.cwd(), _docDir);
  if (!fs.existsSync(docDir)) return ["/"];

  const files = fs.readdirSync(docDir);
  return [
    "/",
    ...files.filter((f) => f.endsWith(".md")).map((f) => `/docs/${f.replace(".md", "")}`),
  ];
};

const run = async () => {
  for (const p of getStaticPaths()) await handleRequest(p)();
};

run();
