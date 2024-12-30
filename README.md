This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Prerequisites

Must have docker desktop

## How to install:

```bash
docker-compose up --build -d mongodb
npm install
```

## How to run:

```bash
npm run dev | yarn dev | pnpm dev | bun dev
```

And go to: [http://localhost:3000](http://localhost:3000) with your browser

## Useful commands:

// Generates NEXTAUTH_SECRET variable

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## API

http://localhost:3000/api/auth/session
http://localhost:3000/api/test-mongo-connection

## Project structure

Skeleton/
├── app/
│ ├── api/
│ │ └── upload-csv/
│ │ └── route.ts # API route for handling CSV uploads
│ ├── components/
│ │ ├── Footer.tsx # Footer component for consistent UI
│ │ ├── Navbar.tsx # Navigation bar for app-wide navigation
│ │ └── UploadButton.tsx # Reusable button for file uploads
│ ├── upload-csv/
│ │ └── page.tsx # Page for CSV upload functionality
│ ├── favicon.ico # Application favicon
│ ├── globals.css # Global styles for the application
│ └── layout.tsx # Layout structure for all pages
├── public/
│ ├── files/
│ │ └── CCFC_match_lineups_data.csv # Example/test CSV file
│ ├── images/ # Directory for image assets
│ └── videos/ # Directory for video assets
├── .env # Environment variables
├── .gitignore # Excludes files from version control
├── docker-compose.yml # Docker Compose configuration
├── eslint.config.mjs # ESLint configuration for code quality
├── next-env.d.ts # TypeScript definitions for Next.js
├── next.config.ts # Custom Next.js configuration
├── package-lock.json # Dependency lock file
├── package.json # Project metadata and dependencies
├── postcss.config.mjs # PostCSS configuration for CSS processing
├── README.md # Project overview and setup instructions
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json # TypeScript configuration file
