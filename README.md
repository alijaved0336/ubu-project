# UBU – Influencer / Brand Marketplace Platform

Source-structure sample of a multi-service platform with two NestJS APIs, a React admin web app and a native iOS app.
This repo shows how the codebase is organised; it is **not** a runnable deployment (secrets, env files and build output are stripped).

## Repository layout

```
backend/
  user-api/     NestJS API serving the mobile app (end users)
  admin-api/    NestJS API serving the admin/brand web portal (campaigns, payments, chat, queues)
frontend/
  admin-web/    React + Vite admin and brand portal
mobile/
  ios/          SwiftUI iOS app (UBU)
```

## Technologies

| Layer | Stack |
|-------|-------|
| Web frontend | React, Vite, Ant Design + MUI, Redux Toolkit, Axios, i18next, React Hook Form, Chart.js, Stripe.js, Google/Apple sign-in, Sentry, LogRocket, Tailwind |
| iOS | Swift / SwiftUI, Xcode project, Firebase, Bodygram body-scan SDK, Fastlane-style Gemfile |
| Backend | Node.js, NestJS, TypeScript, TypeORM, PostgreSQL, Passport (JWT, Google, Apple), class-validator, Swagger |
| Admin-API extras | Bull + Redis queues, Socket.IO gateways (chat/notifications), FFmpeg media processing, Multer-S3 uploads |
| Cloud / services | AWS S3, ECS (appspec/buildspec), Firebase Admin (push), Mailgun, Stripe, Amazon SP-API, Sentry |
| DevOps | Docker + docker-compose, GitHub Actions, AWS CodeBuild/CodeDeploy, SonarQube, ESLint/Prettier |

## How the code flows (backend, clean-architecture style)

Both APIs share the same layering under `src/`:

```
HTTP / WebSocket request
  -> infrastructure/presentation      controllers, DTOs, guards, pipes
  -> infrastructure-usecases-bridge   Nest modules wiring use-cases to providers
  -> use-cases/*.usecase.ts           business rules (auth, campaign, proposal, payment, chat...)
  -> domain/{model,repository}        entities and repository contracts
  -> infrastructure/orm               TypeORM repositories (PostgreSQL)
  -> infrastructure/services          S3, mail, push, Stripe, queues, sockets, cron jobs
```

1. A client (iOS or admin-web) authenticates against its API (`auth.usecase.ts`) and receives a JWT; guards in `infrastructure/guards` protect all later routes.
2. Controllers validate input (pipes + DTOs) and delegate to a use-case. Use-cases only depend on domain repository interfaces, which are bound to TypeORM implementations in the bridge modules.
3. Long-running work (media processing, notifications, payouts) is pushed to Bull queues; real-time chat uses Socket.IO gateways in `admin-api/src/infrastructure/sockets`.
4. `admin-web` talks to `admin-api` through the Axios layer in `src/application-wide`; `ios` talks to `user-api` through `UBU/Networking`.
5. CI builds a Docker image and deploys to AWS ECS.

## Running locally (reference)

`yarn install` -> create env files (see each service) -> `yarn start:dev` for the APIs, `yarn dev` for admin-web, open `mobile/ios/UBU.xcodeproj` in Xcode for iOS.
