# Serv — Docker Setup

Full-stack project: NestJS API + React Admin Panel + PostgreSQL, all running via Docker Compose.

---

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)

That's it. No Node.js, no PostgreSQL needed locally.

---

## Quick Start

### 1. Copy the environment file

```bash
cp .env.example .env
```

### 2. Edit `.env` with your values

```env
DB_USER=comnet
DB_PASSWORD=your_strong_password
DB_NAME=serv_db

JWT_SECRET=some_long_random_string
ADMIN_PASSWORD=your_admin_password

BITRIX_WEBHOOK_URL=https://your-bitrix.com/rest/ID/TOKEN/crm.lead.add.json
RECAPTCHA_SECRET=

FRONTEND_URL=http://localhost,http://localhost:80
VITE_API_URL=http://localhost:3000
```

### 3. Build and start

```bash
docker compose up -d --build
```

First run takes a few minutes (downloads images and builds the app).

### 4. Open in browser

| Service     | URL                        |
|-------------|----------------------------|
| Admin Panel | http://localhost            |
| API         | http://localhost:3000       |

Login to the admin panel with the `ADMIN_PASSWORD` you set in `.env`.

---

## Useful Commands

```bash
# View running containers
docker compose ps

# View API logs
docker compose logs -f api

# Stop everything
docker compose down

# Stop and delete database (full reset)
docker compose down -v

# Rebuild after code changes
docker compose up -d --build
```

---

## Project Structure

```
serv/
├── docker-compose.yml      # Orchestrates all services
├── .env.example            # Copy this to .env
├── serv-api/               # NestJS backend
│   ├── Dockerfile
│   ├── prisma/             # Database schema & migrations
│   └── src/
└── serv-admin/             # React admin panel (Vite)
    ├── Dockerfile
    └── src/
```

---

## Notes

- The database runs inside Docker and data is stored in a named volume (`postgres_data`) — it persists between restarts.
- Uploaded files are stored in the `api_uploads` volume.
- On first start, the database is automatically populated with the included data (`docker/initdb/dump.sql`).
- The init script only runs once — on a fresh volume. Restarting containers will NOT re-import the data.
- To reset everything from scratch: `docker compose down -v && docker compose up -d --build`
