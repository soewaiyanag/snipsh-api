# SnipShort API

Backend for **SnipShort**, a URL shortener at [snipsh.com](https://snipsh.com).
Sign up, turn long URLs into short links like `snipsh.com/aB3x9`, and see how often each one gets clicked.

Built with NestJS, Prisma and PostgreSQL.

> Work in progress. See the [roadmap](#roadmap) for what is done and what is next.

## Tech stack

| Area      | Tool                                   |
| --------- | -------------------------------------- |
| Framework | NestJS 12 (TypeScript, ES modules)     |
| Database  | PostgreSQL (Neon), Docker for local dev |
| ORM       | Prisma 7 with the `pg` driver adapter  |
| Testing   | Vitest, Supertest                      |
| Linting   | oxlint, Prettier                       |

## Data model

```
User 1 ──── * Link
```

- **User**: `id`, `email` (unique), `passwordHash`, `createdAt`
- **Link**: `id`, `slug` (unique), `url`, `userId`, `createdAt`. A user's links are deleted along with the user.

## Getting started

Requirements: Node 22+, Yarn, a PostgreSQL database.

```bash
git clone https://github.com/soewaiyanag/snipsh-api.git
cd snipsh-api
yarn install
```

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgresql://..."   # pooled connection, used by the app
DIRECT_URL="postgresql://..."     # direct connection, used by Prisma migrations
PORT=3000
```

Apply the migrations and start the server:

```bash
yarn prisma migrate deploy
yarn start:dev
```

The API runs on `http://localhost:3000`.

## Scripts

| Command            | Description                     |
| ------------------ | ------------------------------- |
| `yarn start:dev`   | Start in watch mode             |
| `yarn build`       | Compile to `dist/`              |
| `yarn start:prod`  | Run the compiled build          |
| `yarn test`        | Unit tests                      |
| `yarn test:e2e`    | End-to-end tests                |
| `yarn lint`        | Lint with oxlint                |
| `yarn format`      | Format with Prettier            |

## Roadmap

- [x] Project setup: NestJS, Prisma, Neon
- [x] User and Link schema with migrations
- [x] Config with environment validation
- [x] Prisma service and global request validation
- [ ] Local PostgreSQL with Docker Compose
- [ ] Auth: register, login, JWT
- [ ] Links: create (random or custom slug), list, update, delete, owner-only access
- [ ] Redirect: `GET /:slug` with 302, expired and inactive links rejected
- [ ] Click tracking: timestamp, referrer, user agent
- [ ] Analytics: total clicks, clicks per day, top referrers
- [ ] Pagination on link lists
- [ ] Consistent error responses
