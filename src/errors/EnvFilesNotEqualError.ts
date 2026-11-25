import type { DrawPayload } from '../tableDrawer.js';

export default class EnvFilesNotEqualError extends Error {
  readonly payload: DrawPayload;

  constructor(message: string, payload: DrawPayload) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.payload = payload;
  }
}
