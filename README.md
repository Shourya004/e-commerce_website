# e-jwel

The Angular application is in [`frontend/`](./frontend/).

The app source is organized by responsibility:

```text
frontend/
  public/                 Static assets
  src/
    app/
      core/               App-wide handlers and services
      features/           Route-level feature pages
      layouts/            Page layouts
      shared/             Reusable components
    environments/         Environment configuration
```

From that directory, install dependencies and start the development server:

```sh
npm install
ng serve / npm start
```



# E-Jewel

A full-stack jewellery shop website.

- **Frontend:** Angular + Tailwind
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL
- **Runs with:** Docker Compose (one command starts everything)

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (installed and running)

Nothing else is needed. You don't have to install Node, Python or PostgreSQL.

## Quick start

1. Clone the repo and open the project folder:
```sh
   git clone <repo-url>
   cd e-commerce_website
```
2. Create your environment file:
```sh
   cp .env.example .env
```
   On Windows PowerShell: `copy .env.example .env`.
   Open `.env` and set `DB_PASSWORD`. Use **letters and numbers only** (symbols like `@` break the database address).
3. Start everything:
```sh
   docker compose up --build
```
   The first run takes a few minutes while Docker downloads images.

## Open the app

| What | Address |
| --- | --- |
| Website (dev mode) | http://localhost:4200 |
| Website (normal mode) | http://localhost:3000 (set by `FRONTEND_PORT` in `.env`) |
| API docs (Swagger) | http://localhost:5000/docs |
| API health check | http://localhost:5000/health |

## Two ways to run

| Mode | Command | Use it for |
| --- | --- | --- |
| **Dev** (live reload) | `docker compose up` | Daily coding. Saving a file updates the app automatically |
| **Normal** (like production) | `docker compose -f docker-compose.yml up --build` | Final check before sharing |

Dev mode is turned on by `docker-compose.override.yml`, which Docker Compose loads automatically.

## Common commands

| Command | What it does |
| --- | --- |
| `docker compose up -d` | Start in the background |
| `docker compose ps` | Show running services |
| `docker compose logs -f backend` | Watch live logs (`db` and `frontend` work too) |
| `docker compose down` | Stop everything (data is kept) |
| `docker compose down -v` | Stop and delete the database data |

Run `--build` only after changing a Dockerfile, `requirements.txt` or `package.json`.

## Project structure

```text
.
├── docker-compose.yml            # all services (db, backend, frontend)
├── docker-compose.override.yml   # dev mode (live reload)
├── .env.example                  # template for .env
├── backend/
│   ├── Dockerfile
│   └── app/                      # FastAPI code
├── frontend/
│   ├── Dockerfile                # production: build + nginx
│   ├── Dockerfile.dev            # dev: ng serve
│   ├── nginx.conf                # serves the site, forwards /api to backend
│   ├── proxy.conf.json           # dev-mode /api proxy
│   └── src/                      # Angular code
└── requirements.txt              # Python packages
```

## How it works

```text
Browser -> frontend (nginx or ng serve) -> /api -> backend (FastAPI) -> db (PostgreSQL)
```

The browser only talks to the frontend. Requests that start with `/api` are forwarded to the backend, which removes the `/api` prefix. For example, `/api/auth/register` becomes `/auth/register`.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `ports are not available ... forbidden by its access permissions` | Windows has reserved that port. Change the left number in that `ports:` line, or change `FRONTEND_PORT` in `.env` |
| `could not translate host name "...@db"` | The DB password contains `@`. Use letters and numbers only, then `docker compose down -v` and start again |
| Changed the DB password but the backend can't connect | Postgres reads the password only on first creation. Run `docker compose down -v`, then `docker compose up` |
| Backend keeps restarting | Run `docker compose logs backend` and read the last lines |
| `localhost:8000` shows nothing | The backend is on port **5000** on your PC. Open http://localhost:5000/docs |
| Code changes don't show up | Make sure you're in dev mode (website on port 4200), or rebuild with `--build` |

```
