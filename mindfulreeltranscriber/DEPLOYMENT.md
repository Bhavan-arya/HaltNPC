# Deployment Instructions for MindfulReelTranscriber

## Prerequisites

Before deploying, ensure you have:

1. A Supabase project set up with the required database tables
2. A Speech-to-Text API key (e.g., AssemblyAI, Deepgram, etc.)
3. A GitHub repository for your code
4. A Vercel account

## Database Setup

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Note your Project URL and `anon` public key from the API settings

### 2. Set Up Database Tables

Run the following SQL commands in your Supabase SQL editor:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  website text,
  constraint username_length check (char_length(username) >= 3)
);

-- Create transcriptions table
create table transcriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  video_url text not null,
  full_transcription text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table transcriptions enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create policies for transcriptions
create policy "Users can view own transcriptions." on transcriptions
  for select using (auth.uid() = user_id);

create policy "Users can insert own transcriptions." on transcriptions
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own transcriptions." on transcriptions
  for delete using (auth.uid() = user_id);
```

### 3. Configure Authentication

1. In your Supabase project, go to Authentication > Settings
2. Set up your site URL (e.g., `https://your-app.vercel.app`)
3. Add redirect URLs for authentication callbacks:
   - `https://your-app.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local development)

## Vercel Deployment

### Method 1: Automatic Deployment (Recommended)

1. **Push to GitHub**: Ensure your code is in a GitHub repository

2. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Environment Variables**:
   During import or in Project Settings → Environment Variables, add:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   STT_API_KEY=your-stt-api-key-here
   ```

4. **Deploy**: Vercel will automatically build and deploy your application

### Method 2: Manual Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add STT_API_KEY
   ```

## Post-Deployment Steps

1. **Update Supabase Settings**:
   - Add your Vercel domain to the allowed origins in Supabase
   - Update authentication redirect URLs

2. **Test the Application**:
   - Visit your deployed URL
   - Test user registration and login
   - Test video transcription functionality

3. **Monitor**:
   - Check Vercel function logs for any errors
   - Monitor Supabase usage and performance

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...` |
| `STT_API_KEY` | Speech-to-Text service API key | Your STT provider's API key |

## Troubleshooting

### Common Issues

1. **Authentication not working**:
   - Check that redirect URLs are correctly configured in Supabase
   - Verify environment variables are set correctly

2. **Database connection errors**:
   - Ensure RLS policies are correctly configured
   - Check that the service role key has proper permissions

3. **Transcription API errors**:
   - Verify your STT API key is valid and has sufficient credits
   - Check API rate limits and quotas

4. **Build failures**:
   - Ensure all dependencies are properly installed
   - Check for TypeScript errors in the build logs

### Getting Help

- Check Vercel deployment logs for detailed error messages
- Review Supabase logs for database-related issues
- Ensure all environment variables are properly set and accessible

## Security Considerations

1. **Never commit sensitive keys** to your repository
2. **Use environment variables** for all API keys and secrets
3. **Enable RLS** on all Supabase tables
4. **Regularly rotate** API keys and access tokens
5. **Monitor usage** to detect any unusual activity

## Performance Optimization

1. **Enable caching** for static assets
2. **Optimize images** and media files
3. **Monitor function execution times** and optimize as needed
4. **Use CDN** for global content delivery
5. **Implement proper error handling** and retry logic

