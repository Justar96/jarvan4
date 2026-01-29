# Railway Deployment Guide

Deploy Jar4 AI Gateway to Railway with full WebUI support for channel and plugin configuration.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/jar4)

## Quick Start

1. Click the deploy button above or connect your GitHub repo to Railway
2. Set required environment variables (see below)
3. Deploy and access your gateway at the Railway-provided URL
4. Use the WebUI to configure channels, plugins, and agents

## Environment Variables

### Required

| Variable | Description |
|----------|-------------|
| `PORT` | Auto-set by Railway |

### AI Provider (set at least one)

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Claude API key |
| `OPENAI_API_KEY` | OpenAI API key |
| `GEMINI_API_KEY` | Google Gemini API key |

### Gateway Security

| Variable | Description |
|----------|-------------|
| `JAR4_GATEWAY_TOKEN` | Auth token for API access (recommended) |

### Channels (optional - configure as needed)

#### Telegram
| Variable | Description |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather |

#### Discord
| Variable | Description |
|----------|-------------|
| `DISCORD_BOT_TOKEN` | Discord bot token |
| `DISCORD_APPLICATION_ID` | Discord application ID |

#### Slack
| Variable | Description |
|----------|-------------|
| `SLACK_BOT_TOKEN` | Slack bot OAuth token |
| `SLACK_SIGNING_SECRET` | Slack app signing secret |

#### WhatsApp (Twilio)
| Variable | Description |
|----------|-------------|
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_WHATSAPP_FROM` | WhatsApp-enabled Twilio number (e.g., `whatsapp:+1234567890`) |

#### Line
| Variable | Description |
|----------|-------------|
| `LINE_CHANNEL_SECRET` | Line channel secret |
| `LINE_CHANNEL_ACCESS_TOKEN` | Line channel access token |

## WebUI Features

Access the WebUI at your Railway URL to:

- **Channels**: Configure and manage all messaging channels
- **Config**: Edit all settings with form-based UI
- **Chat**: Test conversations with your AI agent
- **Sessions**: View active sessions
- **Cron**: Schedule automated tasks
- **Logs**: Monitor gateway activity

## Health Check

The gateway exposes `/health` for Railway health checks, configured with a 60-second timeout.

## Local Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build && pnpm ui:build

# Run locally
node dist/entry.js gateway run --port 3000 --bind 0.0.0.0
```

## Docker

```bash
docker build -t jar4 .
docker run -p 3000:3000 -e PORT=3000 -e ANTHROPIC_API_KEY=your_key jar4
```
