// Webull Intelligence Terminal - Core Configuration & Asset Definitions

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
            summary: "Webull's institutional break-even pivot at $11.00 remains the key threshold. Strong options clearing volumes and international licensing (UK, APAC) drive operating leverage."
        },
        HOOD: {
            ticker: 'HOOD', name: 'Robinhood Markets', type: 'EQUITY', classType: 'NASDAQ',
            price: 23.45, change: '+14.2%',
            logo: 'H', theme: '#00c805',
            defaultVol: 58, defaultDrift: 22, defaultDays: 90,
            costBasis: 20.00, shares: 1000,
            targetLine: 28.00, stretchLine: 34.00,
            source: 'Robinhood / Yahoo Proxy',
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
            summary: "Pro-trader terminal (Robinhood Legend) scaling across active account cohorts. High cash yield balances and cryptocurrency revenue correlation."
        },
        COIN: {
            ticker: 'COIN', name: 'Coinbase Global', type: 'EQUITY', classType: 'NASDAQ',
            price: 265.10, change: '+22.5%',
            logo: 'C', theme: '#0052ff',
            defaultVol: 75, defaultDrift: 45, defaultDays: 90,
            costBasis: 210.00, shares: 100,
            targetLine: 300.00, stretchLine: 350.00,
            source: 'Coinbase / Yahoo Proxy',
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
            summary: "Premier institutional crypto infrastructure asset. Layer-2 Base transaction fees combined with institutional custody provide high operating margin expansion."
        },
        MONAD: {
            ticker: 'MONAD', name: 'Monad Network (MON)', type: 'CRYPTO', classType: 'L1 CRYPTO',
            price: 0.0255, change: '+18.4%',
            logo: 'M', theme: 'var(--brand-purple)',
            defaultVol: 95, defaultDrift: 85, defaultDays: 90,
            costBasis: 0.022, shares: 250000,
            targetLine: 0.035, stretchLine: 0.050,
            source: 'OKX WebSocket (Live)',
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
            summary: "Parallel EVM high-throughput Layer-1 with 10,000 TPS capability. Fully operational token economy with streaming OKX WebSocket liquidity."
        },
        SOL: {
            ticker: 'SOL', name: 'Solana', type: 'CRYPTO', classType: 'L1 CRYPTO',
            price: 103.50, change: '+6.2%',
            logo: 'S', theme: '#00ffa3',
            defaultVol: 78, defaultDrift: 55, defaultDays: 90,
            costBasis: 95.00, shares: 350,
            targetLine: 125.00, stretchLine: 150.00,
            source: 'Coinbase WebSocket (Live)',
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
    }
};
