# EcoFlow for Raycast

Monitor and control your EcoFlow devices directly from Raycast. View battery levels, power input/output, and send commands to your portable power stations — all with AI support.

## Features

- **List Devices** — See all your EcoFlow devices at a glance with battery level, charging state, and power usage
- **Device Detail** — Full breakdown: battery, solar/AC input, AC/DC/USB output, time estimates, temperature, and cycle count
- **Control Device** — Toggle AC/DC output, set charge/discharge limits with confirmation dialogs
- **AI Tools** — Ask Raycast AI about your devices: "What's my Delta Pro battery at?" or "Turn on AC output on my River 2"
- **Auto-Discovery** — All devices are fetched automatically from the EcoFlow API. No manual setup beyond entering your credentials.

## Supported Devices

Delta Pro, Delta Pro Ultra, Delta 2, Delta 2 Max, Delta Max, Delta Mini, River 2, River 2 Max, River 2 Pro, River Pro, PowerStream, Smart Home Panel, Smart Home Panel 2, Smart Plug, Wave 2, Glacier — and easily extensible for future products.

## Setup

1. Register at [developer.ecoflow.com](https://developer.ecoflow.com) and create API credentials (approval takes ~1 week)
2. Install the extension in Raycast
3. Open extension preferences and enter your **Access Key**, **Secret Key**, and select your **Region** (Europe or Americas)
4. All your devices appear automatically

## Commands

| Command | Description |
|---------|-------------|
| List Devices | View all devices with battery, power, and online status |
| Device Detail | Detailed view of a specific device |
| Control Device | Send commands (AC/DC toggle, charge limits) |

## AI Tools

Mention `@ecoflow` in Raycast AI Chat to use natural language:

- "What are my devices?"
- "What's the battery level of my Delta Pro?"
- "Turn on the AC output on my River 2"

Control commands require confirmation before executing.

## Development

```bash
npm install
npm run dev    # Start development mode
npm run build  # Build for production
npm run lint   # Check for issues
```
