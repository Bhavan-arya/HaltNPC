# MindfulReelTranscriber MVP

## Project Overview

This project is an MVP (Minimum Viable Product) for the "Mindful Reel Transcriber" application. Its primary goal is to help users consume video content, specifically short videos like Instagram Reels or YouTube Shorts, through transcription. This approach promotes mindful usage and aims to reduce excessive visual screen time by allowing users to primarily engage with the textual content of videos.

## Core Functionality

The application provides the following core features:

1.  **Video URL Input**: Users can paste a publicly accessible video URL into an input field.
2.  **Scroll Limit/Timer**: Users can specify a desired number of "scrolls" or a time limit for viewing the transcription, acting as an addiction-breaking mechanism.
3.  **Transcription Process**: The backend transcribes the audio from the provided video URL using a Speech-to-Text (STT) API.
4.  **Formatted Transcription Display**: The full transcription is formatted into "tweet-like" text snippets and presented in a scrollable text feed.
5.  **User Interaction**: Users can click on a snippet to view the original video or share the transcription.
6.  **User Authentication**: Powered by Supabase, users can sign up, log in, and manage their profiles.
7.  **Transcription History**: Users' transcribed videos and transcriptions can be stored and retrieved.

## Technical Stack

-   **Frontend & Backend Framework**: Next.js (TypeScript)
-   **Frontend Components**: React
-   **Backend Logic**: Next.js API Routes (Serverless Functions)
-   **Authentication & Database**: Supabase (PostgreSQL)
-   **Speech-to-Text (STT) Service**: Placeholder for an external STT API (e.g., AssemblyAI, Deepgram, Google Cloud Speech-to-Text, AWS Transcribe)
-   **Deployment Target**: Vercel

## Project Setup

Follow these steps to set up and run the MindfulReelTranscriber MVP locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mindfulreeltranscriber.git
cd mindfulreeltranscriber
```

*(Note: Replace `https://github.com/your-username/mindfulreeltranscriber.git` with the actual repository URL once it's set up.)*

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root of your project based on the `.env.local.example` file. This file will contain your API keys and other sensitive information.

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in the following:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STT_API_KEY=
```

### 4. Supabase Setup

1.  **Create a Supabase Project**: Go to [Supabase](https://supabase.com/) and create a new project. Make sure to note your Project URL and `anon` public key.
2.  **Database Schema**: You will need to set up your database tables. Here's a basic schema you might use:

    **`profiles` table** (for user profiles)

    ```sql
    create table profiles (
      id uuid references auth.users not null primary key,
      updated_at timestamp with time zone,
      username text unique,
      avatar_url text,
      website text,

      constraint username_length check (char_length(username) >= 3)
    );
    ```

    **`transcriptions` table** (for storing transcribed videos)

    ```sql
    create table transcriptions (
      id uuid default gen_random_uuid() primary key,
      user_id uuid references auth.users not null,
      video_url text not null,
      full_transcription text not null,
      created_at timestamp with time zone default now()
    );
    ```

3.  **Row Level Security (RLS)**: Enable RLS for your `profiles` and `transcriptions` tables and set up policies to ensure users can only access their own data. For example, for the `transcriptions` table:

    -   **Enable RLS**: `ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;`
    -   **Policy for `SELECT`**: Allow authenticated users to `SELECT` their own transcriptions.
        ```sql
        create policy 


select_own_transcriptions on transcriptions for select using (auth.uid() = user_id);
        ```
    -   **Policy for `INSERT`**: Allow authenticated users to `INSERT` transcriptions.
        ```sql
        create policy insert_own_transcriptions on transcriptions for insert with check (auth.uid() = user_id);
        ```

4.  **Obtain Supabase Keys**: From your Supabase project settings, navigate to "API" to find your `Project URL` and `anon` public key. The `SUPABASE_SERVICE_ROLE_KEY` can be found under "API Keys" as well, but should be used with caution and primarily on the server-side.

### 5. Obtaining and Configuring STT API Keys

This project uses a placeholder for a Speech-to-Text (STT) API. You will need to choose an STT provider (e.g., AssemblyAI, Deepgram, Google Cloud Speech-to-Text, AWS Transcribe) and obtain an API key from them. Once you have your key, add it to the `STT_API_KEY` variable in your `.env.local` file.

## Running Locally

To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Deployment to Vercel

This project is optimized for deployment on [Vercel](https://vercel.com/).

### Automatic Deployment (Recommended)

1.  **Connect to GitHub**: Push your local repository to a new GitHub repository.
2.  **Import Project**: Go to your Vercel dashboard, click "Add New..." -> "Project", and import your GitHub repository.
3.  **Configure Environment Variables**: During the import process, Vercel will prompt you to set up environment variables. Add the `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `STT_API_KEY` exactly as they are in your `.env.local` file.
4.  **Deploy**: Vercel will automatically detect the Next.js project and deploy it. Subsequent pushes to your connected GitHub branch will trigger automatic redeployments.

### Manual Deployment

If you prefer to deploy manually or troubleshoot, you can use the Vercel CLI:

1.  **Install Vercel CLI**: `npm install -g vercel`
2.  **Login**: `vercel login`
3.  **Deploy**: Navigate to your project directory and run `vercel`.

    You will be prompted to link your project and configure settings. Ensure your environment variables are set up correctly in the Vercel project settings.

## Privacy & Consent

This application is designed to process video content provided by the user. Only transcriptions and associated metadata are stored; original video content is never stored on our servers. By using this application, you acknowledge and consent to the transcription and storage of content you provide. Please be mindful of the content you submit.

## License

[MIT License](LICENSE) (To be created)

---

*Generated by Manus AI*

"# HaltNPC" 
