# Realtime Survey Application

This is a full-stack web application that allows users to create, vote on, and view survey polls in real-time. It is built with Next.js, Supabase, and Tailwind CSS.

## Features

- **User Authentication**: Secure sign-up and login functionality using Supabase Auth.
- **Poll Management**: Authenticated users can create new polls and view a list of their created polls on a personal dashboard.
- **Real-time Voting**: Users can vote on polls, and the results are updated in real-time for all viewers using Supabase Realtime.
- **Duplicate Vote Prevention**: Users are restricted to one vote per poll.
- **Data Visualization**: Poll results are displayed as a bar chart using the Recharts library.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: TypeScript
- **UI Components**: [Recharts](https://recharts.org/) for charts.

## Local Development Setup

Follow these steps to get the project running on your local machine.

### 1. Prerequisites

- [Node.js](https://nodejs.org/en) (version 18 or later)
- [npm](https://www.npmjs.com/)
- A [Supabase](https://supabase.com/) account

### 2. Clone the Repository

```bash
git clone <repository-url>
cd realtime-survey-app
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Environment Variables

1.  Create a new project on Supabase.
2.  Copy the `.env.example` file to a new file named `.env.local`.
    ```bash
    cp .env.example .env.local
    ```
3.  In your Supabase project, go to **Settings > API**.
4.  Find your **Project URL** and `anon` **public key**.
5.  Paste these values into your `.env.local` file:
    ```
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

### 5. Set Up Supabase Database

1.  In your Supabase project, go to the **SQL Editor**.
2.  Open the `schema.sql` file from this repository, copy its content.
3.  Paste the SQL content into the editor and click **RUN** to create the tables (`polls`, `options`, `votes`) and their corresponding security policies (RLS).

### 6. Enable Real-time

1.  In your Supabase project, go to **Database > Replication**.
2.  Click on the gear icon next to `supabase_realtime`.
3.  Enable replication for the `polls`, `options`, and `votes` tables by checking the boxes next to them.
4.  Click **Save**.

### 7. Run the Application

Now you can start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.