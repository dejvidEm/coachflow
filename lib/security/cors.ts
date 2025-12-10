import { NextRequest, NextResponse } from 'next/server';

interface CorsOptions {
  origin?: string | string[] | boolean;
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
}

const defaultOptions: Required<CorsOptions> = {
  origin: process.env.NEXT_PUBLIC_APP_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

/**
 * CORS middleware for API routes
 */
export function cors(
  request: NextRequest,
  options: CorsOptions = {}
): NextResponse | null {
  const opts = { ...defaultOptions, ...options };
  const origin = request.headers.get('origin');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    addCorsHeaders(response, origin, opts);
    return response;
  }

  // Check origin if specified
  if (opts.origin !== '*' && origin) {
    const allowedOrigins = Array.isArray(opts.origin) 
      ? opts.origin 
      : [opts.origin];
    
    if (!allowedOrigins.includes(origin) && !allowedOrigins.includes('*')) {
      return NextResponse.json(
        { error: 'CORS policy violation' },
        { status: 403 }
      );
    }
  }

  return null; // Continue with request
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(
  response: NextResponse,
  origin: string | null,
  options: CorsOptions = {}
): void {
  const opts = { ...defaultOptions, ...options };
  
  if (opts.origin === '*' || !origin) {
    response.headers.set('Access-Control-Allow-Origin', '*');
  } else {
    const allowedOrigins = Array.isArray(opts.origin) 
      ? opts.origin 
      : [opts.origin];
    
    if (allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
  }

  response.headers.set(
    'Access-Control-Allow-Methods',
    opts.methods.join(', ')
  );
  
  response.headers.set(
    'Access-Control-Allow-Headers',
    opts.allowedHeaders.join(', ')
  );

  if (opts.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
}

