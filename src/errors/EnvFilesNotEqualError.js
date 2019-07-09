export default class EnvFilesNotEqualError extends Error {
  constructor(message, payload) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.payload = payload || {};
  }
}
