import { describe, expect, it } from 'vitest';
import EnvFilesNotEqualError from '../src/errors/EnvFilesNotEqualError.js';

describe('EnvFilesNotEqualError', () => {
  it('is an Error that carries the key table payload', () => {
    const payload = { fileNames: ['.env', '.env.example'], diffs: [] };
    const error = new EnvFilesNotEqualError('keys differ', payload);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('EnvFilesNotEqualError');
    expect(error.message).toBe('keys differ');
    expect(error.payload).toEqual(payload);
  });
});
