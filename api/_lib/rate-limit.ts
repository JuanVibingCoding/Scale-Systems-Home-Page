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

export function getClientIp(req: { headers: Record<string, string | string[] | undefined>; socket: { remoteAddress?: string } }): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return req.socket.remoteAddress || 'unknown';
}
