import fs from 'node:fs';
import { diffArrays } from 'diff';
import dotenv from 'dotenv';
import isEqual from 'lodash.isequal';
import EnvFilesNotEqualError from './errors/EnvFilesNotEqualError.js';

export interface EnvFile {
  path: string;
  content: Buffer | string;
}

export const defaultEnvFiles = ['.env', '.env.example'];

export const list = (args: string[] = []): string[] => {
  const envFiles = args.length > 0 ? args : defaultEnvFiles;

  return envFiles.map((envFile) => `${process.cwd()}/${envFile}`);
};

export const readFile = (envList: string[]): EnvFile[] =>
  envList.map((env) => ({
    path: env,
    content: fs.readFileSync(env),
  }));

export const compare = ({ files }: { files: EnvFile[] }): true => {
  const [baseEnv, ...otherEnvs] = files;
  const baseEnvObj = dotenv.parse(baseEnv.content);
  const baseEnvKeys = Object.keys(baseEnvObj);

  const fileRegexp = /.env((\.|-)?([a-z]+)?)+$/;
  const [baseFileName] = baseEnv.path.match(fileRegexp)!;
  const fileNames = [baseFileName];

  otherEnvs.forEach(({ content, path }) => {
    const envObj = dotenv.parse(content);
    const envKeys = Object.keys(envObj);

    fileNames.push(path.match(fileRegexp)![0]);

    if (!isEqual(baseEnvKeys, envKeys)) {
      throw new EnvFilesNotEqualError(`${baseEnv.path} not equal to ${path}`, {
        fileNames,
        diffs: diffArrays(envKeys, baseEnvKeys),
      });
    }
  });

  return true;
};
