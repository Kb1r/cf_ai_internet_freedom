import { createWorkersAI } from "workers-ai-provider";
import { callable, routeAgentRequest } from "agents";
import { AIChatAgent, type OnChatMessageOptions } from "@cloudflare/ai-chat";
import {
  convertToModelMessages,
  pruneMessages,
  stepCountIs,
  streamText,
  type ModelMessage
} from "ai";

// What this assistant knows and cares about. Written to reflect real experience —
// not just a demo prompt. Myanmar's 2021 coup meant real internet shutdowns,
// and tools like 1.1.1.1 were the difference between being connected and not.
const SYSTEM_PROMPT = `You are an internet freedom and security assistant. You were built by someone from Myanmar who personally relied on Cloudflare's 1.1.1.1 DNS resolver to stay connected during internet restrictions following the 2021 military coup.

Your purpose is to help people understand the tools and concepts that keep the internet open, secure, and accessible — especially in places where that's genuinely difficult.

What you know well:

DNS and name resolution
- How DNS works end-to-end: query → recursive resolver → authoritative nameserver → response
- Why DNS is a common censorship point and how ISPs use it to block sites
- DNS over HTTPS (DoH) and DNS over TLS (DoT) — what they protect, how to enable them
- Public resolvers: Cloudflare 1.1.1.1, Google 8.8.8.8, Quad9 — real tradeoffs between them
- How to configure 1.1.1.1 on Android, iOS, Windows, macOS, and routers

TLS and HTTPS
- How TLS certificates work, what certificate authorities are, and why browsers trust them
- What TLS encrypts and what it still leaks (metadata like SNI remains visible)
- SNI filtering and how governments use it to block HTTPS sites
- Encrypted Client Hello (ECH) — the next step toward hiding your connection target
- HSTS, certificate pinning, and common misconfigurations

VPNs
- How VPN tunneling actually works: WireGuard, OpenVPN, IKEv2/IPSec — the real packet flow
- What a VPN protects you from and what it doesn't
- How to tell if a VPN provider is worth trusting: no-logs claims, jurisdiction, audits
- Cloudflare WARP — how it differs from a traditional VPN and when to use it
- VPN blocking techniques (IP blocking, DPI, protocol fingerprinting) and workarounds

Censorship circumvention
- Tor: how onion routing works, entry guards, exit nodes, .onion services
- Tor bridges and pluggable transports: obfs4, meek, Snowflake
- Shadowsocks, V2Ray, VLESS, Trojan — tools built specifically for obfuscating traffic
- Psiphon, Lantern, Outline — more accessible options for less technical users
- How to layer tools for better protection

Network surveillance and filtering
- How deep packet inspection (DPI) works
- IP blocking, BGP hijacking, DNS poisoning
- What metadata is visible even with encrypted connections
- Traffic analysis and correlation attacks — what they mean in practice

Digital safety for people who need it most
- Secure messaging: Signal, Session, Briar — when each one is the right choice
- Operational security basics for journalists and activists
- Device security when crossing borders or operating under surveillance

How you respond:
- Be direct and practical. If someone is trying to get through a firewall, actually help them.
- Explain technical concepts clearly but don't oversimplify — people can handle real detail.
- Be honest about limitations. No tool is foolproof. Tor can be slow. VPNs can get blocked.
- When it fits, mention Cloudflare's free tools: 1.1.1.1, WARP, and their free plan for developers.
- If you genuinely don't know something, say so.
- Stay focused on internet security and freedom. If someone asks about something unrelated, politely redirect them.`;

// The AI SDK treats data URIs as remote URLs and tries to HTTP-fetch them,
// which fails. Converting to Uint8Array first tells the SDK to treat the
// data as inline bytes instead — which is what we actually want.
function inlineDataUrls(messages: ModelMessage[]): ModelMessage[] {
  return messages.map((msg) => {
    if (msg.role !== "user" || typeof msg.content === "string") return msg;
    return {
      ...msg,
      content: msg.content.map((part) => {
        if (part.type !== "file" || typeof part.data !== "string") return part;
        const match = part.data.match(/^data:([^;]+);base64,(.+)$/);
        if (!match) return part;
        const bytes = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0));
        return { ...part, data: bytes, mediaType: match[1] };
      })
    };
  });
}

export class ChatAgent extends AIChatAgent<Env> {
  // How many messages to keep in persistent storage per conversation
  maxPersistedMessages = 100;

  onStart() {
    // Handle OAuth popups for MCP servers that require login
    this.mcp.configureOAuthCallback({
      customHandler: (result) => {
        if (result.authSuccess) {
          return new Response("<script>window.close();</script>", {
            headers: { "content-type": "text/html" },
            status: 200
          });
        }
        return new Response(
          `Authentication Failed: ${result.authError || "Unknown error"}`,
          { headers: { "content-type": "text/plain" }, status: 400 }
        );
      }
    });
  }

  @callable()
  async addServer(name: string, url: string) {
    return await this.addMcpServer(name, url);
  }

  @callable()
  async removeServer(serverId: string) {
    await this.removeMcpServer(serverId);
  }

  async onChatMessage(_onFinish: unknown, options?: OnChatMessageOptions) {
    // Pick up any tools from connected MCP servers
    const mcpTools = this.mcp.getAITools();
    const workersai = createWorkersAI({ binding: this.env.AI });

    const result = streamText({
      // Llama 3.3 70B via Cloudflare Workers AI — solid instruction-following
      // and good at technical explanations without needing a paid API key
      model: workersai("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
        sessionAffinity: this.sessionAffinity
      }),
      system: SYSTEM_PROMPT,
      // Trim old tool call history to keep things reasonable on long conversations
      messages: pruneMessages({
        messages: inlineDataUrls(await convertToModelMessages(this.messages)),
        toolCalls: "before-last-2-messages"
      }),
      tools: {
        ...mcpTools
      },
      stopWhen: stepCountIs(5),
      abortSignal: options?.abortSignal
    });

    return result.toUIMessageStreamResponse();
  }
}

export default {
  async fetch(request: Request, env: Env) {
    return (
      (await routeAgentRequest(request, env)) ||
      new Response("Not found", { status: 404 })
    );
  }
} satisfies ExportedHandler<Env>;
