import { expect } from 'chai';
import sinon from 'sinon';
import * as guardian from '../src/guardian';
import * as envs from '../src/envs';
import * as tableDrawer from '../src/tableDrawer';
import EnvFilesNotEqualError from '../src/errors/EnvFilesNotEqualError';

describe('guardian test', () => {
  let sinonSandbox;

  beforeEach(() => {
    // Create a sandbox for the test
    sinonSandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sinonSandbox.restore();
  });

  it('should get collorful string', () => {
    const highlightFile = guardian.highlightFile('THIS IS SPARTA!');
    expect(highlightFile).to.equal('\u001b[32mTHIS IS SPARTA!\u001b[39m');
  });

  it('should parse the correct argements', () => {
    const envsMock = sinonSandbox.mock(envs);
    envsMock.expects('list').once().withExactArgs([
      '.env',
      '.env.example',
    ]).returns([
      '.env-real-path',
      '.env.example-real-path',
    ]);

    envsMock.expects('readFile').once().withExactArgs([
      '.env-real-path',
      '.env.example-real-path',
    ]).returns([
      '.env-content',
      '.env.example-content',
    ]);

    const args = [
      '--strict',
      '.env',
      '.env.example',
    ];

    const envArgs = guardian.parseArgs(args);
    expect(envArgs).to.deep.equal({
      args: ['.env', '.env.example'],
      strict: true,
      files: ['.env-content', '.env.example-content'],
    });

    envsMock.verify();
  });

  it('should get `the same` compare result', () => {
    const envsMock = sinonSandbox.mock(envs);
    envsMock.expects('compare').once().withExactArgs({
      strict: true,
      files: ['.env-content', '.env.example-content'],
    }).returns(true);

    const parsedArgs = {
      args: ['.env', '.env.example'],
      strict: true,
      files: ['.env-content', '.env.example-content'],
    };

    const result = guardian.startCompare(parsedArgs);
    expect(result).to.deep.equal({
      same: true,
      messages: [
        '.env files all the same!',
      ],
    });

    envsMock.verify();
  });

  it('should get `EnvFilesNotEqualError` compare result', () => {
    const envsMock = sinonSandbox.mock(envs);
    envsMock.expects('compare').once().withExactArgs({
      strict: true,
      files: ['.env-content', '.env.example-content'],
    }).throws(new EnvFilesNotEqualError('oops', { payload: 'THIS IS SPARTA!' }));

    const tableDrawerMock = sinonSandbox.mock(tableDrawer);
    tableDrawerMock.expects('draw').once().withExactArgs({
      payload: 'THIS IS SPARTA!',
    }).returns('THIS IS SPARTA TOO!');

    const parsedArgs = {
      args: [],
      strict: true,
      files: ['.env-content', '.env.example-content'],
    };

    const result = guardian.startCompare(parsedArgs);
    expect(result).to.deep.equal({
      same: false,
      messages: [
        `${guardian.highlightFile(['.env', '.env.example'].join(' '))} not the same`,
        'THIS IS SPARTA TOO!',
      ],
    });

    envsMock.verify();
  });

  it('should throw error when other exceptions happened', () => {
    const envsMock = sinonSandbox.mock(envs);
    envsMock.expects('compare').once().withExactArgs({
      strict: true,
      files: ['.env-content', '.env.example-content'],
    }).throws(new Error('oooooops'));


    const parsedArgs = {
      args: ['.env', '.env.example'],
      strict: true,
      files: ['.env-content', '.env.example-content'],
    };

    expect(() => guardian.startCompare(parsedArgs)).to.throw('oooooops');
  });
});
