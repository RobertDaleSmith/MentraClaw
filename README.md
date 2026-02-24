# MentraOS OpenClaw Plugin

Bidirectional communication channel plugin for MentraOS smart glasses integration with OpenClaw.

## Features

- **Bidirectional Communication**: Receive voice transcriptions and photos from MentraOS, send responses back via TTS
- **Webhook Server**: Built-in webhook server to receive MentraOS events
- **Voice Transcriptions**: Process voice input from smart glasses users
- **Photo Processing**: Handle photos captured with smart glasses camera
- **TTS Responses**: Send text responses back to glasses as speech
- **Session Management**: Handle user sessions and conversation state

## Configuration

Add the MentraOS channel configuration to your OpenClaw config:

```json
{
  "channels": {
    "mentraos": {
      "enabled": true,
      "apiKey": "your-mentraos-api-key-here",
      "apiUrl": "https://api.mentra.glass",
      "webhookPort": 3978
    }
  }
}
```

### Configuration Options

- `enabled` (boolean): Enable/disable the MentraOS channel
- `apiKey` (string): Your MentraOS API key for sending TTS responses
- `apiUrl` (string): MentraOS API base URL (default: https://api.mentra.glass)
- `webhookPort` (number): Port for webhook server (default: 3978, range: 1024-65535)

## Setup Instructions

### 1. Install and Configure

The plugin is already installed in your OpenClaw extensions directory. Update your OpenClaw configuration with the MentraOS settings above.

### 2. Obtain MentraOS API Key

1. Go to [console.mentra.glass](https://console.mentra.glass/)
2. Create or select your MentraOS app
3. Copy your API key to the configuration

### 3. Set Up Public Webhook URL

Since MentraOS needs to send webhooks to your OpenClaw instance, you need a public URL:

**Using ngrok (recommended for testing):**
```bash
ngrok http 3978
```
This will give you a URL like `https://abc123.ngrok.io`

**Using Tailscale Funnel:**
```bash
tailscale funnel 3978
```

### 4. Configure MentraOS App

In the MentraOS developer console:
1. Set your app's webhook URL to: `https://your-public-url/webhook`
2. Enable microphone permissions for voice transcriptions
3. Enable camera permissions for photo capture (optional)

### 5. Test the Integration

1. Start OpenClaw: `openclaw gateway start`
2. Check channel status: `openclaw status`
3. The MentraOS channel should show as "OK" if properly configured
4. Look for webhook server startup logs

## How It Works

### Inbound: MentraOS → OpenClaw
1. User speaks to smart glasses
2. MentraOS transcribes speech and sends webhook to `/webhook`
3. Plugin receives webhook, routes transcription to OpenClaw agent
4. Agent processes the message and generates response

### Outbound: OpenClaw → MentraOS  
1. OpenClaw agent generates response text
2. Plugin sends response to MentraOS API
3. MentraOS converts text to speech and plays on glasses
4. User hears the response

### Photo Processing
1. User takes photo with smart glasses camera
2. MentraOS sends photo data via webhook
3. Plugin routes photo to OpenClaw agent for analysis
4. Agent analyzes photo and generates description/response
5. Response is sent back as speech

## Webhook Endpoints

The plugin exposes these endpoints:

- `POST /webhook` - Main webhook endpoint for MentraOS events
- `GET /health` - Health check endpoint

## Supported Event Types

- `transcription` - Voice transcriptions from smart glasses microphone
- `photo` - Photos captured with smart glasses camera  
- `session_start` - User session initialization
- `session_end` - User session termination

## Troubleshooting

### Channel Shows "SETUP - not configured"
- Verify `apiKey` is set in your config
- Ensure `enabled: true` is set
- Restart OpenClaw after config changes

### Webhook Server Not Starting
- Check if port is already in use: `lsof -i :3978`
- Try a different `webhookPort` in config
- Check OpenClaw logs for error messages

### MentraOS Not Receiving Responses
- Verify your MentraOS API key is correct
- Check that `apiUrl` matches your MentraOS instance
- Look for API errors in OpenClaw logs

### No Webhooks Received
- Verify ngrok/tunnel is running and accessible
- Check MentraOS console webhook URL configuration
- Test webhook endpoint: `curl https://your-url/health`

## Development

### Building from Source

```bash
cd /path/to/mentraos-plugin
npm install
npm run build
```

### Plugin Structure

- `src/channel.ts` - Main channel plugin implementation
- `src/webhook.ts` - Webhook server and MentraOS API client
- `src/runtime.ts` - OpenClaw runtime interface
- `src/lifecycle.ts` - Plugin lifecycle management
- `index.ts` - Plugin entry point and registration

## API Reference

### Webhook Payload Format

```typescript
interface MentraWebhookPayload {
  type: 'transcription' | 'photo' | 'session_start' | 'session_end';
  userId: string;
  sessionId: string;
  data?: {
    text?: string;           // Transcription text
    isFinal?: boolean;       // Whether transcription is final
    imageBuffer?: string;    // Base64 encoded image
    mimeType?: string;       // Image MIME type
  };
}
```

### MentraOS API Response Format

```typescript
// TTS Request to MentraOS API
{
  userId: string;
  text: string;
  voice: string;
}
```

## License

MIT - See LICENSE file for details