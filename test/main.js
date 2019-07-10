import { expect } from 'chai';
import execa from 'execa';

describe('main test', () => {
  it('should get correct result', async () => {
    const { stdout } = await execa('npx', [
      'babel-node', '--presets', '@babel/preset-env',
      './src/main.js', './test/.env.base', './test/.env.the.same',
    ]);

    expect(stdout).to.equal('.env files all the same!');
  });

  it('should get exitcode 1', async () => {
    try {
      await execa('npx', [
        'babel-node', '--presets', '@babel/preset-env',
        './src/main.js', './test/.env.base', './test/.env.not.the.same',
      ]);
    } catch (error) {
      expect(error.exitCode).to.equal(1);
    }
  });
});
