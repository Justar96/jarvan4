# 🚀 Jar4 — AI-Powered Multi-Channel Messaging Gateway

<p align="center">
  <img src="README-header.png" alt="Jar4" width="600"/>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.12.0-brightgreen)](https://nodejs.org/)
[![Railway](https://img.shields.io/badge/Deploy-Railway-blueviolet)](https://railway.app)

**Jar4** is a powerful AI assistant platform that connects to multiple messaging channels (WhatsApp, Telegram, Discord, Slack, Signal, iMessage, LINE, and more) with an embedded AI agent powered by state-of-the-art language models.

## ✨ Features

- **Multi-Channel Support**: WhatsApp, Telegram, Discord, Slack, Signal, iMessage, LINE, MS Teams, Matrix, and more
- **AI-Powered**: Integrated with Claude, GPT, Gemini, and other leading AI models
- **Plugin Architecture**: Extensible with custom channels, tools, and skills
- **Gateway Server**: WebSocket and HTTP API for real-time communication
- **Sandbox Execution**: Secure code execution in isolated Docker containers
- **Skills System**: Pre-built workflows for common tasks
- **Cross-Platform**: Works on Linux, macOS, and Windows

## 🚀 Quick Start

### Install via npm

```bash
npm install -g jar4
```

### Or run directly

```bash
npx jar4 onboard
```

### From source (development)

```bash
git clone https://github.com/your-org/jar4.git
cd jar4
pnpm install
pnpm build
pnpm jar4 onboard
```

## 📦 Deploy to Railway

Jar4 is designed to run on Railway with minimal configuration.

### One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/jar4)

### Manual Deployment

1. Fork this repository
2. Create a new project on [Railway](https://railway.app)
3. Connect your GitHub repository
4. Set environment variables (see below)
5. Deploy!

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JAR4_ANTHROPIC_API_KEY` | Anthropic API key for Claude | Yes* |
| `JAR4_OPENAI_API_KEY` | OpenAI API key | Yes* |
| `JAR4_GATEWAY_PORT` | Gateway server port (default: 3000) | No |
| `JAR4_GATEWAY_AUTH_TOKEN` | Auth token for gateway access | Recommended |
| `JAR4_TELEGRAM_BOT_TOKEN` | Telegram bot token | For Telegram |
| `JAR4_DISCORD_BOT_TOKEN` | Discord bot token | For Discord |
| `JAR4_SLACK_BOT_TOKEN` | Slack bot token | For Slack |

*At least one AI provider key is required

## 🛠️ Configuration

Configuration is stored in `~/.jar4/config.yaml`:

```yaml
# Model settings
models:
  default: claude-sonnet-4-20250514
  
# Channel settings
channels:
  telegram:
    enabled: true
    token: ${JAR4_TELEGRAM_BOT_TOKEN}
  discord:
    enabled: true
    token: ${JAR4_DISCORD_BOT_TOKEN}

# Gateway settings
gateway:
  port: 3000
  auth:
    token: ${JAR4_GATEWAY_AUTH_TOKEN}
```

## 📚 Commands

```bash
# Start the gateway server
jar4 gateway run

# Run AI agent interactively
jar4 agent

# Send a message
jar4 message send --to "user@example.com" --text "Hello!"

# Check system status
jar4 status

# Run diagnostics
jar4 doctor

# Configure settings
jar4 config set gateway.port 3000
```

## 🧩 Extensions

Jar4 supports plugins for additional functionality:

- **Channels**: Add new messaging platforms
- **Providers**: Add new AI model providers
- **Tools**: Add custom AI capabilities
- **Skills**: Add pre-built workflows

### Creating a Plugin

```typescript
import type { Jar4PluginApi } from "jar4/plugin-sdk";

export default function register(api: Jar4PluginApi) {
  api.registerTool({
    name: "my_tool",
    description: "Does something useful",
    parameters: { /* schema */ },
    handler: async (params) => {
      return { result: "success" };
    }
  });
}
```

## 🔒 Security

- All credentials stored securely in `~/.jar4/credentials/`
- Gateway authentication via tokens
- Sandbox execution for untrusted code
- Allowlist-based access control for channels

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                  Gateway                     │
│  (WebSocket + HTTP API)                     │
├─────────────────────────────────────────────┤
│                  Agents                      │
│  (AI Execution, Tools, Skills)              │
├─────────────────────────────────────────────┤
│                 Channels                     │
│  (WhatsApp, Telegram, Discord, ...)         │
├─────────────────────────────────────────────┤
│                Extensions                    │
│  (Plugins, Custom Channels, Providers)      │
└─────────────────────────────────────────────┘
```

## 📖 Documentation

- [Getting Started](docs/start/getting-started.md)
- [Configuration Guide](docs/configuration.md)
- [Channel Setup](docs/channels/)
- [Plugin Development](docs/plugins/)
- [API Reference](docs/reference/)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built on the shoulders of giants:
- [Baileys](https://github.com/whiskeysockets/baileys) - WhatsApp Web API
- [Grammy](https://grammy.dev/) - Telegram Bot Framework
- [Discord.js](https://discord.js.org/) - Discord API
- [Pi Agent](https://github.com/mariozechner/pi-agent-core) - AI Agent Framework

---

<p align="center">
  Made with ❤️ by the Jar4 Team
</p>