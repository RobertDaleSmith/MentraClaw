<p align="center">
  <img src="logo.jpg" alt="FaceClaw" width="200" />
</p>

<h1 align="center">FaceClaw</h1>

<p align="center">
  Bridge MentraOS Smart Glasses to OpenClaw AI
</p>

---

An [OpenClaw](https://github.com/openclaw/openclaw) channel plugin that connects [**Mentra Live**](https://mentraglass.com/live) smart glasses to OpenClaw AI agents via the `@mentra/sdk` AppServer. Talk to your AI through your glasses.

> **Built for [Mentra Live](https://mentraglass.com/live)** — open-source smart glasses with an app store. [Get a pair →](https://mentraglass.com/live)

## Features

- **Voice interaction** — "Hey Mentra" wake word with 30s conversational follow-up window
- **Echo suppression** — prevents TTS feedback loops
- **Stop command** — say "stop" to interrupt TTS at any time
- **Photo capture** — snap a photo from your glasses and send it to the agent
- **Full OpenClaw channel** — config, status, routing, session management

## Architecture

```
Glasses → MentraOS → ngrok → AppServer (port 3335) → OpenClaw Agent → TTS → Glasses
```

The plugin runs an `@mentra/sdk` AppServer inside OpenClaw as a channel extension. No external bridge or serverless deployment needed.

## Setup

### 1. Install the plugin

Copy this repo into your OpenClaw extensions directory:

```bash
cp -r . ~/.openclaw/extensions/mentraos-plugin
cd ~/.openclaw/extensions/mentraos-plugin
npm install
npm run build
```

### 2. Configure OpenClaw

Add to your `openclaw.json`:

```json
{
  "channels": {
    "mentraos": {
      "enabled": true,
      "apiKey": "your-mentraos-api-key",
      "webhookPort": 3335
    }
  }
}
```

### 3. Expose the AppServer

The AppServer needs to be reachable from MentraOS cloud. Use ngrok or similar:

```bash
ngrok http 3335
```

### 4. Configure MentraOS

In the [MentraOS developer console](https://console.mentra.glass/):
- Set your app's webhook URL to your ngrok URL
- Package name: `com.openclaw.faceclaw`

### 5. Start OpenClaw

```bash
openclaw gateway start
```

Check status with `openclaw status` — MentraOS channel should show as OK.

## Usage

1. Put on your MentraOS glasses
2. Say **"Hey Mentra"** followed by your message
3. The agent responds via TTS through the glasses
4. Follow-up conversation is active for 30 seconds (no wake word needed)
5. Say **"stop"** to interrupt at any time

## Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `enabled` | `false` | Enable/disable the channel |
| `apiKey` | — | MentraOS API key (required) |
| `apiUrl` | `https://api.mentra.glass` | MentraOS API base URL |
| `webhookPort` | `3335` | AppServer port |

## Plugin Structure

```
├── index.ts                 # Plugin entry point
├── src/
│   ├── channel.ts           # Channel plugin (config, status, gateway, outbound)
│   └── runtime.ts           # OpenClaw runtime interface
├── openclaw.plugin.json     # Plugin manifest
├── package.json
└── tsconfig.json
```

## License

MIT
