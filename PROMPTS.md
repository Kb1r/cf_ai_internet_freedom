# PROMPTS.md — AI Assistance During Development

This documents where I used AI assistance (Claude via Cowork) during the development of `cf_ai_internet_freedom`.

---

## Overview

I built this project myself using the `cloudflare/agents-starter` template as a base. I used Claude as a coding assistant for specific parts of the work — mainly boilerplate generation, debugging an upstream error, and drafting the README structure. The core decisions (system prompt content, architecture choices, what to build and why) were mine.

---

## Where I used Claude

### 1. Generating the system prompt

I knew what I wanted the assistant to cover — DNS, TLS, VPNs, Tor, censorship circumvention, and digital safety for people in restricted environments. Writing that out as a clean, structured system prompt takes time, so I had Claude draft it based on my spec:

> "Write a system prompt for a Cloudflare Workers AI agent focused on internet security and freedom. It should cover DNS (including 1.1.1.1 and DoH/DoT), TLS, VPNs, Tor and circumvention tools like Shadowsocks and Psiphon, and digital safety for journalists and activists. The tone should be practical and direct — built by someone from Myanmar who lived through the 2021 internet shutdowns."

I reviewed it and kept the structure, adjusting the wording in places to sound more like me.

### 2. Debugging the InferenceUpstreamError

When the local dev server returned `error code: 1031` for the Llama 3.3 model, I pasted the stack trace into Claude to figure out what was happening:

> "Getting InferenceUpstreamError error code 1031 when running wrangler dev with @cf/meta/llama-3.3-70b-instruct-fp8-fast. What does this mean?"

Claude confirmed it's a local dev limitation — some Workers AI models only run in production. Deploying directly fixed it.

### 3. README structure

I asked Claude to give me a README structure that covered architecture, local setup, and deployment steps. I filled in the details and added the personal context section myself.

---

## What I did without AI help

- Decided what to build and why (the personal motivation from Myanmar is mine)
- Chose the tech stack: Workers, Durable Objects, Llama 3.3, Vite
- Set up Wrangler, authenticated with Cloudflare, and handled the deployment
- Customised the frontend (landing page, header, example prompts)
- Configured `wrangler.jsonc` bindings for AI and Durable Objects
- Pushed to GitHub and wired everything together

---

*Tools used: Claude (Anthropic Cowork), Cloudflare Workers, Wrangler CLI*
