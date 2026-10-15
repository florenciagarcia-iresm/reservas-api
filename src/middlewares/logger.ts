import { RequestHandler } from 'express';

export const logger: RequestHandler = (req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    res.on('finish', () => {
      console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl} -> ${res.statusCode}`);
    });
  }
  next();
};