
# RigCheck

RigCheck is a PC gaming compatibility platform that helps users compare
their computer hardware against published game requirements. It will
also provide evidence-based PC build recommendations for selected games
and target settings.

## Project structure

- `frontend/` — React and Vite browser application.
- `backend/` — Node.js and Express REST API.
- MongoDB — database for curated game, hardware, and compatibility data.

The frontend and backend are separate applications in one Git repository.
They can be deployed independently.

## Requirements

- Node.js and npm
- Git
- Visual Studio Code or another editor
- MongoDB Atlas account for database-backed development (optional for
  the initial API smoke tests)

## Installation

From the project root, install root development dependencies:

```bash
npm install
```

Install the frontend dependencies:

```bash
npm install --prefix frontend
```

Install the backend dependencies:

```bash
npm install --prefix backend
```

Create the local backend configuration by copying
`backend/.env.example` to `backend/.env`.

Set `MONGODB_URI` in `backend/.env` to your own MongoDB connection string
when a database is available. Never commit `.env` files or expose
database credentials in frontend code.

Create `frontend/.env.local` with:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Development commands

Run both applications:

```bash
npm run dev
```

Run only the backend:

```bash
npm run dev:api
```

Run only the frontend:

```bash
npm run dev:web
```

Run backend tests:

```bash
npm test
```

Build the frontend for production:

```bash
npm run build
```

## Local URLs

- Frontend: http://localhost:5173
- API root: http://localhost:5000
- API liveness: http://localhost:5000/api/v1/health
- API readiness: http://localhost:5000/api/v1/health/ready

The readiness endpoint returns HTTP 503 when MongoDB is disconnected.
The liveness endpoint can still return HTTP 200 because the API process
may be operating even when database-dependent features are unavailable.

## API conventions

- API endpoints are versioned under `/api/v1`.
- Responses use JSON.
- Successful health responses use a `success` field and a `data` object.
- Errors use a `success: false` field and a structured `error` object.
- Secrets belong in server-side environment variables, never in Vite
  browser variables.
- Public game and hardware data must be verified and traceable to sources
  before publication.

## Testing

Backend tests use Vitest and Supertest. Run them with `npm test` from
the project root or `npm test` from the backend directory.

## Data quality principles

RigCheck must not invent game requirements, hardware specifications,
prices, or FPS estimates. Unknown or conflicting values should be
identified as missing or uncertain until they can be verified.

## Security and deployment

- Keep environment files out of Git.
- Restrict MongoDB network access and database privileges.
- Validate incoming data on the server.
- Protect administrative actions with server-side authorization.
- Review proxy configuration before relying on IP-based rate limiting
  in production.
- Configure production CORS origins explicitly.
- Establish MongoDB backup and restore procedures before launch.

## Current implementation stage

Phase 1 establishes the application foundation. Game search, hardware
catalogs, compatibility verdicts, the PC Builder, and administrative
workflows will be added in subsequent implementation phases.