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
}

export default HTTPError;
