import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { rateLimit, addRateLimitHeaders } from '@/lib/security/rate-limit';
import { addSecurityHeaders, addCacheHeaders } from '@/lib/security/headers';

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimit(request, { maxRequests: 60, windowMs: 15 * 60 * 1000 });
  if (rateLimitResponse) {
    return addSecurityHeaders(rateLimitResponse);
  }

  const user = await getUser();
  
  let response = NextResponse.json(user);
  response = addSecurityHeaders(response);
  response = addRateLimitHeaders(response, request, { maxRequests: 60, windowMs: 15 * 60 * 1000 });
  response = addCacheHeaders(response, { maxAge: 0, public: false });
  return response;
}
