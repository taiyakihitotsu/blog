import { pathToFileURL } from "node:url";
import React from "react";

global.React = React;

import { register } from "node:module";

register(
  "data:text/javascript," +
    encodeURIComponent(`
export async function load(url, context, nextLoad) {
  if (url.includes('gsap')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: \`
        const dummy = ({ children }) => children;
        export const gsap = { 
          to: () => {}, from: () => {}, timeline: () => ({ to: () => {} }),
          registerPlugin: () => {} 
        };
        export const useGSAP = () => {};
        export default dummy;
      \`
    };
  }

  if (url.includes('@react-three/cannon') || url.includes('three')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default () => null;'
    };
  }

  if (url.endsWith('.css')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default {}'
    };
  }
  return nextLoad(url, context);
}
`),
  pathToFileURL("./"),
);
