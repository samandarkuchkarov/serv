import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;

    // Ignore Next.js HMR and static asset requests hitting the API by mistake
    if (originalUrl.startsWith('/_next/') || originalUrl.startsWith('/favicon')) {
      return next();
    }

    const start = Date.now();

    res.on('finish', () => {
      const ms = Date.now() - start;
      const { statusCode } = res;
      const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

      this.logger.log(level, `${method} ${originalUrl} ${statusCode} ${ms}ms`, {
        ip: req.headers['x-forwarded-for'] ?? ip,
      });
    });

    next();
  }
}
