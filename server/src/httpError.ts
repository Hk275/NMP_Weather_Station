export default class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.status = status;

    // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.name = HttpError.name; // stack traces display correctly now
  }
}
