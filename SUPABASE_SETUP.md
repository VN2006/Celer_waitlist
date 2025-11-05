# Supabase Setup Guide for Waitlist

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Project name: `Celer Waitlist` (or any name you prefer)
   - Database password: (save this securely!)
   - Region: Choose closest to your users
4. Wait for the project to be created (takes ~2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role key** (this is your `SUPABASE_SERVICE_ROLE_KEY` - keep this secret!)
     - ⚠️ **Important**: The service_role key bypasses Row Level Security. Never expose it to the client!

## Step 3: Create the Waitlist Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Run this SQL to create the `waitlist` table:

```sql
-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserts (for public signups via waitlist form)
CREATE POLICY "Allow public inserts" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

4. Click **Run** to execute the SQL

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
ADMIN_TOKEN=your-secure-admin-token-here
```

3. Replace the placeholders with your actual values from Step 2
4. For `SUPABASE_SERVICE_ROLE_KEY`, use the service_role key from Supabase (Settings → API)
5. For `ADMIN_TOKEN`, create a secure random string (you'll use this to access the admin page)
6. **Important**: Never commit `.env.local` to git - it contains sensitive keys!

## Step 5: Restart Your Development Server

After adding the environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

## Step 6: Test the Waitlist

1. Go to `http://localhost:3000`
2. Scroll to the waitlist form
3. Enter an email and submit
4. Check your Supabase dashboard → **Table Editor** → `waitlist` table
5. You should see your email entry!

## Accessing the Admin Page

The admin page is at `/admin` but requires authentication. The admin API route expects a Bearer token in the Authorization header.

You have a few options:

### Option 1: Update the Admin Page to Include Auth
Modify `/app/admin/page.tsx` to include an authentication form or store the token.

### Option 2: Use Browser DevTools (for testing)
1. Open your browser's developer console (F12)
2. Go to the Console tab
3. Run this JavaScript to set the authorization header:
```javascript
fetch('/api/admin/emails', {
  headers: { 'Authorization': 'Bearer your-admin-token-here' }
}).then(r => r.json()).then(console.log)
```

### Option 3: Temporarily Disable Auth (NOT for production)
For local testing only, you can comment out the auth check in `/app/api/admin/emails/route.ts`

## Troubleshooting

### "Failed to save email" error
- Check that your Supabase URL and anon key are correct in `.env.local`
- Verify the `waitlist` table exists in your Supabase dashboard
- Check the Supabase logs in the dashboard for errors

### "Unauthorized" when accessing admin
- Make sure you're sending the correct `ADMIN_TOKEN` in the Authorization header
- Or temporarily disable the auth check in `/app/api/admin/emails/route.ts`

### Emails not appearing in Supabase
- Check the browser console for errors
- Check the terminal where your dev server is running for errors
- Verify RLS policies are set up correctly (Step 3)

