import { Express, Request, Response, NextFunction } from 'express';

module.exports = function (app: Express) {
  app.use(function (_req: Request, res: Response, next: NextFunction) {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });
};
