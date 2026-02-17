# Neon Auth + Expo Starter

A mobile-ready authentication implementation for Expo, designed to sync seamlessly with the Neon Auth Next.js server.

## Getting Started

1. **Server**: Ensure your [Neon Auth Next.js](https://github.com/your-repo/auth) server is running.
2. **Environment**: Update `src/lib/auth-client.ts` with your server's `BETTER_AUTH_URL`.

## Key Considerations

- **Sync**: Always ensure the `BETTER_AUTH_URL` matches your deployed or local Next.js instance.
- **Storage**: Uses `expo-secure-store` for persistent and secure session management.
- **Client**: Built with `better-auth/expo` for cross-platform authentication support.
- **Styling**: Uses NativeWind for a consistent, premium UI experience.
