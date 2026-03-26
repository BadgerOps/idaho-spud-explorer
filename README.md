# Idaho Spud Explorer

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/BadgerOps/idaho-spud-explorer)

## Overview

Idaho Spud Explorer is a modern full-stack web application powered by Cloudflare Workers. It features a reactive React frontend with shadcn/ui components, Tailwind CSS styling, and a robust serverless backend using Hono and Durable Objects for persistent state management. This template demonstrates real-time data handling, API routes, error reporting, and seamless deployment to Cloudflare's global edge network.

Ideal for building interactive dashboards, data explorers, or any app requiring low-latency, stateful serverless experiences.

## Key Features

- **Edge-Native Backend**: Hono-based API with CORS, logging, and health checks.
- **Persistent Storage**: Cloudflare Durable Objects for counters, lists, and custom data (e.g., demo items CRUD).
- **Modern UI**: shadcn/ui components, Tailwind CSS with custom themes, dark mode, and animations.
- **State Management**: Tanstack Query for data fetching/caching, Zustand/Immer for client state.
- **Developer Experience**: TypeScript end-to-end, hot reload, error boundaries, and client error reporting.
- **Responsive Design**: Mobile-first layout with sidebar, theming, and accessibility.
- **Production-Ready**: Observability enabled, SPA asset handling, and automated deployments.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide icons, Framer Motion, Tanstack Query, React Router.
- **Backend**: Cloudflare Workers, Hono, Durable Objects (SQLite-backed).
- **Utilities**: Bun (package manager/runtime), Zod (validation), Sonner (toasts), Recharts (charts).
- **Dev Tools**: ESLint, Wrangler, Cloudflare Vite plugin.

## Prerequisites

- [Bun](https://bun.sh/) installed (≥1.0)
- [Cloudflare Account](https://dash.cloudflare.com/) with Workers enabled
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/) (installed via `bunx wrangler@latest` if needed)

## Quick Start

1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd idaho-spud-explorer-gykpcxgac7o_pfopm98wo
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Run in development mode:
   ```
   bun dev
   ```
   - Frontend: http://localhost:3000
   - Backend APIs: http://localhost:8787/api/*

4. Type-check and generate Worker types:
   ```
   bun run cf-typegen
   ```

## Development Workflow

- **Hot Reload**: `bun dev` serves both frontend and Worker with live updates.
- **API Testing**: Use `/api/health`, `/api/counter`, `/api/demo` endpoints (see `worker/userRoutes.ts`).
- **Custom Routes**: Extend `worker/userRoutes.ts` without modifying `worker/index.ts`.
- **Durable Objects**: State persists across requests via `GlobalDurableObject`.
- **Frontend Customization**: Edit `src/pages/HomePage.tsx`, add routes in `src/main.tsx`.
- **Styling**: Update `tailwind.config.js` or `src/index.css`.
- **Linting**: `bun lint`
- **Build**: `bun build` (generates `dist/` for preview).

Example API usage (via curl):
```
curl http://localhost:8787/api/counter
curl -X POST http://localhost:8787/api/counter/increment
```

## Deployment

Deploy to Cloudflare Workers with one command:

```
bun run deploy
```

This builds the frontend assets, bundles the Worker, and deploys via Wrangler.

For custom deployments:
1. Configure `wrangler.jsonc` (e.g., bindings, migrations).
2. Login: `wrangler login`
3. Deploy: `wrangler deploy`

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/BadgerOps/idaho-spud-explorer)

**Live Demo APIs**:
- Health: `https://your-worker.your-subdomain.workers.dev/api/health`
- Counter: `https://your-worker.your-subdomain.workers.dev/api/counter`
- Demo Items: `https://your-worker.your-subdomain.workers.dev/api/demo`

## Project Structure

```
├── src/                 # React frontend (pages, components, hooks)
├── worker/              # Cloudflare Worker (routes, Durable Objects)
├── shared/              # Shared types & mocks
├── tailwind.config.js   # Styling config
├── wrangler.jsonc       # Worker config
└── package.json         # Bun dependencies
```

## Environment Variables

Set via Wrangler secrets or dashboard:
```
wrangler secret put YOUR_SECRET
```

Bindings available in `worker/core-utils.ts`.

## Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit changes: `git commit -m 'Add amazing feature'`.
4. Push: `git push origin feature/amazing-feature`.
5. Open a Pull Request.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- File issues here on GitHub.

Built with ❤️ for the Cloudflare ecosystem.