import UrlPattern from 'url-pattern';

export interface RouteConfig {
  method?: METHOD;
  pattern: string;
  handler: (request: Request) => Response;
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
  private config: RouteConfig[] = [];

  private handle(config: RouteConfig): void {
    this.config.push(config);
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

  resolve(req: Request): RouteConfig | undefined {
    return this.config.find((config: RouteConfig): boolean => {
      const method = Method(config.method as METHOD);
      if (!method(req)) {
        return false;
      }

      const pattern = new UrlPattern(config.pattern);
      if (!pattern.match(req.url)) {
        return false;
      }

      return true;
    });
  }

  route(req: Request): Response {
    const route = this.resolve(req);

    if (!route?.handler) {
      return new Response(null, { status: 404 });
    }

    return route.handler(req);
  }
}
