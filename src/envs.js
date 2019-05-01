import fs from 'fs';
import dotenv from 'dotenv';
import { isEqual } from 'lodash';

/**
 * default env files
 */
export const defaultEnvFiles = () => ([
  '.env', '.env.example',
]);

/**
 * get env files absolute path
 * @param {array} args
 */
export const list = (args = []) => {
  const envFiles = (args.length > 0) ? args : defaultEnvFiles();
  return envFiles.map(envFile => (`${process.cwd()}/${envFile}`));
};

/**
 * read env files content
 * @param {array} envList env files
 */
export const readFile = (envList = []) => {
  const envContent = envList.map(env => ({
    path: env,
    content: fs.readFileSync(env),
  }));
  return envContent;
};

/**
 * compare env key name
 * @param {array} envsFiles
 * @param {boolean} isStrict
 */
export const compare = (envsFiles, isStrict = false) => {
  const baseEnv = envsFiles.shift();
  const baseEnvObj = dotenv.parse(baseEnv.content);
  const baseEnvName = (isStrict) ? Object.keys(baseEnvObj) : Object.keys(baseEnvObj).sort();

  envsFiles.forEach((envFile) => {
    const envObj = dotenv.parse(envFile.content);
    const envName = (isStrict) ? Object.keys(envObj) : Object.keys(envObj).sort();
    if (!isEqual(baseEnvName, envName)) {
      throw new Error(`${baseEnv.path} not equal to ${envFile.path}`);
    }
  });
  return true;
};
