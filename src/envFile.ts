import dotenv from 'dotenv';

export interface EnvFile {
  name: string;
  keys: string[];
  duplicates: string[];
}

// Mirrors the default LINE regex of dotenv's parser in dist/index.cjs.
const LINE =
  /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;

const findDuplicates = (content: string): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const match of content.replace(/\r\n?/g, '\n').matchAll(LINE)) {
    const key = match[1];
    if (seen.has(key)) duplicates.add(key);
    seen.add(key);
  }
  return [...duplicates];
};

export const parseEnvFile = (name: string, content: string): EnvFile => ({
  name,
  keys: Object.keys(dotenv.parse(content)),
  duplicates: findDuplicates(content),
});
