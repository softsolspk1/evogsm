# Neon Auth + Next.js 16 Starter

A premium authentication starter using the official Neon Auth SDK and Next.js 16.

## Getting Started

1. **Database**: Create a project in [Neon](https://neon.tech) and enable Neon Auth.
2. **Environment**: Copy `.env.local` and add your `NEON_AUTH_BASE_URL` and `NEON_AUTH_COOKIE_SECRET`.

## Key Considerations

- **Architecture**: Uses unified `createNeonAuth` for server-side logic in `lib/auth.ts`.
- **Middleware**: Follows Next.js 16 `proxy.ts` convention for protected routes.
- **Client**: Uses `authClient` from `lib/auth-client.ts` for hooks/methods.
- **Routing**: Internal SDK logic expects `app/api/auth/[...path]` for catch-all routes.
