# Deploying Jar4 to Railway

This guide covers deploying Jar4 to [Railway](https://railway.app), a modern cloud platform that makes it easy to deploy applications.

## Prerequisites

- A Railway account ([sign up here](https://railway.app))
- A GitHub account (for easy deployment)
- At least one AI provider API key (Anthropic, OpenAI, etc.)

## Quick Deploy

### Option 1: One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/jar4)

Click the button above to deploy Jar4 directly to Railway with default settings.

### Option 2: Deploy from GitHub

1. Fork this repository to your GitHub account
2. Log in to [Railway](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your forked repository
5. Railway will automatically detect the configuration and start building

## Environment Variables

Configure these environment variables in Railway's dashboard under your project settings:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `JAR4_ANTHROPIC_API_KEY` | Anthropic API key for Claude models | `sk-ant-...` |
| `JAR4_OPENAI_API_KEY` | OpenAI API key (alternative to Anthropic) | `sk-...` |

**Note:** At least one AI provider key is required.

### Gateway Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port (set by Railway automatically) | `3000` |
| `JAR4_GATEWAY_AUTH_TOKEN` | Authentication token for gateway access | (generate a secure token) |
| `JAR4_GATEWAY_MODE` | Gateway mode (`local` or `remote`) | `local` |

### Channel Configuration (Optional)

| Variable | Description |
|----------|-------------|
| `JAR4_TELEGRAM_BOT_TOKEN` | Telegram bot token from @BotFather |
| `JAR4_DISCORD_BOT_TOKEN` | Discord bot token |
| `JAR4_SLACK_BOT_TOKEN` | Slack bot OAuth token |
| `JAR4_SLACK_APP_TOKEN` | Slack app-level token |

### Storage Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `JAR4_STATE_DIR` | Directory for state/config files | `~/.jar4` |
| `JAR4_WORKSPACE_DIR` | Agent workspace directory | `~/jar4-workspace` |

## Build Configuration

Railway will automatically detect and use these configuration files:

- `railway.json` - Railway-specific build and deploy settings
- `nixpacks.toml` - Nixpacks build configuration
- `Dockerfile` - Container build instructions

### Build Process

1. Railway detects Node.js project
2. Installs dependencies with `pnpm install`
3. Builds the project with `pnpm build`
4. Starts the gateway server

## Persistent Storage

For production deployments, you should add a volume for persistent storage:

1. Go to your Railway project
2. Click "New" → "Database" or "Volume"
3. Add a volume mounted at `/data`
4. Set environment variables:
   - `JAR4_STATE_DIR=/data/.jar4`
   - `JAR4_WORKSPACE_DIR=/data/workspace`

This ensures your configuration and session data persist across deployments.

## Health Checks

The gateway exposes a health check endpoint at `/health`. Railway uses this to monitor your service:

```json
{
  "status": "ok",
  "version": "2026.1.26"
}
```

## Scaling

Railway supports horizontal scaling. For Jar4:

- **Single Instance**: Recommended for personal use
- **Multiple Instances**: Requires shared state (Redis/PostgreSQL)

For multiple instances, configure:
- External Redis for session state
- External PostgreSQL for configuration

## Networking

### Custom Domain

1. Go to Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

### WebSocket Support

Railway fully supports WebSocket connections. The Jar4 gateway uses WebSockets for real-time communication.

## Monitoring

### Logs

View logs in Railway dashboard or CLI:

```bash
railway logs
```

### Metrics

Railway provides built-in metrics:
- Memory usage
- CPU usage
- Network traffic
- Request count

## Troubleshooting

### Build Failures

**Problem**: `pnpm install` fails
**Solution**: Ensure `pnpm-lock.yaml` is committed and up to date

**Problem**: Node version mismatch
**Solution**: Jar4 requires Node 22+. Railway's Nixpacks uses the correct version automatically.

### Runtime Issues

**Problem**: Gateway doesn't start
**Solution**: Check that PORT environment variable is correctly used

**Problem**: Cannot connect to gateway
**Solution**: Ensure the gateway is binding to `0.0.0.0`, not `127.0.0.1`

### Channel Connection Issues

**Problem**: Telegram/Discord bot not responding
**Solution**: Verify bot tokens are correctly set in environment variables

## Security Recommendations

1. **Always set `JAR4_GATEWAY_AUTH_TOKEN`** - Prevents unauthorized access
2. **Use Railway's secrets** - Never commit API keys to git
3. **Enable HTTPS** - Railway provides this automatically
4. **Restrict CORS** - Configure allowed origins if exposing API

## Example Configuration

Here's a complete Railway environment setup:

```
# AI Providers (at least one required)
JAR4_ANTHROPIC_API_KEY=sk-ant-xxxxx
JAR4_OPENAI_API_KEY=sk-xxxxx

# Gateway Settings
JAR4_GATEWAY_AUTH_TOKEN=your-secure-random-token
JAR4_GATEWAY_MODE=local

# Storage (with volume mounted at /data)
JAR4_STATE_DIR=/data/.jar4
JAR4_WORKSPACE_DIR=/data/workspace

# Channels (optional)
JAR4_TELEGRAM_BOT_TOKEN=123456789:ABC-xxxxx
JAR4_DISCORD_BOT_TOKEN=xxxxx.xxxxx.xxxxx
```

## Next Steps

After deployment:

1. Access your gateway at `https://your-project.up.railway.app`
2. Run the onboarding wizard: `npx jar4 onboard --remote https://your-project.up.railway.app`
3. Configure your messaging channels
4. Start chatting with your AI assistant!

## Support

- [Jar4 Documentation](../index.md)
- [Railway Documentation](https://docs.railway.app)
- [GitHub Issues](https://github.com/your-org/jar4/issues)