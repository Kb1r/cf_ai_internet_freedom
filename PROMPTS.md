# PROMPTS.md — AI Prompts Used During Development

This file documents every prompt given to Claude (AI assistant) during the development of `cf_ai_internet_freedom`. Required for internship submission.

---

## Session Overview

**Project:** cf_ai_internet_freedom — an AI-powered chat agent on Cloudflare Workers
**Developer:** K (aungkzin24@gmail.com)
**Date:** 2026-04-06
**Purpose:** A chat assistant focused on internet security and freedom — DNS, TLS, VPNs, and censorship circumvention. Personally meaningful as someone from Myanmar who used Cloudflare's 1.1.1.1 DNS resolver during internet restrictions after the 2021 military coup.

---

## Prompt 1 — Project Kickoff & Full Build Request

**Given to:** Claude (via Cowork)
**Date:** 2026-04-06

**Prompt:**
> I am building an AI-powered chat agent on Cloudflare for an internship assignment. I need you to help me complete the entire project from setup to deployment.
>
> Repository name must be: `cf_ai_internet_freedom`
> Use this exact starter command to begin:
> ```
> npx create-cloudflare@latest --template cloudflare/agents-starter
> ```
>
> What I am building: A chat assistant focused on internet security and internet freedom — helping users understand DNS, TLS, VPNs, and censorship circumvention. This is personally meaningful to me as someone from Myanmar who used Cloudflare's 1.1.1.1 DNS resolver during internet restrictions after the 2021 military coup.
>
> Required components — all must be present for submission:
> * LLM: Llama 3.3 via Cloudflare Workers AI
> * Workflow/coordination: Cloudflare Workers
> * User input: Chat interface via the starter UI
> * Memory/state: Durable Objects for conversation persistence
>
> Customisations needed on top of the starter:
> * System prompt focused on internet security, DNS, TLS, VPNs, and internet freedom
> * Clean landing page with a brief explanation of what the app does and why it was built
> * Professional README.md with architecture overview, setup instructions to run locally, and deployed link section
> * PROMPTS.md file documenting every AI prompt used during development
>
> Submission requirements — must be met:
> * Repository name prefixed with `cf_ai_`
> * README.md with clear running instructions
> * PROMPTS.md with all AI prompts used
> * Fully working deployed link on Cloudflare Pages or Workers
>
> My setup:
> * Mac
> * Comfortable with TypeScript and JavaScript
> * Have a Cloudflare account
> * Have Node.js installed
> * Never used Wrangler, Workers, or Durable Objects before
>
> How I want you to work:
> * Do everything for me step by step
> * Create all files with complete code
> * Tell me exactly what commands to run in the terminal and in what order
> * Tell me what the expected output should be after each command
> * Warn me before anything that commonly goes wrong
> * Do not move to the next step until the current one is confirmed working
>
> Start with Step 1: Verify my environment is ready — check Node.js version, install Wrangler globally, and log into Cloudflare via Wrangler.
>
> Note one thing, make sure variable and comments sound human, not ai tone

**What Claude did:** Laid out the full project plan, set up the todo list, started PROMPTS.md, and guided through Step 1 (environment verification, Wrangler install, Cloudflare login).

---

## Prompt 2 — Scaffolding Issue (Underscore in Project Name)

**Given to:** Claude
**Date:** 2026-04-06

**Prompt:**
> ╭ Create an application with Cloudflare Step 1 of 3
> │
> ├  ERROR  Project names must only contain lowercase characters, numbers, and dashes.
> │
> ╰ In which directory do you want to create your application? also used as application name
>   ./cf_ai_internet_freedom

**What Claude did:** Explained that Cloudflare's CLI doesn't allow underscores. Advised using `cf-ai-internet-freedom` (dashes) for the local folder and Cloudflare app name, while keeping `cf_ai_internet_freedom` (underscores) for the GitHub repository name, which satisfies the submission requirement.

---

## Prompt 3 — Viewing Starter Files Before Customisation

**Given to:** Claude
**Date:** 2026-04-06

**Prompt:**
> [Pasted output of `ls src/`, `cat wrangler.jsonc`, `cat src/server.ts`, `cat src/app.tsx`, `cat src/client.tsx`, `cat index.html`]
>
> Step 2 please

**What Claude did:** Read all starter source files to understand the exact structure before writing any replacements. Identified that the starter uses `@cf/moonshotai/kimi-k2.5` (needed to change to Llama 3.3), has weather/calculate/schedule demo tools (to remove), and uses `AIChatAgent` with Durable Objects (to keep). Proceeded to write all customised files.

---

## Prompt 4 — System Prompt Design

**Written by Claude for use inside `src/server.ts`**
**Date:** 2026-04-06

This is the actual system prompt written and embedded in the application:

```
You are an internet freedom and security assistant. You were built by someone from Myanmar
who personally relied on Cloudflare's 1.1.1.1 DNS resolver to stay connected during
internet restrictions following the 2021 military coup.

Your purpose is to help people understand the tools and concepts that keep the internet
open, secure, and accessible — especially in places where that's genuinely difficult.

What you know well:
[DNS, TLS, VPNs, censorship circumvention, network surveillance, digital safety —
see full prompt in src/server.ts]

How you respond:
- Be direct and practical.
- Explain technical concepts clearly but don't oversimplify.
- Be honest about limitations and tradeoffs.
- Stay focused on internet security and freedom.
```

**Design rationale:** The prompt is grounded in a specific personal context (Myanmar, 2021 coup, 1.1.1.1) to give the agent a genuine voice rather than a generic one. Coverage spans DNS, TLS, VPNs, Tor/circumvention tools, DPI, and digital safety for journalists and activists — the full range of topics someone navigating a restricted internet would need.

---

## Prompt 5 — File Replacement and App Customisation

**Given to:** Claude
**Date:** 2026-04-06

**Prompt:**
> [Paste of all 4 source file contents from the starter template]
> done

**What Claude did:** Wrote complete replacement files for `src/server.ts` (Llama 3.3 + internet freedom system prompt), `index.html` (updated title and meta description), `README.md` (full architecture overview, setup instructions, assignment checklist), and `PROMPTS.md` (this file). Also provided targeted edit instructions for `src/app.tsx` to update the header, landing section, and example prompts.

---

*This file is complete as of the end of the development session on 2026-04-06.*
