# EcoFlow for Raycast

Monitor and control your EcoFlow devices directly from Raycast. View battery levels, power input/output, and send commands to your portable power stations, smart plugs, microinverters, and more — all with AI support.

## Features

- **Device Dashboard** — See all your EcoFlow devices at a glance with battery level, charging state, power usage, and online status
- **Device Detail** — Full device-specific breakdown with all available metrics
- **Device Control** — Send commands with confirmation dialogs — toggle outputs, set limits, change modes
- **AI Tools** — Ask Raycast AI to check status or control devices using natural language
- **Auto-Discovery** — All devices are fetched automatically from the EcoFlow API

## Supported Devices

### Power Stations

**Delta Pro, Delta Pro Ultra, Delta Max, Delta Mini, River Pro** (TCP protocol)
**Delta 2, Delta 2 Max, River 2, River 2 Max, River 2 Pro** (HTTP protocol)

- Battery level, solar/AC input, AC/DC/USB output, charging state
- Time to full charge / remaining discharge time
- Temperature, cycle count, charge/discharge limits
- **Commands:** AC output on/off, DC output on/off, set charge limit, set discharge limit, set AC charging power, silent mode

### Smart Plug

- On/off state, power consumption (watts), voltage, current, temperature
- LED indicator brightness
- **Commands:** Turn on/off, set LED brightness (0–1023)

### PowerStream Microinverter

- PV1/PV2 solar input, inverter output, battery SOC
- Supply priority, custom load power setting
- **Commands:** Set supply priority (power supply vs battery charging), set custom load power (0–600W), set battery charge upper limit (70–100%), set battery discharge lower limit (1–30%)

### Wave 2 Portable AC

- Mode (cool/heat/fan), target temperature, environment temperature, fan speed
- Battery level
- **Commands:** Set mode, set temperature (16–30°C), enable/disable buzzer

### Glacier Portable Fridge

- Left/right zone temperatures, ice making status, eco mode
- Battery level
- **Commands:** Set temperature (-25 to 10°C), eco mode on/off, ice making on/off, enable/disable buzzer

### Smart Home Panel / Smart Home Panel 2

- Device monitoring (read-only)

## Setup

1. Register at [developer.ecoflow.com](https://developer.ecoflow.com) and create API credentials
2. Install the extension in Raycast
3. Open extension preferences and enter your **Access Key**, **Secret Key**, and select your **Region** (Europe or Americas)
4. All your devices appear automatically

## Commands

| Command | Description |
|---------|-------------|
| List Devices | View all devices with battery, power, and online status |
| Device Detail | Detailed view with all device-specific metrics |
| Control Device | Send commands to any device with confirmation |

## AI Tools

Mention `@ecoflow` in Raycast AI Chat to use natural language:

- "What's the battery level of my Delta Pro?"
- "Turn on the AC output on my River 2"
- "Turn on my Smart Plug"
- "Set my PowerStream supply priority to battery charging"
- "Set the temperature on my Wave 2 to 22 degrees"
- "Start ice making on my Glacier"

Control commands require confirmation before executing.

## Development

```bash
npm install
npm run dev    # Start development mode
npm run build  # Build for production
npm run lint   # Check for issues
```
