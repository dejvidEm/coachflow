import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, addRateLimitHeaders } from './rate-limit';
import { cors, addCorsHeaders } from './cors';
import { addSecurityHeaders, addCacheHeaders } from './headers';

interface ApiWrapperOptions {
  rateLimit?: {
    windowMs?: number;
    maxRequests?: number;
  };
  cors?: {
    origin?: string | string[] | boolean;
    methods?: string[];
    allowedHeaders?: string[];
    credentials?: boolean;
  };
  cache?: {
    maxAge?: number;
    staleWhileRevalidate?: number;
    public?: boolean;
  };
  requireAuth?: boolean;
}

/**
 * Wrapper function to add security, rate limiting, and CORS to API routes
 */
export function withSecurity<T = any>(
  handler: (request: NextRequest) => Promise<NextResponse<T>>,
  options: ApiWrapperOptions = {}
): (request: NextRequest) => Promise<NextResponse<T>> {
  return async (request: NextRequest): Promise<NextResponse<T>> => {
    // Handle CORS
    const corsResponse = cors(request, options.cors);
    if (corsResponse) {
      return addSecurityHeaders(corsResponse) as NextResponse<T>;
    }

    // Handle rate limiting
    const rateLimitResponse = rateLimit(request, options.rateLimit);
    if (rateLimitResponse) {
      return addSecurityHeaders(rateLimitResponse) as NextResponse<T>;
    }

    // Execute handler
    let response: NextResponse<T>;
    try {
      response = await handler(request);
    } catch (error: any) {
      // Type assertion needed because error response type doesn't match T
      response = NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
      ) as unknown as NextResponse<T>;
    }

    // Add security headers
    response = addSecurityHeaders(response);

    // Add CORS headers
    const origin = request.headers.get('origin');
    addCorsHeaders(response, origin, options.cors);

    // Add rate limit headers
    response = addRateLimitHeaders(response, request, options.rateLimit);

    // Add cache headers
    if (options.cache) {
      response = addCacheHeaders(response, options.cache);
    }

    return response;
  };
}

