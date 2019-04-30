import fs from 'fs';

/**
 * get env files absolute path
 * @param {array} args
 */
export const list = (args = []) => {
  const defaultEnvFiles = [
    '.env', '.env.example',
  ];

  const envFiles = (args.length > 0) ? args : defaultEnvFiles;
  return envFiles.map(envFile => (`${process.cwd()}/${envFile}`));
};

/**
 * read env files content
 * @param {array} envList env files
 */
export const readFile = (envList = []) => {
  const envContent = envList.map(env => ({
    file: env,
    content: fs.readFileSync(env),
  }));
  return envContent;
};
