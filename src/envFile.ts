import dotenv from 'dotenv';

export interface EnvFile {
  name: string;
  keys: string[];
  duplicates: string[];
}

// Copy of the regex in dotenv's default parser (dist/index.cjs).
const LINE =
  /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;

export const scanKeys = (content: string): string[] =>
  [...content.replace(/\r\n?/g, '\n').matchAll(LINE)].map((match) => match[1]);

const repeated = (keys: string[]): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const key of keys) {
    if (seen.has(key)) duplicates.add(key);
    seen.add(key);
  }
  return [...duplicates];
};

export const parseEnvFile = (name: string, content: string): EnvFile => {
  const found = scanKeys(content);
  return {
    name,
    keys: Object.keys(dotenv.parse(content)).sort((a, b) => found.indexOf(a) - found.indexOf(b)),
    duplicates: repeated(found),
  };
};
