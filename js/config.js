// Webull Intelligence Terminal - Core Configuration & Auto-Calibrated Quant Models
// Trader-focused execution parameters, asymmetric R:R benchmarks & institutional narratives

window.TERMINAL_CONFIG = {
    assets: {
        BULL: {
            ticker: 'BULL', name: 'Webull Corporation', type: 'EQUITY', classType: 'NASDAQ',
            price: 9.62, change: '+31.8%',
            logo: 'W', theme: 'var(--brand-webull)',
            defaultVol: 62, defaultDrift: 28, defaultDays: 90,
            costBasis: 11.00, shares: 5000,
            targetLine: 11.00, stretchLine: 12.80,
            source: 'Yahoo Finance Proxy',
            calibration: {
                realizedVol: 62,
                trendVelocity: 28,
                beta: 1.65,
                confidenceScore: '94.8%',
                primaryStop: 8.50,
                invalidation: 'Daily close < $8.50',
                buyZone: '$8.50 – $9.45',
                tp1: '$11.00 (Scale 50%)',
                tp2: '$12.80 (Hold Runner)',
                tradeGuidance: "Consolidation below $11.00 institutional parity provides favorable risk asymmetry. Accumulate on dips in the $8.50–$9.45 buy zone. Take 50% profit at $11.00 Parity (+14.3%), move stop to breakeven, and let remaining 50% ride to $12.80 and $14.50 extensions.",
                regimes: {
                    BASE: { name: 'Baseline Trend Continuation', vol: 62, drift: 28, jumps: false, desc: 'Operating leverage & international expansion momentum.' },
                    BULL: { name: 'Institutional Momentum Breakout', vol: 78, drift: 52, jumps: false, desc: 'Options clearing breakout & global broker licensing expansion.' },
                    DEFENSIVE: { name: 'Support Retest / Dip Buy', vol: 44, drift: 8, jumps: false, desc: 'Low-volatility consolidation around $9.50 moving average support.' },
                    SHOCK: { name: 'Volatility Flush / Gap Risk', vol: 98, drift: -25, jumps: true, desc: 'Macro rate volatility and liquidity squeeze defense.' }
                }
            },
            stages: [
                { label: 'Psychological Test', price: 10.00 },
                { label: 'Break-Even Parity', price: 11.00 },
                { label: 'Structural Pivot', price: 12.80 },
                { label: 'Year-End Target', price: 14.50 },
                { label: '2027 Expansion', price: 17.50 }
            ],
            tiers: [
                { name: 'BREAKOUT MOMENTUM', entry: 9.45, sl: 8.50, tp: 12.80, color: 'var(--brand-cyan)' },
                { name: 'OPTIMAL RETEST (REC)', entry: 8.50, sl: 6.50, tp: 13.80, color: 'var(--brand-emerald)' },
                { name: 'DEEP VALUE ACCUMULATION', entry: 7.15, sl: 5.50, tp: 14.50, color: 'var(--brand-amber)' }
            ],
            summary: "Consolidation below $11.00 institutional parity. Asymmetric long bias on rising clearing volume and international options licensing."
        },
        HOOD: {
            ticker: 'HOOD', name: 'Robinhood Markets', type: 'EQUITY', classType: 'NASDAQ',
            price: 23.45, change: '+14.2%',
            logo: 'H', theme: '#00c805',
            defaultVol: 58, defaultDrift: 22, defaultDays: 90,
            costBasis: 20.00, shares: 1000,
            targetLine: 28.00, stretchLine: 34.00,
            source: 'Robinhood / Yahoo Proxy',
            calibration: {
                realizedVol: 58,
                trendVelocity: 22,
                beta: 1.42,
                confidenceScore: '92.4%',
                primaryStop: 19.50,
                invalidation: 'Daily close < $19.50',
                buyZone: '$21.50 – $23.00',
                tp1: '$28.00 (Scale 50%)',
                tp2: '$34.00 (Hold Runner)',
                tradeGuidance: "Optimal long entry on retest of $21.50 support. Take 50% profit at $28.00 (+19.4%), trail stop to breakeven, and target $34.00 macro extension.",
                regimes: {
                    BASE: { name: 'Baseline Trend Continuation', vol: 58, drift: 22, jumps: false, desc: 'Gold subscription growth and cash-yield float momentum.' },
                    BULL: { name: 'Institutional Momentum Breakout', vol: 72, drift: 44, jumps: false, desc: 'Legend desktop terminal adoption & crypto transaction fee surge.' },
                    DEFENSIVE: { name: 'Support Retest / Dip Buy', vol: 40, drift: 6, jumps: false, desc: 'Stabilization around 50-day moving average ($21.00).' },
                    SHOCK: { name: 'Volatility Flush / Gap Risk', vol: 88, drift: -22, jumps: true, desc: 'Macro market drawdown and crypto volume compression.' }
                }
            },
            stages: [
                { label: 'Local Support', price: 21.00 },
                { label: 'Recent Resistance', price: 25.50 },
                { label: 'Breakout Pivot', price: 28.00 },
                { label: 'Macro Extension', price: 34.00 }
            ],
            tiers: [
                { name: 'TREND CONTINUATION', entry: 23.00, sl: 19.50, tp: 28.00, color: 'var(--brand-cyan)' },
                { name: 'MEAN REVERSION PULLBACK', entry: 21.50, sl: 18.00, tp: 30.00, color: 'var(--brand-emerald)' },
                { name: 'MACRO DIP', entry: 18.50, sl: 15.00, tp: 34.00, color: 'var(--brand-amber)' }
            ],
            summary: "Ascending channel structure. Legend desktop terminal adoption scaling across active traders with cryptocurrency revenue correlation."
        },
        COIN: {
            ticker: 'COIN', name: 'Coinbase Global', type: 'EQUITY', classType: 'NASDAQ',
            price: 265.10, change: '+22.5%',
            logo: 'C', theme: '#0052ff',
            defaultVol: 75, defaultDrift: 45, defaultDays: 90,
            costBasis: 210.00, shares: 100,
            targetLine: 300.00, stretchLine: 350.00,
            source: 'Coinbase / Yahoo Proxy',
            calibration: {
                realizedVol: 75,
                trendVelocity: 45,
                beta: 2.15,
                confidenceScore: '96.1%',
                primaryStop: 230.00,
                invalidation: 'Daily close < $230.00',
                buyZone: '$235.00 – $260.00',
                tp1: '$300.00 (Scale 50%)',
                tp2: '$350.00 (Hold Runner)',
                tradeGuidance: "Buy pullbacks toward $235–$260 with hard stop at $230. Take 50% profit at $300 psychological milestone, letting runner ride to $350 swing highs.",
                regimes: {
                    BASE: { name: 'Baseline Trend Continuation', vol: 75, drift: 45, jumps: false, desc: 'Layer-2 Base fee revenue & institutional ETF custody scaling.' },
                    BULL: { name: 'Institutional Momentum Breakout', vol: 92, drift: 75, jumps: false, desc: 'Crypto cycle liquidity surge and blue-sky extension above $350.' },
                    DEFENSIVE: { name: 'Support Retest / Dip Buy', vol: 52, drift: 12, jumps: false, desc: 'Consolidation at $230 support during quiet trading volume cycles.' },
                    SHOCK: { name: 'Volatility Flush / Gap Risk', vol: 115, drift: -35, jumps: true, desc: 'Regulatory headline shock & crypto leverage liquidations.' }
                }
            },
            stages: [
                { label: 'Base Support', price: 230.00 },
                { label: 'Psychological $300', price: 300.00 },
                { label: 'Cycle Highs', price: 350.00 },
                { label: 'Blue Sky Extension', price: 420.00 }
            ],
            tiers: [
                { name: 'MOMENTUM EXPANSION', entry: 260.00, sl: 230.00, tp: 320.00, color: 'var(--brand-cyan)' },
                { name: 'SUPPORT RE-ENTRY', entry: 235.00, sl: 200.00, tp: 350.00, color: 'var(--brand-emerald)' },
                { name: 'LIQUIDITY SWEEP', entry: 210.00, sl: 180.00, tp: 420.00, color: 'var(--brand-amber)' }
            ],
            summary: "High-beta crypto infrastructure leader. Layer-2 Base transaction fees combined with institutional custody provide high operating leverage."
        },
        MONAD: {
            ticker: 'MONAD', name: 'Monad Network (MON)', type: 'CRYPTO', classType: 'L1 CRYPTO',
            price: 0.0255, change: '+18.4%',
            logo: 'M', theme: 'var(--brand-purple)',
            defaultVol: 95, defaultDrift: 85, defaultDays: 90,
            costBasis: 0.022, shares: 250000,
            targetLine: 0.035, stretchLine: 0.050,
            source: 'OKX WebSocket (Live)',
            calibration: {
                realizedVol: 95,
                trendVelocity: 85,
                beta: 2.80,
                confidenceScore: '91.8%',
                primaryStop: 0.0190,
                invalidation: 'Hourly close < $0.0190',
                buyZone: '$0.0225 – $0.0250',
                tp1: '$0.0350 (Scale 50%)',
                tp2: '$0.0500 (Hold Runner)',
                tradeGuidance: "Scale bids in liquidity tranches between $0.0225 and $0.0250. Hard stop below $0.0190 swing low. Take 50% profit at $0.0350 (+37%), hold runner for $0.0500 discovery.",
                regimes: {
                    BASE: { name: 'Baseline Trend Continuation', vol: 95, drift: 85, jumps: false, desc: '10k TPS Parallel EVM testnet/mainnet adoption velocity.' },
                    BULL: { name: 'Institutional Momentum Breakout', vol: 125, drift: 140, jumps: false, desc: 'Ecosystem DeFi TVL expansion and tiered CEX spot listings.' },
                    DEFENSIVE: { name: 'Support Retest / Dip Buy', vol: 65, drift: 20, jumps: false, desc: 'Consolidation at $0.0210 floor during broader L1 cool-offs.' },
                    SHOCK: { name: 'Volatility Flush / Gap Risk', vol: 145, drift: -40, jumps: true, desc: 'High-beta crypto liquidity flush & early token unlock volatility.' }
                }
            },
            stages: [
                { label: 'Range Low Support', price: 0.0210 },
                { label: 'Parity Base', price: 0.0255 },
                { label: 'Breakout Resistance', price: 0.0320 },
                { label: 'Discovery Pivot', price: 0.0450 },
                { label: 'Cycle Target', price: 0.0750 }
            ],
            tiers: [
                { name: 'MOMENTUM EXPANSION', entry: 0.0250, sl: 0.0210, tp: 0.0450, color: 'var(--brand-cyan)' },
                { name: 'OPTIMAL SUPPORT RETEST', entry: 0.0225, sl: 0.0190, tp: 0.0550, color: 'var(--brand-emerald)' },
                { name: 'ACCUMULATION DIP', entry: 0.0180, sl: 0.0150, tp: 0.0750, color: 'var(--brand-amber)' }
            ],
            summary: "Parallel EVM high-throughput Layer-1 with 10,000 TPS capability. Early price discovery with streaming OKX WebSocket liquidity."
        },
        SOL: {
            ticker: 'SOL', name: 'Solana', type: 'CRYPTO', classType: 'L1 CRYPTO',
            price: 103.50, change: '+6.2%',
            logo: 'S', theme: '#00ffa3',
            defaultVol: 78, defaultDrift: 55, defaultDays: 90,
            costBasis: 95.00, shares: 350,
            targetLine: 125.00, stretchLine: 150.00,
            source: 'Coinbase WebSocket (Live)',
            calibration: {
                realizedVol: 78,
                trendVelocity: 55,
                beta: 2.20,
                confidenceScore: '95.5%',
                primaryStop: 91.00,
                invalidation: 'Daily close < $91.00',
                buyZone: '$98.00 – $102.00',
                tp1: '$125.00 (Scale 50%)',
                tp2: '$150.00 (Hold Runner)',
                tradeGuidance: "Buy 20-day EMA pullbacks ($98–$102) with invalidation below $91. Scale out 50% at $125 (+20.7%), trail stop to breakeven, and hold runner for $150 macro breakout.",
                regimes: {
                    BASE: { name: 'Baseline Trend Continuation', vol: 78, drift: 55, jumps: false, desc: 'DEX trading velocity, active wallets & Coinbase stablecoin liquidity.' },
                    BULL: { name: 'Institutional Momentum Breakout', vol: 98, drift: 95, jumps: false, desc: 'Spot ETF approval speculation & DeFi fee parity with Ethereum.' },
                    DEFENSIVE: { name: 'Support Retest / Dip Buy', vol: 54, drift: 15, jumps: false, desc: 'Range-bound accumulation above $92 macro support.' },
                    SHOCK: { name: 'Volatility Flush / Gap Risk', vol: 118, drift: -30, jumps: true, desc: 'Network congestion or broader crypto leverage liquidations.' }
                }
            },
            stages: [
                { label: 'Range Support', price: 92.00 },
                { label: 'Current Base', price: 103.50 },
                { label: 'Pivot Hurdle', price: 118.00 },
                { label: 'Macro Target', price: 145.00 },
                { label: 'ATH Extension', price: 210.00 }
            ],
            tiers: [
                { name: 'DEX VOLUME RUN', entry: 102.00, sl: 91.00, tp: 135.00, color: 'var(--brand-cyan)' },
                { name: 'MOVING AVG PULLBACK', entry: 94.00, sl: 82.00, tp: 145.00, color: 'var(--brand-emerald)' },
                { name: 'CYCLICAL ACCUMULATION', entry: 85.00, sl: 72.00, tp: 180.00, color: 'var(--brand-amber)' }
            ],
            summary: "High-velocity decentralized exchange and memecoin clearing engine. Sub-second block times and booming stablecoin issuance on Coinbase."
        },
        KASPA: {
            ticker: 'KAS', name: 'Kaspa BlockDAG', type: 'CRYPTO', classType: 'POW BLOCKDAG',
            price: 0.0361, change: '+8.9%',
            logo: 'K', theme: 'var(--brand-amber)',
            defaultVol: 88, defaultDrift: 65, defaultDays: 90,
            costBasis: 0.033, shares: 150000,
            targetLine: 0.045, stretchLine: 0.065,
            source: 'OKX WebSocket (Live)',
            calibration: {
                realizedVol: 88,
                trendVelocity: 65,
                beta: 2.45,
                confidenceScore: '93.7%',
                primaryStop: 0.0290,
                invalidation: 'Daily close < $0.0290',
                buyZone: '$0.0330 – $0.0355',
                tp1: '$0.0450 (Scale 50%)',
                tp2: '$0.0650 (Hold Runner)',
                tradeGuidance: "Long bias intact above $0.0310 support. Accumulate on retests of $0.0330–$0.0355. Take 50% profit at $0.0450 (+24.6%), let runner ride to $0.0650 breakout extension.",
                regimes: {
                    BASE: { name: 'Baseline Trend Continuation', vol: 88, drift: 65, jumps: false, desc: 'Sub-second GHOSTDAG hashrate growth and organic spot accumulation.' },
                    BULL: { name: 'Institutional Momentum Breakout', vol: 110, drift: 115, jumps: false, desc: 'Tier-1 US exchange listing catalyst & smart contract testnet release.' },
                    DEFENSIVE: { name: 'Support Retest / Dip Buy', vol: 60, drift: 18, jumps: false, desc: 'Miner breakeven support consolidation at $0.0310.' },
                    SHOCK: { name: 'Volatility Flush / Gap Risk', vol: 130, drift: -35, jumps: true, desc: 'Global crypto hashpower migration & mining reward halving shock.' }
                }
            },
            stages: [
                { label: 'Local Support', price: 0.0310 },
                { label: 'Current Consolidation', price: 0.0361 },
                { label: 'Resistance Retest', price: 0.0420 },
                { label: 'Breakout Extension', price: 0.0550 },
                { label: 'Macro Cycle High', price: 0.0850 }
            ],
            tiers: [
                { name: 'TREND MOMENTUM', entry: 0.0355, sl: 0.0310, tp: 0.0520, color: 'var(--brand-cyan)' },
                { name: 'MA SUPPORT RETEST', entry: 0.0330, sl: 0.0290, tp: 0.0650, color: 'var(--brand-emerald)' },
                { name: 'VALUE SHAKEOUT', entry: 0.0280, sl: 0.0240, tp: 0.0850, color: 'var(--brand-amber)' }
            ],
            summary: "Proof-of-Work BlockDAG pioneer with sub-second GHOSTDAG consensus. Live ticks streamed via OKX Public V5 WebSocket."
        }
    },

    formatPrice(val) {
        if (val === undefined || val === null || isNaN(val)) return '$0.00';
        if (val < 0.001) return '$' + val.toFixed(6);
        if (val < 0.1) return '$' + val.toFixed(4);
        if (val < 1) return '$' + val.toFixed(3);
        if (val < 100) return '$' + val.toFixed(2);
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    randn() {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    },

    generateForecastNarrative(assetKey, regimeKey, days, p50, p95, hitProb, stretchProb, s0) {
        const asset = this.assets[assetKey];
        if (!asset) return '';
        const cal = asset.calibration || {};
        const regime = (cal.regimes && cal.regimes[regimeKey]) ? cal.regimes[regimeKey] : (cal.regimes ? cal.regimes.BASE : { name: 'Baseline Trend Continuation', vol: asset.defaultVol, drift: asset.defaultDrift });

        const currentPrice = (s0 && !isNaN(s0) && s0 > 0) ? s0 : asset.price;
        const targetPrice = asset.targetLine;
        const targetUpside = (((targetPrice - currentPrice) / currentPrice) * 100).toFixed(1);
        const targetSign = targetUpside >= 0 ? '+' : '';

        const p50Val = (p50 && !isNaN(p50)) ? p50 : currentPrice;
        const p50Gain = (((p50Val - currentPrice) / currentPrice) * 100).toFixed(1);
        const p50Sign = p50Gain >= 0 ? '+' : '';

        const stopLoss = cal.primaryStop || (asset.tiers && asset.tiers[0] ? asset.tiers[0].sl : currentPrice * 0.90);
        const stopRisk = Math.abs((((currentPrice - stopLoss) / currentPrice) * 100)).toFixed(1);

        const upsideReward = Math.max(0.0001, Math.abs(targetPrice - currentPrice));
        const downsideRisk = Math.max(0.0001, Math.abs(currentPrice - stopLoss));
        const rr = (upsideReward / downsideRisk).toFixed(1);
        const runnerReward = Math.max(0.0001, Math.abs(asset.stretchLine - currentPrice));
        const runnerRR = (runnerReward / downsideRisk).toFixed(1);

        const hitRateNum = parseFloat(hitProb) || 0;
        const hitRateColor = hitRateNum >= 60 ? 'var(--brand-emerald)' : hitRateNum >= 40 ? 'var(--brand-cyan)' : 'var(--brand-amber)';

        let biasBadge = '<span class="tag tag-green">🟢 CONSTRUCTIVE LONG</span>';
        if (regimeKey === 'BULL' || parseFloat(p50Gain) > 25) {
            biasBadge = '<span class="tag tag-green">🚀 MOMENTUM BREAKOUT</span>';
        } else if (regimeKey === 'SHOCK') {
            biasBadge = '<span class="tag tag-amber">⚠️ VOLATILITY DEFENSE</span>';
        } else if (regimeKey === 'DEFENSIVE') {
            biasBadge = '<span class="tag tag-blue">🛡️ SUPPORT ACCUMULATION</span>';
        } else if (parseFloat(p50Gain) <= 0) {
            biasBadge = '<span class="tag tag-amber">⏸️ CONSOLIDATION</span>';
        }

        const buyZoneStr = cal.buyZone || `${this.formatPrice(currentPrice * 0.96)} – ${this.formatPrice(currentPrice * 1.01)}`;
        const tp1Str = cal.tp1 || `${this.formatPrice(targetPrice)} (Scale 50%)`;
        const tp2Str = cal.tp2 || `${this.formatPrice(asset.stretchLine)} (Hold Runner)`;
        const stopStr = cal.invalidation || `Close < ${this.formatPrice(stopLoss)}`;
        const guidanceStr = cal.tradeGuidance || asset.summary;

        return `
            <div class="trader-signal-header">
                <div class="trader-signal-left">
                    ${biasBadge}
                    <span class="trader-signal-title">${asset.ticker} • ${days}D TRADE SIGNAL</span>
                </div>
                <div class="trader-signal-right">
                    Target Win Rate: <strong style="color: ${hitRateColor}; font-size: 13px;">${hitProb}% Odds</strong>
                </div>
            </div>

            <div class="trader-metrics-row">
                <div class="trader-stat-box">
                    <span class="trader-stat-lbl">🎯 PROFIT TARGET (TP1)</span>
                    <strong class="trader-stat-num" style="color: var(--brand-cyan);">${this.formatPrice(targetPrice)}</strong>
                    <span class="trader-stat-sub" style="color: ${hitRateColor};">${targetSign}${targetUpside}% • ${hitProb}% Hit Rate</span>
                </div>
                <div class="trader-stat-box">
                    <span class="trader-stat-lbl">📈 EXPECTED VALUE (EV)</span>
                    <strong class="trader-stat-num" style="color: #fff;">${this.formatPrice(p50Val)}</strong>
                    <span class="trader-stat-sub" style="color: var(--brand-emerald);">${p50Sign}${p50Gain}% 50th Median</span>
                </div>
                <div class="trader-stat-box">
                    <span class="trader-stat-lbl">🛑 KEY SUPPORT / STOP</span>
                    <strong class="trader-stat-num" style="color: var(--brand-amber);">${this.formatPrice(stopLoss)}</strong>
                    <span class="trader-stat-sub" style="color: var(--text-secondary);">-${stopRisk}% Invalidation</span>
                </div>
                <div class="trader-stat-box">
                    <span class="trader-stat-lbl">⚖️ ASYMMETRIC R:R</span>
                    <strong class="trader-stat-num" style="color: var(--brand-emerald);">1 : ${rr}</strong>
                    <span class="trader-stat-sub" style="color: var(--brand-cyan);">1 : ${runnerRR} to Runner</span>
                </div>
            </div>

            <div class="trader-action-callout">
                <div class="trader-action-header">
                    <span class="action-tag">💡 ACTIONABLE TRADE SETUP</span>
                    <span class="action-regime-pill">${regime.name}</span>
                </div>
                <div class="trader-levels-bar">
                    <div class="trader-level-pill">
                        <span class="pill-lbl">BUY ZONE</span>
                        <span class="pill-val">${buyZoneStr}</span>
                    </div>
                    <div class="trader-level-pill">
                        <span class="pill-lbl">SCALE-OUT (TP1)</span>
                        <span class="pill-val" style="color: var(--brand-cyan);">${tp1Str}</span>
                    </div>
                    <div class="trader-level-pill">
                        <span class="pill-lbl">RUNNER (TP2)</span>
                        <span class="pill-val" style="color: var(--brand-emerald);">${tp2Str}</span>
                    </div>
                    <div class="trader-level-pill">
                        <span class="pill-lbl">STOP LOSS</span>
                        <span class="pill-val" style="color: var(--brand-amber);">${stopStr}</span>
                    </div>
                </div>
                <div class="trader-strategy-note">
                    <strong>Execution Plan:</strong> ${guidanceStr}
                </div>
            </div>
        `;
    }
};
