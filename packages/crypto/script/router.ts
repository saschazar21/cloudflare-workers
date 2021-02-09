import UrlPattern from 'url-pattern';

export interface StringObject {
  [key: string]: string;
}

export interface RouteConfig {
  method?: METHOD;
  pattern: string;
  handler: (match: StringObject, req?: Request) => Promise<Response>;
}

enum METHOD {
  GET = 'get',
  HEAD = 'head',
  OPTIONS = 'options',
  POST = 'post',
}

const Method = (method: METHOD) => (req: Request) =>
  req.method.toLowerCase() === method;

export class Router {
  private config: RouteConfig[];

  constructor() {
    this.config = [];
  }

  private handle(config: RouteConfig): void {
    this.config.push(config);
  }

  private resolve(req: Request): RouteConfig | undefined {
    const url = new URL(req.url).pathname;

    return this.config.find((config: RouteConfig): boolean => {
      const method = Method(config.method as METHOD);
      if (!method(req)) {
        return false;
      }

      const pattern = new UrlPattern(config.pattern);
      if (!pattern.match(url)) {
        return false;
      }

      return true;
    });
  }

  get(config: RouteConfig): void {
    return this.handle({ ...config, method: METHOD.GET });
  }

  head(config: RouteConfig): void {
    return this.handle({ ...config, method: METHOD.HEAD });
  }

  options(config: RouteConfig): void {
    return this.handle({ ...config, method: METHOD.OPTIONS });
  }

  post(config: RouteConfig): void {
    return this.handle({ ...config, method: METHOD.POST });
  }

  route(req: Request): Response | Promise<Response> {
    const url = new URL(req.url).pathname;
    const { pattern, handler } = this.resolve(req) || {};

    if (!handler) {
      return new Response(null, { status: 404 });
    }

    const match = new UrlPattern(pattern as string).match(url);

    return handler(match, req);
  }
}
