import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (for production, consider Redis)
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds
  maxRequests?: number; // Maximum requests per window
}

const defaultOptions: Required<RateLimitOptions> = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
};

/**
 * Rate limiting middleware for API routes
 * @param request - Next.js request object
 * @param options - Rate limit configuration
 * @returns NextResponse with rate limit headers or null if within limit
 */
export function rateLimit(
  request: NextRequest,
  options: RateLimitOptions = {}
): NextResponse | null {
  const opts = { ...defaultOptions, ...options };
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const key = `rate-limit:${ip}`;
  const now = Date.now();

  // Get or create rate limit entry
  let entry = store[key];
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + opts.windowMs,
    };
    store[key] = entry;
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > opts.maxRequests) {
    const response = NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      { status: 429 }
    );
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', opts.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', '0');
    response.headers.set('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
    response.headers.set('Retry-After', Math.ceil((entry.resetTime - now) / 1000).toString());
    
    return response;
  }

  // Add rate limit headers for successful requests
  const remaining = Math.max(0, opts.maxRequests - entry.count);
  return null; // No rate limit exceeded, continue
}

/**
 * Wrapper function to add rate limit headers to response
 */
export function addRateLimitHeaders<T = unknown>(
  response: NextResponse<T>,
  request: NextRequest,
  options: RateLimitOptions = {}
): NextResponse<T> {
  const opts = { ...defaultOptions, ...options };
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const key = `rate-limit:${ip}`;
  const entry = store[key];

  if (entry) {
    const remaining = Math.max(0, opts.maxRequests - entry.count);
    response.headers.set('X-RateLimit-Limit', opts.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
  }

  return response;
}

