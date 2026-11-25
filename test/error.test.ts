import { describe, expect, it } from 'vitest';
import EnvFilesNotEqualError from '../src/errors/EnvFilesNotEqualError.js';

describe('EnvFilesNotEqualError', () => {
  it('is an Error that carries the payload', () => {
    const payload = { anything: 'you want to pass through' };
    const error = new EnvFilesNotEqualError('keys differ', payload);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('EnvFilesNotEqualError');
    expect(error.message).toBe('keys differ');
    expect(error.payload).toEqual(payload);
  });

  it('defaults the payload to an empty object', () => {
    expect(new EnvFilesNotEqualError('keys differ').payload).toEqual({});
  });
});
