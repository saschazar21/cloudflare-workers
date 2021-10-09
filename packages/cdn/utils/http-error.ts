class HTTPError extends Error implements Error {
  private _name = 'HTTPError';
  private _status = 500;

  public get name(): string {
    return this._name;
  }

  public get status(): number {
    return this._status;
  }

  constructor(message: string, status?: number) {
    super(message);

    this._status = status || this._status;
  }

  public response(): Response {
    return new Response(this.message, { status: this.status });
  }
}

export default HTTPError;
