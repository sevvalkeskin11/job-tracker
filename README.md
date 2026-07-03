# Job Tracker API

REST API for tracking job applications. Node.js + Express + TypeScript + Prisma + PostgreSQL.

## Setup

```bash
cp .env.example .env
npm install
docker compose up -d       # starts PostgreSQL (host port 5433)
npx prisma migrate dev     # creates tables
npm run dev                # http://localhost:3000
```

> Note: Postgres is exposed on host port **5433** (not 5432) to avoid clashing with a
> locally installed Postgres server. Adjust `DATABASE_URL` in `.env` if you change the
> port mapping in `docker-compose.yml`.

## Structure

```
src/
  config/       # env loading, Prisma client
  controllers/  # request/response handling
  services/     # business logic, DB access via Prisma
  routes/       # Express routers
  middleware/   # auth guard, validation, error handler
  schemas/      # zod input validation schemas
  utils/        # AppError, JWT helpers
prisma/
  schema.prisma # User, Application models
```

## Endpoints

| Method | Path                     | Auth | Description             |
|--------|---------------------------|------|--------------------------|
| POST   | /api/auth/register        | no   | Create a user            |
| POST   | /api/auth/login            | no   | Get a JWT                |
| GET    | /api/applications          | yes  | List your applications   |
| GET    | /api/applications/:id      | yes  | Get one application       |
| POST   | /api/applications          | yes  | Create an application     |
| PATCH  | /api/applications/:id      | yes  | Update an application      |
| DELETE | /api/applications/:id      | yes  | Delete an application       |

Authenticated requests need `Authorization: Bearer <token>`.
