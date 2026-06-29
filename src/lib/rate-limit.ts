import { NextRequest } from 'next/server';

const store = new Map<string, { count: number; resetAt: number }>();

export function createRateLimiter(windowMs: number, maxRequests: number) {
  return function check(ip: string): boolean {
    const now = Date.now();
    const entry = store.get(ip);
    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return true;
    }
    entry.count++;
    return entry.count <= maxRequests;
  };
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}
