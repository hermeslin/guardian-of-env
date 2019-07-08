import fs from 'fs';
import dotenv from 'dotenv';
import isEqual from 'lodash.isequal';
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
 * @param {boolean} strict
 */
export const compare = ({ strict, files }) => {
  const baseEnv = files.shift();
  const baseEnvObj = dotenv.parse(baseEnv.content);
  const baseEnvKeys = strict
    ? Object.keys(baseEnvObj)
    : Object.keys(baseEnvObj).sort();

  const fileRegexp = /.env((\.|-)?([a-z]+)?)+$/;
  const [baseFileName] = baseEnv.path.match(fileRegexp);
  const fileNames = [baseFileName];

  files.forEach(({ content, path }) => {
    const envObj = dotenv.parse(content);
    const envKeys = strict ? Object.keys(envObj) : Object.keys(envObj).sort();

    fileNames.push(path.match(fileRegexp)[0]);

    if (!isEqual(baseEnvKeys, envKeys)) {
      // extra info
      const payload = {
        fileNames,
        baseEnvKeys,
        envKeys,
      };

      throw new EnvFilesNotEqualError(`${baseEnv.path} not equal to ${path}`, payload);
    }
  });

  return true;
};
