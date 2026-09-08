# Webull Intelligence Terminal & Quantitative Portfolio Engine

[![Live Deployment](https://img.shields.io/badge/Production-Netlify%20Edge-00e5ff?style=flat-square&logo=netlify)](https://vantixtracker.netlify.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-gabelossless%2Fbullish-181717?style=flat-square&logo=github)](https://github.com/gabelossless/bullish)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable%20Offline-00e676?style=flat-square&logo=pwa)](https://vantixtracker.netlify.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

> **Institutional-Grade Multi-Asset Quantitative Trading Terminal & PWA**  
> Real-time WebSocket streaming, dual-chart stochastic engine (Monte Carlo Jump-Diffusion & TradingView Candlesticks), Break-Even matrix analytics, and Half-Kelly capital allocation for **Webull (NASDAQ: BULL)**, **Robinhood (HOOD)**, **Coinbase (COIN)**, **Monad Network (MON)**, **Solana (SOL)**, and **Kaspa (KAS)**.

---

## 🌐 Live Production Access

- **Production Terminal**: **[https://vantixtracker.netlify.app](https://vantixtracker.netlify.app)**
- **GitHub Repository**: **[https://github.com/gabelossless/bullish](https://github.com/gabelossless/bullish)**
- **Install as App (PWA)**: Works standalone on **iOS Safari** (*Share → Add to Home Screen*) and **Android / Chrome** (*Install App button*).

---

## ⚡ Key Capabilities & Architecture

```text
WEBULL + MONAD/
├── index.html                   # Semantic HTML5 app shell & PWA configuration
├── manifest.json                # Web App Manifest (standalone, theme, shortcuts)
├── sw.js                        # Service Worker (Stale-While-Revalidate & offline cache)
├── netlify.toml                 # Netlify Edge headers, routing & caching policy
├── css/
│   ├── theme.css                # Obsidian luxury design system, typography & variables
│   ├── layout.css               # Desktop grid, glass cards, sliders & modals
│   └── mobile.css               # iOS Safe Area insets, touch ergonomics, mobile dock
├── js/
│   ├── config.js                # Multi-asset models, parameters & formatters
│   ├── oracle.js                # Coinbase & OKX WebSockets + REST fallback engine
│   ├── chart-mc.js              # Canvas Monte Carlo engine with mobile touch scrubbing
│   ├── chart-tv.js              # TradingView Lightweight Candlestick engine
│   ├── calculator.js            # Break-even matrix, Half-Kelly allocation, comparison
│   ├── pwa.js                   # PWA install prompt handler & iOS Safari modal
│   └── app.js                   # Main application coordinator & lifecycle bootstrap
└── icons/
    ├── icon-192.png             # Android & PWA app icon (192x192)
    ├── icon-512.png             # Android & PWA app icon (512x512)
    ├── apple-touch-icon.png     # iOS Safari Home Screen icon (180x180)
    └── favicon.svg              # Scalable vector favicon
```

---

### 1. Dual Charting Engine

1. **Monte Carlo Stochastic Engine (`js/chart-mc.js`)**:
   - **Geometric Brownian Motion & Merton Jump-Diffusion**: Simulates realistic market paths including sudden discontinuous liquidity shocks ($lambda=4.0, \mu_{\text{jump}}=-5\%, \sigma_{\text{jump}}=15\%$).
   - **Quantile Confidence Cloud**: 10th to 90th percentile fan cone showing probability boundaries.
   - **Terminal Bell Curve**: Discrete price probability histogram with profit/loss color segmentation.
   - **Mobile Touch Scrubbing**: Drag finger across the canvas on touchscreens to inspect day-by-day expected median prices and percentiles.
   - **1-Click Macro Scenarios**: *Base Consensus*, *Institutional Expansion (+2.5σ)*, *Mean Reversion / Low Vol*, and *Liquidity Stress Shock (-2.0σ)*.

2. **TradingView Lightweight Charts (`js/chart-tv.js`)**:
   - High-performance Canvas/WebGL Candlestick series.
   - **EMA 20 (Cyan)** and **EMA 50 (Amber)** trend ribbon overlays.
   - Volume profile histogram with buy/sell color coding.
   - Live WebSocket tick integration dynamically updating candle highs, lows, and closes in real time.

---

### 2. Live Market Oracles & Sub-100ms Feeds (`js/oracle.js`)

- **Coinbase WebSocket Feed** (`wss://ws-feed.exchange.coinbase.com`): Real-time ticker prints for `SOL-USD`.
- **OKX Public V5 WebSocket** (`wss://ws.okx.com:8443/ws/v5/public`): Real-time trade streaming for `MON-USDT`, `KAS-USDT`, and `SOL-USDT`.
- **Yahoo Finance Proxy**: Spot feeds for equities (`BULL`, `HOOD`, `COIN`).
- **Telemetry Bar**: Live latency tracking (`WS PING: 42ms`), throughput monitor (`Ticks/Sec`), and connection status indicators.

---

### 3. Mobile Ergonomics (iOS & Android) (`css/mobile.css`)

- **Safe Area Inset Handling**: Full support for `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` clearing the iPhone Dynamic Island, notch, and Android gesture navigation bar.
- **Mobile Bottom Navigation Dock**: 5 quick-access tabs on screens `< 768px`:
  - **Assets**: Quick navigation through all 6 tickers.
  - **Chart**: Focuses dual-chart engine.
  - **P&L Risk**: Jumps to Break-Even sizing and Half-Kelly allocation.
  - **Matrix**: Opens cross-asset comparison dashboard.
  - **App**: One-tap PWA installation or iOS Home Screen guide.
- **Touch-First Controls**: Minimum 44x44px tap targets, 26px slider thumbs, and form fields formatted to `16px` to prevent unwanted iOS Safari auto-zooming.

---

### 4. Progressive Web App (PWA) & Offline Mode

- **Manifest (`manifest.json`)**: Configured with `display: "standalone"`, launching full-screen without browser URL bars on iOS and Android. Includes custom quick shortcuts for `BULL`, `MONAD`, `SOL`, and `Comparison`.
- **Service Worker (`sw.js`)**: Stale-While-Revalidate caching strategy pre-caching core app shell, fonts, and chart libraries. The quantitative simulation runs 100% offline.
- **Native Install Experiences**:
  - **Android / Chrome**: In-app install banner with one-tap installation.
  - **iOS Safari**: Clean interactive modal guiding users through *Share ⎋ → Add to Home Screen ➕*.

---

## 📊 Assets Covered & Pricing Calibration

| Symbol | Name | Asset Class | Primary Oracle Feed | Strategic Focus |
|---|---|---|---|---|
| **BULL** | Webull Corporation | NASDAQ Equity | Yahoo Finance Proxy | $11.00 Institutional Break-Even Parity Pivot |
| **HOOD** | Robinhood Markets | NASDAQ Equity | Robinhood / Yahoo Proxy | Legend Active Trader Terminal & Yield Retention |
| **COIN** | Coinbase Global | NASDAQ Equity | Coinbase / Yahoo Proxy | High-Beta Crypto Proxy & Layer-2 Base Fees |
| **MONAD** | Monad Network (MON) | High-Throughput L1 | OKX V5 WebSocket (Live) | 10,000 TPS Parallel EVM Price Discovery (~$0.0255) |
| **SOL** | Solana | Layer-1 Crypto | Coinbase WebSocket (Live) | Institutional DeFi & High-Frequency Clearing (~$103.50) |
| **KAS** | Kaspa BlockDAG | PoW BlockDAG | OKX V5 WebSocket (Live) | Sub-Second GHOSTDAG Consensus Alpha (~$0.0361) |

---

## 💼 Break-Even & Risk Engine

- **Real-Time P&L Sensitivity**: User-adjustable cost basis and position scale updating total dollar gain/loss and distance to parity.
- **Half-Kelly Capital Allocation**:
  $$\text{Allocation} = \max\left(0, \frac{p \cdot b - (1 - p)}{b} \times 0.5\right)$$
  Calculated across 3 automated execution tiers:
  1. **Breakout Momentum**
  2. **Optimal Retest (Recommended)**
  3. **Deep Value Accumulation**

---

## 🚀 Deployment & CI/CD

### Netlify Edge (Configured)
The repository includes [`netlify.toml`](netlify.toml) specifying zero-build static hosting and custom HTTP cache headers for the Service Worker and Web App Manifest:
- Every push to `main` on GitHub triggers an automatic deploy to Netlify Edge in under 15 seconds.

### GitHub Pages (Configured)
A GitHub Actions workflow (`.github/workflows/deploy.yml`) is included for dual-deployment redundancy.

---

## 📄 License
MIT License. Created for quantitative finance research, executive demonstration, and institutional trading.
