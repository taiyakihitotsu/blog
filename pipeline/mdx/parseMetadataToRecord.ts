export const parseMetadataToRecord = (rawText: string) => {
  const metadata: Record<string, string> = {};
  const lines = rawText.split(/\n/).filter((s) => s.trim() !== "");

  for (const line of lines) {
    const match = line.match(/^([a-zA-Z]+):[ \t]*(.*)/);
    if (match) {
      const [_, key, value] = match;
      if (key !== undefined && value !== undefined) {
        metadata[key.toLowerCase()] = value.replace(/^['"]|['"]$/g, "").trim();
      }
    }
  }
  return metadata;
};
