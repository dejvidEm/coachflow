# PDF URL Security Analysis

## ⚠️ **SECURITY RISK IDENTIFIED**

### Current Situation

**PDF URLs are exposed in API responses:**
- `/api/clients` - Returns all clients with `mealPdf` and `trainingPdf` URLs
- `/api/clients/[id]` - Returns client with full PDF URLs

**Buckets are PUBLIC:**
- `meal_pdf` bucket is public
- `training_pdf` bucket is public
- Anyone with the URL can access PDFs directly

**Predictable filenames:**
- Format: `meal-plan-${clientId}.pdf`
- Format: `training-plan-${clientId}.pdf`

### Security Risks

1. **URL Exposure**: PDF URLs are returned in API responses
   - If someone is authenticated, they can see URLs for their clients
   - URLs are visible in browser DevTools, network requests, etc.

2. **URL Guessing**: If someone knows:
   - Your Supabase project URL
   - A client ID pattern
   - They could potentially guess other client PDF URLs

3. **Direct Access**: Since buckets are public:
   - Knowing the URL = direct access to PDF
   - No additional authentication required

4. **Client ID Enumeration**: 
   - Client IDs are sequential numbers
   - If someone knows one client ID, they could try others

### Current Protections ✅

1. **Authentication Required**: All API routes require `requirePaidSubscription()`
2. **User Filtering**: All queries filter by `user_id` - users only see their own clients
3. **Proxy Routes**: PDF viewing goes through proxy routes (`/api/clients/[id]/meal-plan/view`)
4. **Access Control**: `getClientById` verifies ownership before returning data

### Recommendations

#### Option 1: Don't Return URLs in API (RECOMMENDED)

Remove PDF URLs from API responses and only use proxy routes:

```typescript
// Instead of returning full URLs, only return flags
const clientResponse = {
  ...client,
  mealPdf: undefined,  // Don't expose URL
  trainingPdf: undefined,  // Don't expose URL
  hasMealPdf: !!client.mealPdf,
  hasTrainingPdf: !!client.trainingPdf,
};
```

**Pros:**
- URLs never exposed to client
- Users must use authenticated proxy routes
- More secure

**Cons:**
- Requires using proxy routes for all PDF access
- Slightly more complex

#### Option 2: Use Private Buckets with Signed URLs

Make buckets private and generate time-limited signed URLs:

**Pros:**
- Most secure option
- URLs expire after a set time
- No direct access possible

**Cons:**
- Requires code changes
- More complex implementation
- URLs still exposed (but time-limited)

#### Option 3: Add Random Filenames

Instead of `meal-plan-${clientId}.pdf`, use random UUIDs:

**Pros:**
- Harder to guess URLs
- Still works with public buckets

**Cons:**
- URLs still exposed in API
- Doesn't solve the root issue

### Current Risk Level

**MEDIUM-HIGH** ⚠️

- If someone is authenticated and has access to a client, they can see PDF URLs
- If they know the URL pattern, they could try to guess other client IDs
- Since buckets are public, direct access is possible

However:
- They still need to be authenticated to get client data
- They can only see their own clients (filtered by `user_id`)
- Client IDs are not easily enumerable without authentication

### Immediate Action Required

**I recommend Option 1** - Remove URLs from API responses and use only proxy routes. This is the simplest and most effective fix.
