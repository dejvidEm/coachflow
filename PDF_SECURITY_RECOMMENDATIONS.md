# PDF URL Security - Current Risk & Recommendations

## ⚠️ **SECURITY RISK IDENTIFIED**

### Current Situation

**Yes, there is a potential security risk:**

1. **PDF URLs are exposed in API responses:**
   - `/api/clients` returns all clients with `mealPdf` and `trainingPdf` URLs
   - `/api/clients/[id]` returns client with full PDF URLs
   - URLs are visible in browser DevTools, network requests, etc.

2. **Buckets are PUBLIC:**
   - `meal_pdf` and `training_pdf` buckets are public
   - Anyone with the URL can access PDFs directly from Supabase Storage

3. **Predictable filenames:**
   - Format: `meal-plan-${clientId}.pdf`
   - Format: `training-plan-${clientId}.pdf`
   - If someone knows a client ID, they could guess the filename

### Current Protections ✅

1. **Authentication Required**: All API routes require `requirePaidSubscription()`
2. **User Filtering**: All database queries filter by `user_id`
   - Users can only see their own clients
   - `getClientById(clientId, user.id)` verifies ownership
3. **Access Control**: Client IDs are not easily enumerable without authentication

### Risk Assessment

**Risk Level: MEDIUM** ⚠️

**Attack Scenarios:**

1. **Authenticated User Attack:**
   - User A is authenticated and has access to Client #5
   - They see the PDF URL: `https://[project].supabase.co/storage/v1/object/public/meal_pdf/meal-plan-5.pdf`
   - They could try: `meal-plan-6.pdf`, `meal-plan-7.pdf`, etc.
   - **BUT**: They still need to know other client IDs (which are filtered by user_id)

2. **URL Sharing:**
   - If someone shares a PDF URL, anyone with that URL can access it
   - URLs don't expire
   - No additional authentication required

3. **Client ID Enumeration:**
   - Client IDs are sequential (1, 2, 3, ...)
   - If someone knows one client ID, they could try others
   - **BUT**: They can't access other users' clients through the API (filtered by user_id)

### Recommendations

#### Option 1: Remove URLs from API Responses (RECOMMENDED - Easiest)

**Don't return PDF URLs in API responses.** Only use proxy routes:

```typescript
// In app/api/clients/[id]/route.ts
const clientResponse = {
  ...client,
  mealPdf: undefined,  // Don't expose URL
  trainingPdf: undefined,  // Don't expose URL
  hasMealPdf: !!client.mealPdf,
  hasTrainingPdf: !!client.trainingPdf,
};
```

**Then update client component to use proxy routes only:**
- Download: Use `/api/clients/${clientId}/meal-plan/download`
- Copy Link: Use `/api/clients/${clientId}/meal-plan/view` (or download)
- Preview: Already uses proxy route ✅

**Pros:**
- ✅ URLs never exposed to client
- ✅ All access goes through authenticated routes
- ✅ Simple to implement
- ✅ No bucket changes needed

**Cons:**
- ⚠️ Requires updating client component
- ⚠️ "Copy Link" would copy proxy URL instead of direct URL

#### Option 2: Use Private Buckets with Signed URLs (MOST SECURE)

Make buckets **private** and generate time-limited signed URLs:

1. Change buckets to private in Supabase
2. Generate signed URLs server-side with expiration
3. URLs expire after set time (e.g., 1 hour)

**Pros:**
- ✅ Most secure option
- ✅ URLs expire automatically
- ✅ No direct access possible

**Cons:**
- ⚠️ Requires significant code changes
- ⚠️ More complex implementation
- ⚠️ URLs still exposed (but time-limited)

#### Option 3: Use Random/UUID Filenames (Partial Fix)

Instead of `meal-plan-${clientId}.pdf`, use UUIDs:

```typescript
const filename = `meal-plan-${crypto.randomUUID()}.pdf`;
```

**Pros:**
- ✅ Harder to guess URLs
- ✅ Still works with public buckets

**Cons:**
- ⚠️ URLs still exposed in API
- ⚠️ Doesn't solve the root issue
- ⚠️ Need to track filename in database

### My Recommendation

**Use Option 1** - Remove URLs from API responses and use proxy routes only.

This is:
- ✅ Easiest to implement
- ✅ Most effective security improvement
- ✅ No infrastructure changes needed
- ✅ Maintains all functionality

### Implementation Steps

1. Remove `mealPdf` and `trainingPdf` from API responses
2. Update client component to use proxy routes for download/copy
3. Keep preview using proxy route (already done ✅)

Would you like me to implement Option 1?
