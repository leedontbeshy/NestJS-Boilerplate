# NestJS Boilerplate

Production-ready NestJS REST API starter with a minimal but scalable structure. It ships with strict TypeScript, typed environment configuration, global validation, consistent API responses, Swagger/OpenAPI, ESLint flat config, Prettier, and both unit + e2e testing.

## Overview

This template is designed for real backend projects where maintainability matters more than cleverness. It keeps the bootstrap and cross-cutting concerns centralized while leaving feature modules small, testable, and easy to extend.

## Tech Stack

- NestJS 11
- TypeScript with strict mode
- pnpm
- ESLint flat config
- Prettier
- `class-validator` + `class-transformer`
- `@nestjs/config` with typed `zod` environment validation
- Swagger / OpenAPI
- Jest + Supertest

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Create your environment file

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3. Start the development server

```bash
pnpm start:dev
```

The API will be available at `http://localhost:3000/api`.

Swagger docs will be available at:

`http://localhost:3000/api/docs`

## Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `PORT` | No | `3000` | HTTP server port |
| `NODE_ENV` | No | `development` | Runtime environment |
| `APP_NAME` | No | `nestjs-boilerplate` | App name used in Swagger metadata |
| `APP_VERSION` | No | `1.0.0` | App version used in Swagger metadata |
| `API_PREFIX` | No | `api` | Global REST prefix |
| `CORS_ORIGIN` | No | `*` | `*` or comma-separated list of allowed origins |

Environment variables are validated during startup. The app fails fast if a value is missing or invalid.

## Available Scripts

- `pnpm start:dev` runs the API with file watching
- `pnpm build` creates a production build in `dist/`
- `pnpm start:prod` runs the built application
- `pnpm lint` runs ESLint with the flat config
- `pnpm lint:fix` runs ESLint and applies safe fixes
- `pnpm format` formats the codebase with Prettier
- `pnpm test` runs unit tests
- `pnpm test:watch` runs unit tests in watch mode
- `pnpm test:e2e` runs the e2e suite
- `pnpm test:cov` runs unit tests with coverage

## Folder Structure

```text
src/
  main.ts
  app.module.ts
  common/
    constants/
    decorators/
    enums/
    exceptions/
    filters/
    interceptors/
    utils/
  config/
    app.config.ts
    env.schema.ts
  modules/
    health/
    example/
test/
  app.e2e-spec.ts
  jest-e2e.json
```

### What goes where

- `common/` contains reusable cross-cutting code shared by multiple modules.
- `config/` contains startup-safe environment parsing and typed config factories.
- `modules/` contains feature modules. Each module owns its controller, service, DTOs, and entities.
- `test/` contains end-to-end tests and dedicated Jest config for e2e runs.

## Architectural Decisions

### Global config with validation

`ConfigModule` is global so features can read config without repeating imports. Environment values are validated with a dedicated schema before the app fully boots, which prevents undefined runtime behavior in production.

### Consistent API responses

Successful responses are wrapped by a global interceptor:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

Errors are normalized by a global exception filter:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": []
}
```

This keeps frontend integrations and observability much simpler as the API surface remains predictable.

### DTO-first request validation

Controllers only accept DTOs. Validation lives at the edge of the system so services can assume they receive safe, shaped input.

### Thin controllers, focused services

Controllers handle transport concerns only. Services contain the business behavior. This keeps modules easy to test and prepares the codebase for future database or messaging integration.

### REST with URI versioning

The project uses URI versioning and a global `/api` prefix so endpoints stay explicit:

- `GET /api/v1/health`
- `GET /api/v1/example`
- `POST /api/v1/example`

## API Endpoints Included

### Health

- `GET /api/v1/health`

Example success response:

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "status": "ok",
    "timestamp": "2026-04-18T15:00:00.000Z"
  }
}
```

### Example

- `GET /api/v1/example`
- `POST /api/v1/example`

Example create payload:

```json
{
  "name": "Example item",
  "description": "Optional description",
  "isActive": true
}
```

## Conventions For New Modules

When adding a new feature module, follow these rules:

1. Create it under `src/modules/<feature>`.
2. Keep request validation in DTOs.
3. Keep controllers transport-focused and move logic into services.
4. Reuse common decorators, interceptors, filters, and utils instead of re-implementing them.
5. Add Swagger decorators to controllers and DTOs.
6. Add unit tests for service logic and e2e tests for critical routes.
7. If the module needs config, inject `ConfigService` or add a dedicated config factory.

## Suggested Next Steps

- Add authentication and authorization guards
- Add persistence with Prisma or TypeORM
- Add structured logging
- Add request-scoped correlation IDs
- Add CI with lint, test, and build checks
