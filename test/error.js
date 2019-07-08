import { expect } from 'chai';
import EnvFilesNotEqualError from '../src/errors/EnvFilesNotEqualError';

describe('exception error test', () => {
  it('should get instance of envFilesNotEqual', () => {
    const extraInfo = {
      anything: 'you want to pass through',
    };
    const error = new EnvFilesNotEqualError('oh yah~~', extraInfo);

    expect(error).to.be.an.instanceof(Error);
    expect(error.payload).to.deep.equal(extraInfo);
  });

  it('should get instance of envFilesNotEqual with empty payload', () => {
    const error = new EnvFilesNotEqualError('oh yah~~');
    expect(error).to.be.an.instanceof(Error);
    expect(error.payload).to.deep.equal({});
  });
});
