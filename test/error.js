import { expect } from 'chai';
import EnvFilesNotEqualError from '../src/errors/EnvFilesNotEqualError';

describe('test env files not equal error', () => {
  it('should get instance of envFilesNotEqual', () => {
    const extraInfo = {
      anything: 'you want to pass through',
    };
    const error = new EnvFilesNotEqualError('oh yah~~', extraInfo);
    expect(error).to.be.an.instanceof(EnvFilesNotEqualError);
    expect(error.payload).to.deep.equal(extraInfo);
  });
});
