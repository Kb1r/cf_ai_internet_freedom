# cf_ai_internet_freedom

An AI-powered chat assistant focused on internet security and freedom — helping users understand DNS, TLS, VPNs, and censorship circumvention. Built on Cloudflare Workers with Llama 3.3 and Durable Objects.

## Why I built this

After Myanmar's 2021 military coup, internet shutdowns and censorship became part of daily life. Cloudflare's 1.1.1.1 DNS resolver was one of the tools that helped people stay connected when it mattered most. This project is my way of making that knowledge more accessible — an assistant that can explain these tools clearly, help people understand what's actually happening at the network level, and give practical advice to anyone trying to navigate a restricted internet.

## Live Demo

> Deployed link: https://cf-ai-internet-freedom.aungkzin24.workers.dev

---

## Architecture

```
Browser (React UI)
    │
    │  WebSocket (persistent connection)
    ▼
Cloudflare Worker (src/server.ts)
    │
    ├── routeAgentRequest() → ChatAgent (Durable Object)
    │       │
    │       ├── Conversation history stored in SQLite via Durable Objects
    │       └── streamText() → Cloudflare Workers AI
    │                               └── Llama 3.3 70B (llama-3.3-70b-instruct-fp8-fast)
    │
    └── Static assets served from /public (index.html, built JS/CSS)
```

**Key pieces:**

- **Cloudflare Worker** (`src/server.ts`) — the entry point. Routes requests to the agent or serves static assets.
- **ChatAgent** — a Durable Object that extends `AIChatAgent`. Each user session gets its own instance with its own persistent conversation history.
- **Durable Objects** — give us per-session state and memory that survives across requests. This is how the agent remembers what you said earlier in a conversation.
- **Cloudflare Workers AI** — runs Llama 3.3 70B inference at the edge. No external API key needed.
- **React frontend** (`src/app.tsx`) — the chat UI, built with Cloudflare's Kumo design system and the `useAgentChat` hook.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Cloudflare Workers |
| LLM | Llama 3.3 70B via Cloudflare Workers AI |
| State / Memory | Durable Objects (SQLite) |
| Frontend | React + TypeScript |
| UI Components | Cloudflare Kumo |
| Build Tool | Vite |
| Deployment | Wrangler CLI |

---

## Running locally

### Prerequisites

- Node.js 18 or higher
- A Cloudflare account (free tier works)
- Wrangler CLI installed globally

```bash
npm install -g wrangler
wrangler login
```

### Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/cf_ai_internet_freedom.git
cd cf_ai_internet_freedom

# Install dependencies
npm install
```

### Start the dev server

```bash
npm run dev
```

This runs `wrangler dev` under the hood. Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** The first time you run this, Wrangler may prompt you to create a local Durable Object migration. Just follow the prompt — it sets up the local SQLite database for development.

### What to expect

- The chat UI loads at `localhost:5173`
- A WebSocket connection establishes to the local Worker
- Ask anything about DNS, TLS, VPNs, or censorship circumvention — the agent uses your Cloudflare Workers AI allocation for inference

---

## Deploying to Cloudflare

```bash
npm run deploy
```

This runs `wrangler deploy`. Wrangler will:
1. Bundle your Worker and frontend assets
2. Upload the Durable Object class
3. Apply the SQLite migration
4. Deploy to `https://cf-ai-internet-freedom.YOUR_SUBDOMAIN.workers.dev`

Copy the deployed URL and add it to the Live Demo section above.

---

## Project structure

```
cf-ai-internet-freedom/
├── src/
│   ├── server.ts       # Worker entry point + ChatAgent Durable Object
│   ├── app.tsx         # React chat UI
│   ├── client.tsx      # Browser entry point (renders React app)
│   └── styles.css      # Global styles
├── public/             # Static assets (favicon, etc.)
├── index.html          # HTML shell
├── wrangler.jsonc      # Cloudflare Workers configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── PROMPTS.md          # All AI prompts used during development
```

---

## Customisation notes

The main customisation over the starter template is in `src/server.ts`:

- **Model changed** from `@cf/moonshotai/kimi-k2.5` to `@cf/meta/llama-3.3-70b-instruct-fp8-fast` (Llama 3.3 as required by the assignment)
- **System prompt** written from scratch to focus on internet security, DNS, TLS, VPNs, and censorship circumvention
- **Removed** the starter's weather/calculate/schedule demo tools to keep the agent focused

The frontend (`src/app.tsx`) was updated with:
- A landing section explaining what the tool does and why it was built
- Domain-relevant example prompts (DNS, VPN, TLS questions instead of weather/calculator)
- Updated header and page title

---

## Assignment checklist

- [x] Repository name prefixed with `cf_ai_`
- [x] LLM: Llama 3.3 via Cloudflare Workers AI
- [x] Workflow/coordination: Cloudflare Workers
- [x] User input: Chat interface via starter UI
- [x] Memory/state: Durable Objects for conversation persistence
- [x] Custom system prompt for internet security and freedom
- [x] Landing page with project explanation
- [x] README.md with architecture overview and setup instructions
- [x] PROMPTS.md documenting all AI prompts used
- [ ] Deployed link (add after `wrangler deploy`)

---

## License

MIT
