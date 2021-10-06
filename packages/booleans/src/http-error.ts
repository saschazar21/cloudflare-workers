export type ErrorObject = {
  status: number;
  title: string;
};

class HTTPError extends Error implements Error {
  private _code: number;

  public name = 'HTTPError';

  public get code(): number {
    return this._code;
  }

  constructor(message: string, code: number) {
    super(message);
    this._code = code;
  }

  public toObject(): { errors: ErrorObject[] } {
    return {
      errors: [
        {
          status: this.code,
          title: this.message,
        },
      ],
    };
  }
}

export default HTTPError;
