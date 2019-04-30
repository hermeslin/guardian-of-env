import dotenv from 'dotenv';
import { isEqual } from 'lodash';

/**
 * compare env key name
 * @param {array} envs
 */
export default (envs) => {
  const baseEnv = envs.shift();
  const baseEnvObj = dotenv.parse(baseEnv.content);
  const baseEnvName = Object.keys(baseEnvObj);

  envs.forEach((env) => {
    const envObj = dotenv.parse(env.content);
    const envName = Object.keys(envObj);
    if (!isEqual(baseEnvName, envName)) {
      throw new Error(`${baseEnv.file} not equa to ${env.file}`);
    }
  });
  return true;
};
