This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Prerequisites

Docker desktop app for docker-compose;

## 0/3, open terminal in the root of your app

## 1/3, install everything needed via these commands:

```bash
docker-compose up --build -d mongodb
npm install
```

## 2/3, add Keys to .env file:

MONGODB_URI="mongodb://admin:password@localhost:27017/mydatabase?authSource=admin"
OPENAI_API_KEY="your-key here; don't remove quotes; get one: https://openai.com/index/openai-api/"
NEXTAUTH_SECRET="your-key here; don't remove quotes; generate via the command mentioned below"
NEXTAUTH_URL=http://localhost:3000

## 3/3, run one of these command (npm by default):

```bash
npm run dev | yarn dev | pnpm dev | bun dev
```

And go to: [http://localhost:3000](http://localhost:3000) with your browser

## Generate NEXTAUTH_SECRET variable with this command in terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

# Project Structure

## Hackathon2024/

-   **api/**

    -   **auth/**
        -   [...nextauth]/
            -   `route.ts` - NextAuth.js authentication routes
        -   `auth.ts` - Custom authentication logic
        -   `bcrypt.ts` - Password hashing utilities
        -   `nextauth.d.ts` - Type declarations for NextAuth.js
    -   **football-matches/**
        -   `route.ts` - API routes for football match data
    -   **generate-ai-advice/**
        -   `route.ts` - API route for generating AI advice
    -   **login/**
        -   `route.ts` - API route for user login
    -   **register/**
        -   `route.ts` - API route for user registration
    -   **reset-password/**
        -   `route.ts` - API route for password reset
    -   **test-mongo-connection/**
        -   `route.ts` - API route to test MongoDB connection
    -   **upload-csv/**
        -   `route.ts` - API route for handling CSV uploads

-   **components/**

    -   `AverageMetricsChart.tsx` - Chart component for average metrics
    -   `ChartSection.tsx` - Chart section for match insights
    -   `DashboardClient.tsx` - Main dashboard client-side rendering
    -   `MainContent.tsx` - Main content component
    -   `MatchDetails.tsx` - Match details component
    -   `MetricCategory.tsx` - Metric category display component
    -   `Navbar.tsx` - Navbar component
    -   `SessionProviderWrapper.tsx` - Session provider for authentication
    -   `Sidebar.tsx` - Sidebar component for navigation
    -   `SidebarItem.tsx` - Individual sidebar item
    -   `SpiderChart.tsx` - Spider chart for performance metrics
    -   `TooltipIcon.tsx` - Tooltip for additional info
    -   `UploadCSVClient.tsx` - Client component for CSV upload

-   **dashboard/**

    -   **services/**
        -   `dashboardHandler.ts` - Service functions for dashboard data
    -   `page.tsx` - Dashboard page

-   **document-uploader/**

    -   **services/**
        -   `csvHandlers.ts` - Service for handling CSV uploads
    -   `page.tsx` - CSV upload page

-   **hooks/**

    -   `useMetrics.ts` - Custom hook for metrics state

-   **insights/**

    -   **[id]/**
        -   **services/**
            -   `insightsHandlers.ts` - Service for fetching insights
            -   `metricsMapper.ts` - Mapper for metrics data
        -   `page.tsx` - Page for match insights

-   **lib/**

    -   `fonts.ts` - Font configuration
    -   `mongodb.ts` - MongoDB connection utilities

-   **login/**

    -   `page.tsx` - Login page

-   **register/**

    -   `page.tsx` - Registration page

-   **reset-password/**

    -   `page.tsx` - Password reset page

-   `favicon.ico` - Application favicon
-   `globals.css` - Global CSS file
-   `layout.tsx` - Application layout file

## public/

-   **files/**
    -   `CCFC_match_lineups_data.csv` - Sample CSV file for matches
-   **images/**
    -   `logo.png` - Application logo
-   **videos/**
    -   Placeholder for video assets

## Root Files

-   `.env` - Environment variables
-   `.gitignore` - Git ignore rules
-   `docker-compose.yml` - Docker Compose configuration
-   `eslint.config.mjs` - ESLint configuration
-   `middleware.ts` - Middleware configuration
-   `mongo-init.js` - MongoDB initialization script
-   `next.config.ts` - Next.js configuration
-   `package.json` - Project dependencies and scripts
-   `package-lock.json` - Lockfile for npm dependencies
-   `postcss.config.mjs` - PostCSS configuration
-   `README.md` - Project documentation
-   `tailwind.config.ts` - Tailwind CSS configuration
-   `tsconfig.json` - TypeScript configuration

## Useful APIs to Test the App:

-   /api/test-mongo-connection
-   /api/auth/session

## API Documentation

This document outlines the API endpoints for the application.

---

1. /api/football-matches

---

**DELETE**

-   Description: Deletes all documents from the `football_matches` collection in MongoDB.
-   Response:
    -   Success:
        {
        "message": "All documents deleted",
        "deletedCount": <number>
        }
    -   Error:
        {
        "message": "<error_message>"
        }

**GET**

-   Description: Retrieves match data based on query parameters.
-   Query Parameters:
    -   `id`: Retrieve a single match by its ID.
    -   `season`: Calculate average metrics for a given season.
    -   No parameters: Fetch all matches.
-   Response:
    -   Success:
        [
        {
        "id": "<match_id>",
        "index": "<index>",
        "homeTeam": "<team>",
        "awayTeam": "<opposition_team>",
        "score": "<score>",
        "date": "<date>",
        "metrics": { ... }
        }
        ]
    -   Error:
        {
        "message": "<error_message>"
        }

---

2. /api/generate-ai-advice

---

**POST**

-   Description: Generates advice using OpenAI's GPT model based on the provided prompt.
-   Request Body:
    {
    "prompt": "string"
    }
-   Response:
    -   Success:
        {
        "advice": "<advice_string>"
        }
    -   Error:
        {
        "advice": "<error_message>"
        }

---

3. /api/login

---

**POST**

-   Description: Authenticates a user using email and password and generates a session token.
-   Request Body:
    {
    "email": "string",
    "password": "string"
    }
-   Response:
    -   Success:
        {
        "message": "Login successful"
        }
    -   Error:
        {
        "error": "<error_message>"
        }
-   Cookies:
    -   Sets a session token (`next-auth.session-token`) upon successful login.

---

4. /api/register

---

**POST**

-   Description: Registers a new user with email and hashed password.
-   Request Body:
    {
    "email": "string",
    "password": "string"
    }
-   Response:
    -   Success:
        {
        "message": "User registered successfully"
        }
    -   Error:
        {
        "error": "<error_message>"
        }

---

5. /api/reset-password

---

**POST**

-   Description: Resets the password for an existing user.
-   Request Body:
    {
    "email": "string",
    "newPassword": "string"
    }
-   Response:
    -   Success:
        {
        "message": "Password reset successfully"
        }
    -   Error:
        {
        "error": "<error_message>"
        }

---

6. /api/test-mongo-connection

---

**GET**

-   Description: Tests the connection to MongoDB and lists collections and documents from `football_matches` and `users` collections.
-   Response:
    -   Success:
        {
        "message": "Connected to MongoDB",
        "collections": ["<collection_names>"],
        "footballMatches": ["<match_documents>"],
        "users": ["<user_documents>"]
        }
    -   Error:
        {
        "message": "Error connecting to MongoDB",
        "error": "<error_message>"
        }

---

7. /api/upload-csv

---

**POST**

-   Description: Inserts CSV data into the `football_matches` collection.
-   Request Body:
    [
    {
    "key1": "value1",
    "key2": "value2"
    }
    ]
-   Response:
    -   Success:
        {
        "message": "Data inserted successfully",
        "result": "<MongoDB_Result>"
        }
    -   Error:
        {
        "message": "<error_message>"
        }

---

8. /api/auth/session

---

**GET**

-   Description: Retrieves the current user session details.
-   Response:
    -   Success:
        {
        "user": {
        "id": "<user_id>",
        "email": "<user_email>"
        }
        }
    -   Error:
        {
        "error": "Not authenticated"
        }

## Notes:

1. Authentication:

    - Routes like `/api/login`, `/api/register`, and `/api/reset-password` are user-specific.
    - Use secure methods (e.g., HTTPS) to prevent data leaks.

2. Error Handling:

    - Each endpoint provides meaningful error messages to facilitate debugging.

3. Database:

    - MongoDB is used to store and retrieve data.
    - Collection names: `football_matches`, `users`.

4. Environment Variables:

    - `MONGODB_URI`: MongoDB connection string.
    - `OPENAI_API_KEY`: API key for OpenAI.
    - `NEXTAUTH_SECRET`: Secret for session token encoding.

5. Utilities:
    - Metrics calculation and AI advice generation are managed using utility functions.
