import path from 'path';
import { expect } from 'chai';
import { StringDecoder } from 'string_decoder';
import * as envs from '../src/envs';

describe('guardian of env test', () => {
  const cwd = process.cwd();

  it('should let user set their own env file list', () => {
    const envList = envs.list(['.env.krkr']);
    expect(envList[0]).to.equal(`${cwd}/.env.krkr`);

    const envListA = envs.list(['.env.krkr', '.env']);
    expect(envListA[0]).to.equal(`${cwd}/.env.krkr`);
    expect(envListA[1]).to.equal(`${cwd}/.env`);
  });

  it('should use default env file list', () => {
    const envList = envs.list();
    expect(envList[0]).to.equal(`${cwd}/.env`);
    expect(envList[1]).to.equal(`${cwd}/.env.example`);
  });

  it('sould get env content', () => {
    const envFiles = [
      path.resolve(cwd, 'test/.env.base'),
      path.resolve(cwd, 'test/.env.not.the.same'),
      path.resolve(cwd, 'test/.env.the.same'),
    ];
    const envReadFiles = envs.readFile(envFiles);
    const decoder = new StringDecoder('utf8');

    expect(decoder.write(envReadFiles[0].content)).to.equal('AA=A');
    expect(decoder.write(envReadFiles[1].content)).to.equal('BB=B');
    expect(decoder.write(envReadFiles[2].content)).to.equal('AA=A');
  });

  it('sould throw error when env key name not equal', () => {
    const envFiles = [
      path.resolve(cwd, 'test/.env.base'),
      path.resolve(cwd, 'test/.env.not.the.same'),
    ];
    const envReadFiles = envs.readFile(envFiles);
    expect(() => envs.compare(envReadFiles)).to.throw(`${envFiles[0]} not equal to ${envFiles[1]}`);

    // test multiple line
    const envFilesA = [
      path.resolve(cwd, 'test/.env.multiple'),
      path.resolve(cwd, 'test/.env.multiple.not.the.same'),
    ];
    const envReadFilesA = envs.readFile(envFilesA);
    expect(() => envs.compare(envReadFilesA)).to.throw(`${envFilesA[0]} not equal to ${envFilesA[1]}`);
  });

  it('sould not throw error', () => {
    const envFiles = [
      path.resolve(cwd, 'test/.env.base'),
      path.resolve(cwd, 'test/.env.the.same'),
    ];
    const envReadFiles = envs.readFile(envFiles);
    expect(envs.compare(envReadFiles)).to.equal(true);

    // test multiple line
    const envFilesA = [
      path.resolve(cwd, 'test/.env.multiple'),
      path.resolve(cwd, 'test/.env.multiple.the.same'),
    ];
    const envReadFilesA = envs.readFile(envFilesA);
    expect(envs.compare(envReadFilesA)).to.equal(true);

    // test multiple line different sort
    const envFilesB = [
      path.resolve(cwd, 'test/.env.multiple'),
      path.resolve(cwd, 'test/.env.multiple.the.same.different.sort'),
    ];
    const envReadFilesB = envs.readFile(envFilesB);
    expect(envs.compare(envReadFilesB)).to.equal(true);
  });

  it('should throw error when mode is `strict`', () => {
    const envFiles = [
      path.resolve(cwd, 'test/.env.multiple'),
      path.resolve(cwd, 'test/.env.multiple.the.same.different.sort'),
    ];
    const envReadFiles = envs.readFile(envFiles);
    expect(() => envs.compare(envReadFiles, true)).to.throw(`${envFiles[0]} not equal to ${envFiles[1]}`);
  });
});
