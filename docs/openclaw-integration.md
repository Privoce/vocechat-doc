---
sidebar_position: 3.4
title: OpenClaw Integration
---

# Integrating VoceChat with OpenClaw via Plugin

## What this plugin already implements

The current VoceChat plugin already covers the core integration flow:

- Receive inbound VoceChat webhook messages
- Route messages into OpenClaw
- Send OpenClaw replies back to VoceChat
- Support sending text messages
- Support sending replies
- Support file upload and attachment sending
- Expose a `GET /` health check endpoint

In other words, VoceChat can be used directly as the chat frontend for OpenClaw.

## Overall architecture

```text
VoceChat Users / Groups
          |
          v
VoceChat Bot Webhook (HTTP POST /)
          |
          v
OpenClaw Gateway + VoceChat Plugin
          |
          v
OpenClaw Agent Runtime
          |
          v
VoceChat Bot API
```

## Prerequisites

Before you begin, make sure you have:

- A working **VoceChat** service
- A working **OpenClaw** deployment
- The VoceChat plugin source code or plugin package available locally
- A VoceChat Bot and its corresponding API Key
- A public address that allows VoceChat to access the OpenClaw webhook port

## Quick start

If you have already deployed OpenClaw, you can simply send this page to it and let it help you with the configuration and setup steps.

## Step 1: Create a Bot in VoceChat

Go to:

`Settings => Bot&Webhook`

Create a Bot for OpenClaw, for example:

- Bot Name: `OpenClaw`
- Webhook URL: leave it empty for now

Then create and save an **API Key** for this Bot.

At minimum, record these two values:

- **VoceChat server URL**
- **Bot API Key**

## Step 2: Load the VoceChat plugin in OpenClaw

Enable local plugins in the OpenClaw configuration.

Example:

```json
{
  "plugins": {
    "allow": ["vocechat"],
    "load": {
      "paths": [
        "/root/.openclaw/workspace/vocechat"
      ]
    },
    "entries": {
      "vocechat": {
        "enabled": true
      }
    }
  }
}
```

This configuration tells OpenClaw to load the `vocechat` channel plugin from a local path.

## Step 3: Configure `channels.vocechat`

Add a `channels.vocechat` section to `openclaw.json`.

Example:

```json
{
  "channels": {
    "vocechat": {
      "enabled": true,
      "serverUrl": "https://your-vocechat.example.com",
      "apiKey": "YOUR_BOT_API_KEY",
      "webhookHost": "0.0.0.0",
      "webhookPort": 8010
    }
  }
}
```

Field descriptions:

- `serverUrl`: The root URL of your VoceChat service
- `apiKey`: The VoceChat Bot API Key
- `webhookHost`: The webhook bind address, usually `0.0.0.0`
- `webhookPort`: The webhook listening port, default is `8010`

This plugin supports top-level default account configuration. If needed, you can also configure multiple accounts under `channels.vocechat.accounts`.

## Step 4: Ensure OpenClaw has sufficient tool permissions

The plugin repository documentation recommends explicitly granting adequate tool permissions to OpenClaw.

Example:

```json
{
  "tools": {
    "profile": "full",
    "allow": ["*"],
    "exec": {
      "host": "gateway",
      "security": "full",
      "ask": "off"
    }
  }
}
```

If permissions are insufficient, some runtime behaviors may be incomplete.

## Step 5: Expose the webhook port

This plugin starts an HTTP webhook server inside OpenClaw.

Default behavior:

- `GET /` → returns `200 ok`
- `POST /` → receives VoceChat webhook payloads

Default bind address:

```text
0.0.0.0:8010
```

If you are using Docker or Docker Compose, remember to expose port `8010`.

Example:

```yaml
ports:
  - "18789:18789"
  - "8010:8010"
```

## Step 6: Point the VoceChat webhook to OpenClaw

After OpenClaw starts and loads the plugin, go back to the Bot configuration page in VoceChat and set the webhook URL to the public address exposed by OpenClaw.

For example:

```text
http://YOUR_OPENCLAW_HOST:8010/
```

VoceChat will validate the webhook URL, and since this plugin already includes a built-in `GET /` health check, it can be used directly for verification.

## Step 7: Restart the OpenClaw Gateway

After modifying the configuration, restart the gateway.

Common commands:

```bash
openclaw gateway status
openclaw gateway restart
```

If you are running OpenClaw with Docker Compose, you can also restart the corresponding container there.

## How inbound messages are handled

The plugin receives VoceChat events through `POST /`.

It already handles the basic inbound flow for you:

- Parse the webhook JSON
- Determine whether the event is from a private chat or a group chat
- Extract the message content
- Ignore unsupported edit / delete events
- Route the message into OpenClaw
- Record the inbound session
- Send OpenClaw replies back to VoceChat

The internal target formats used by the plugin are:

- `vocechat:private:<uid>`
- `vocechat:group:<gid>`

## Currently supported capabilities

Currently implemented:

- Private chat
- Group chat
- Text replies
- Reply sending
- Media / file outbound upload
- Basic health check
- Bot API–based status probing

## Verification checklist

After configuration, it is recommended to verify the setup using the following checklist:

1. `GET http://YOUR_OPENCLAW_HOST:8010/` returns `ok`
2. VoceChat can successfully save the webhook URL
3. Messages sent to the Bot in private chat reach OpenClaw
4. OpenClaw replies return to the same conversation
5. If testing group chat, the Bot can speak normally in the group

## Troubleshooting

### VoceChat cannot save the webhook

Check:

- Whether the OpenClaw address is reachable from VoceChat
- Whether `GET /` on the webhook URL returns `200`
- Whether port `8010` is exposed
- Whether your reverse proxy forwards requests correctly to the OpenClaw webhook port

### OpenClaw does not receive any messages at all

Check:

- Whether `vocechat` is allowed and enabled in `plugins`
- Whether the plugin path is correct
- Whether `channels.vocechat.enabled` is set to `true`
- Whether you restarted the gateway after changing the configuration

### OpenClaw receives messages but cannot send replies back

Check:

- Whether `serverUrl` is correct
- Whether `apiKey` is valid
- Whether the Bot still has permission to send messages to the target private chat or group
- If testing group chat, whether the Bot has already been added to that group

### The plugin replies to the wrong conversation

Check:

- Whether the inbound event target is actually a private chat or a group chat
- Whether the Bot account currently in use is the one you expect
- If multiple VoceChat accounts are configured, whether routing is going to the correct account

## Related implementation details

The channel id registered by this plugin in OpenClaw is `vocechat`.

Some key implementation points:

- plugin id: `vocechat`
- inbound webhook: `GET /` and `POST /`
- default webhook port: `8010`
- outbound target format:
  - `vocechat:private:<uid>`
  - `vocechat:group:<gid>`

## Related documentation

- [Bot and Webhook](/bot/bot-and-webhook)
- [API Doc](/api-doc)