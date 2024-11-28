import { Request, Response, NextFunction } from 'express';

const RATE_LIMIT = {
  windowMs: 60 * 1000,
  maxRequests: 20,
  requests: new Map<string, number>(),
  resetTime: new Map<string, number>()
};

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip;
  const now = Date.now();

  if (!RATE_LIMIT.requests.has(ip)) {
    RATE_LIMIT.requests.set(ip, 1);
    RATE_LIMIT.resetTime.set(ip, now + RATE_LIMIT.windowMs);
  } else {
    if (now > (RATE_LIMIT.resetTime.get(ip) || 0)) {
      RATE_LIMIT.requests.set(ip, 1);
      RATE_LIMIT.resetTime.set(ip, now + RATE_LIMIT.windowMs);
    } else {
      const requests = RATE_LIMIT.requests.get(ip) || 0;
      if (requests >= RATE_LIMIT.maxRequests) {
        return res.status(429).json({ error: 'Trop de requêtes, veuillez réessayer plus tard' });
      }
      RATE_LIMIT.requests.set(ip, requests + 1);
    }
  }
  next();
}