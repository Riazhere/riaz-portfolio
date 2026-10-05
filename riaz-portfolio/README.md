# React + Vite

## General assistant answers

Questions that do not match the portfolio's Riaz-specific knowledge base are sent to Cloudflare Workers AI through the `/api/answer` Worker route. To use it locally, authenticate Wrangler with `npx wrangler login`, then run `npm run dev` from this directory. AI inference uses the Cloudflare account's Workers AI access and quota; it does not require a browser API key. Deploy the Worker with `npm run deploy` from the workspace root. The Netlify configuration publishes only the static site and does not provide this API route.

## Voice assistant

For local development, copy `.env.example` to `.env.local` and set your ElevenLabs API key and voice ID. The Vite client exposes `VITE_` variables in the browser bundle, so do not use this client-side key setup in production; route requests through a server-side function instead.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
