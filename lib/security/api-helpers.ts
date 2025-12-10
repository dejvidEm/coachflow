import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, addRateLimitHeaders } from './rate-limit';
import { addSecurityHeaders, addCacheHeaders } from './headers';

/**
 * Helper to wrap API route handlers with security features
 */
export async function secureApiRoute<T = any>(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse<T>>,
  options: {
    rateLimit?: { maxRequests?: number; windowMs?: number };
    cache?: { maxAge?: number; staleWhileRevalidate?: number; public?: boolean };
  } = {}
): Promise<NextResponse<T>> {
  // Apply rate limiting
  const rateLimitResponse = rateLimit(
    request,
    options.rateLimit || { maxRequests: 60, windowMs: 15 * 60 * 1000 }
  );
  if (rateLimitResponse) {
    return addSecurityHeaders(rateLimitResponse) as NextResponse<T>;
  }

  // Execute handler
  let response: NextResponse<T>;
  try {
    response = await handler(request);
  } catch (error: any) {
    response = NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    ) as NextResponse<T>;
  }

  // Add security headers
  response = addSecurityHeaders(response);

  // Add rate limit headers
  response = addRateLimitHeaders(
    response,
    request,
    options.rateLimit || { maxRequests: 60, windowMs: 15 * 60 * 1000 }
  );

  // Add cache headers if specified
  if (options.cache) {
    response = addCacheHeaders(response, options.cache);
  }

  return response;
}

