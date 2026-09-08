# Webull Intelligence Terminal & Quantitative Portfolio Engine

> **Multi-Asset Stochastic Engine & Executive Intelligence Hub**  
> Benchmarking **Webull Corporation (NASDAQ: BULL)** alongside **Robinhood (HOOD)**, **Coinbase (COIN)**, **Monad Network (MON)**, **Solana (SOL)**, and **Kaspa (KAS)**.

---

## ⚡ Overview

The **Webull Intelligence Terminal** is a client-side quantitative demo and portfolio forecasting suite built for executive briefings, institutional traders, and fintech stakeholders.

Instead of static decks, this terminal provides an interactive, client-side Monte Carlo pricing model running Geometric Brownian Motion (GBM) directly in the browser, powered by live cryptocurrency and equity price oracles.

### 🌟 Key Capabilities
* **Multi-Source Free Market Oracle**:
  * **Coinbase Spot API**: Real-time spot pricing for crypto assets (`SOL-USD`).
  * **OKX Public V5 API**: Real-time ticker feeds for `KAS-USDT`, `MON-USDT`, and `SOL-USDT`.
  * **CoinGecko & MEXC Fallback**: Asynchronous fallback feeds for high-availability decentralized tokens.
  * **Yahoo Finance / CORS Proxy**: Equity pricing for `BULL`, `HOOD`, and `COIN`.
  * **Dynamic Micro-Tick Simulation**: High-frequency sub-second jitter and flash animations (`#00e676` emerald for up-ticks, `#ff3366` crimson for down-ticks) ensuring live terminal responsiveness.
* **Institutional Break-Even & Sizing Engine**:
  * Calibrated around critical pivot targets (such as Webull's **$11.00 institutional parity** level).
  * Real-time dynamic P&L sensitivity matrices with user-adjustable cost basis and position scale.
* **Algorithmic Execution Tiers & Kelly Sizing**:
  * 3 automated strategic tiers per asset: **Breakout Momentum**, **Optimal Retest**, and **Deep Value Accumulation**.
  * Dynamic Half-Kelly Criterion calculation balancing empirical win probabilities against risk-to-reward ratios.
* **Comparative Cross-Asset Analysis Hub**:
  * Cross-asset table comparing 90-day volatility ($\sigma$), annual drift ($\mu$), median stochastic projections, 95th percentile bull-case targets, and Sharpe / R:R scores.
  * Interactive 90-day median drift progress visualizer.
  * Asset class filtering (All / US Equities / Layer-1 Blockchains).
* **Obsidian Fintech Aesthetic**:
  * High-density glassmorphism UI designed to mimic institutional execution desks (Bloomberg Terminal / Linear / Apple Dark mode).
  * Touch-optimized for mobile/iPhone and widescreen desktop monitors.
  * Native print stylesheet (`@media print`) enabling one-click boardroom PDF exports.

---

## 📊 Assets Covered

| Symbol | Name | Asset Class | Primary Oracle Feed | Strategic Focus |
|---|---|---|---|---|
| **BULL** | Webull Corporation | NASDAQ Equity | Yahoo Finance Proxy | $11.00 Institutional Break-Even Pivot |
| **HOOD** | Robinhood Markets | NASDAQ Equity | Robinhood / Yahoo Proxy | Pro-Trader Terminal (Legend) & Gold Retention |
| **COIN** | Coinbase Global | NASDAQ Equity | Coinbase / Yahoo Proxy | High-Beta Crypto Proxy & Layer-2 Base Fees |
| **MONAD** | Monad Network (MON) | High-Throughput L1 | OKX V5 / CoinGecko | 10,000 TPS Parallel EVM Price Discovery |
| **SOL** | Solana | Layer-1 Crypto | Coinbase Spot API (Live) | Institutional DeFi & Spot ETF Speculation |
| **KAS** | Kaspa BlockDAG | PoW BlockDAG | OKX V5 / MEXC / CoinGecko | Sub-Second GHOSTDAG Consensus Alpha |

---

## 🚀 Instant Deployment Options

### Option 1: Deploy with Netlify Drop (60 Seconds)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop) (free, no account needed).
2. Drag and drop the repository folder (containing `index.html`).
3. You immediately receive a live HTTPS link (e.g. `https://webull-monad-terminal.netlify.app`).

### Option 2: GitHub Pages (Automated CI/CD)
This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`).
1. Push this repository to GitHub.
2. Under repository **Settings** → **Pages**, select **GitHub Actions** as the source.
3. Every push to `main` will automatically deploy your live terminal link.

---

## 🛠 Project Expansion Roadmap

- [ ] **Real WebSocket Feeds**: Connect directly to Coinbase (`wss://ws-feed.exchange.coinbase.com`) and OKX WebSockets for sub-100ms real-time order book streaming.
- [ ] **TradingView Lightweight Charts**: Integrate interactive historical candlestick charts with volume profiles and indicator overlays alongside the Monte Carlo canvas.
- [ ] **Markowitz Efficient Frontier**: Multi-asset portfolio builder computing optimal Sharpe weighting across the 6 assets.
- [ ] **Backtesting Simulator**: Historical replay validating how each execution tier would have performed across preceding quarter cycles.
- [ ] **Nexus Autotrade Integration**: Webhook/REST bridge connecting to the local Nexus trading microservice for paper or automated trade execution via Alpaca/Webull APIs.

---

## 📄 License
MIT License. Created for quantitative research and executive demonstration.
