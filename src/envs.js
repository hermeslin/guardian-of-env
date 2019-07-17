import fs from 'fs';
import dotenv from 'dotenv';
import isEqual from 'lodash.isequal';
import { diffArrays } from 'diff';
import EnvFilesNotEqualError from './errors/EnvFilesNotEqualError';

/**
 * Default env files
 */
export const defaultEnvFiles = ['.env', '.env.example'];

/**
 * Get env files absolute path
 *
 * @param {array} args
 */
export const list = (args = []) => {
  const envFiles = args.length > 0 ? args : defaultEnvFiles;

  return envFiles.map(envFile => `${process.cwd()}/${envFile}`);
};

/**
 * Read env files content
 *
 * @param {array} envList env files
 */
export const readFile = (envList) => {
  const envContent = envList.map(env => ({
    path: env,
    content: fs.readFileSync(env),
  }));

  return envContent;
};

/**
 * Compare env key name
 *
 * @param {array} envsFiles
 */
export const compare = ({ files }) => {
  const baseEnv = files.shift();
  const baseEnvObj = dotenv.parse(baseEnv.content);
  const baseEnvKeys = Object.keys(baseEnvObj);

  const fileRegexp = /.env((\.|-)?([a-z]+)?)+$/;
  const [baseFileName] = baseEnv.path.match(fileRegexp);
  const fileNames = [baseFileName];

  files.forEach(({ content, path }) => {
    const envObj = dotenv.parse(content);
    const envKeys = Object.keys(envObj);

    fileNames.push(path.match(fileRegexp)[0]);

    if (!isEqual(baseEnvKeys, envKeys)) {
      // extra info
      const payload = {
        fileNames,
        diffs: diffArrays(envKeys, baseEnvKeys),
      };

      throw new EnvFilesNotEqualError(`${baseEnv.path} not equal to ${path}`, payload);
    }
  });

  return true;
};
