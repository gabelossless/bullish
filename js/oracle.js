// Webull Intelligence Terminal - WebSocket & Oracle Streaming Engine

window.LiveWebSockets = {
    coinbaseWS: null,
    okxWS: null,
    tickCount: 0,
    lastPingTime: 0,

    init() {
        this.connectCoinbase();
        this.connectOKX();
        this.startThroughputMonitor();
    },

    connectCoinbase() {
        try {
            this.coinbaseWS = new WebSocket('wss://ws-feed.exchange.coinbase.com');
            this.coinbaseWS.onopen = () => {
                const subMsg = { type: 'subscribe', product_ids: ['SOL-USD'], channels: ['ticker'] };
                this.coinbaseWS.send(JSON.stringify(subMsg));
                this.updateStatus();
            };

            this.coinbaseWS.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'ticker' && data.price) {
                        const price = parseFloat(data.price);
                        this.tickCount++;
                        window.MarketOracle.applyLivePrice('SOL', price, 'Coinbase WS (Live)');
                    }
                } catch(e) {}
            };

            this.coinbaseWS.onclose = () => { setTimeout(() => this.connectCoinbase(), 5000); };
        } catch(err) {}
    },

    connectOKX() {
        try {
            this.okxWS = new WebSocket('wss://ws.okx.com:8443/ws/v5/public');
            this.okxWS.onopen = () => {
                const subMsg = {
                    op: 'subscribe',
                    args: [
                        { channel: 'tickers', instId: 'KAS-USDT' },
                        { channel: 'tickers', instId: 'MON-USDT' },
                        { channel: 'tickers', instId: 'SOL-USDT' }
                    ]
                };
                this.okxWS.send(JSON.stringify(subMsg));
                this.updateStatus();

                setInterval(() => {
                    if (this.okxWS && this.okxWS.readyState === WebSocket.OPEN) {
                        this.lastPingTime = performance.now();
                        this.okxWS.send('ping');
                    }
                }, 20000);
            };

            this.okxWS.onmessage = (event) => {
                if (event.data === 'pong') {
                    const pingMs = Math.round(performance.now() - this.lastPingTime);
                    const badge = document.getElementById('wsLatencyBadge');
                    if (badge) badge.textContent = `WS PING: ${pingMs}ms`;
                    return;
                }

                try {
                    const json = JSON.parse(event.data);
                    if (json.data && json.data.length > 0) {
                        const tick = json.data[0];
                        const price = parseFloat(tick.last);
                        this.tickCount++;

                        if (tick.instId === 'KAS-USDT') {
                            window.MarketOracle.applyLivePrice('KASPA', price, 'OKX WS (Live)');
                        } else if (tick.instId === 'MON-USDT') {
                            window.MarketOracle.applyLivePrice('MONAD', price, 'OKX WS (Live)');
                        } else if (tick.instId === 'SOL-USDT' && (!this.coinbaseWS || this.coinbaseWS.readyState !== WebSocket.OPEN)) {
                            window.MarketOracle.applyLivePrice('SOL', price, 'OKX WS (Live)');
                        }
                    }
                } catch(e) {}
            };

            this.okxWS.onclose = () => { setTimeout(() => this.connectOKX(), 5000); };
        } catch(err) {}
    },

    updateStatus() {
        const isCbOpen = this.coinbaseWS && this.coinbaseWS.readyState === WebSocket.OPEN;
        const isOkxOpen = this.okxWS && this.okxWS.readyState === WebSocket.OPEN;
        const dot = document.getElementById('wsConnectionDot');

        if (isCbOpen || isOkxOpen) {
            if (dot) {
                dot.style.background = 'var(--brand-emerald)';
                dot.style.boxShadow = '0 0 12px var(--brand-emerald)';
            }
            const dock = document.getElementById('dockStatus');
            if (dock) dock.textContent = `AUTO-SIMULATION ENGINE ACTIVE • COINBASE & OKX STREAMING`;
        }
    },

    startThroughputMonitor() {
        setInterval(() => {
            const tps = this.tickCount;
            this.tickCount = 0;
            const b = document.getElementById('wsThroughputBadge');
            if (b) b.textContent = `${Math.max(1, tps)} TICKS/SEC`;
        }, 1000);
    }
};

window.MarketOracle = {
    async fetchRealTimeData(isManual = false) {
        const tsEl = document.getElementById('oracleTimestamp');
        if (tsEl) tsEl.textContent = 'Syncing REST endpoints...';

        const [yahooBull, yahooHood, yahooCoin] = await Promise.all([
            this.fetchYahooProxy('BULL'),
            this.fetchYahooProxy('HOOD'),
            this.fetchYahooProxy('COIN')
        ]);

        if (yahooBull && yahooBull > 0) this.applyLivePrice('BULL', yahooBull, 'Yahoo Finance Proxy');
        if (yahooHood && yahooHood > 0) this.applyLivePrice('HOOD', yahooHood, 'Yahoo Finance Proxy');
        if (yahooCoin && yahooCoin > 0) this.applyLivePrice('COIN', yahooCoin, 'Yahoo Finance Proxy');

        const timeStr = new Date().toLocaleTimeString();
        if (tsEl) tsEl.textContent = `Live Stream • ${timeStr}`;

        if (isManual) {
            window.LiveWebSockets.init();
            const status = document.getElementById('dockStatus');
            if (status) {
                status.textContent = 'ORACLE REFRESHED: WEBSOCKETS RE-CONNECTED';
                setTimeout(() => {
                    status.textContent = 'AUTO-SIMULATION ENGINE ACTIVE • COINBASE & OKX STREAMING';
                }, 3000);
            }
        }

        if (typeof window.renderRibbon === 'function') window.renderRibbon();
        const compView = document.getElementById('comparison-view');
        if (compView && compView.classList.contains('active') && typeof window.renderComparison === 'function') {
            window.renderComparison();
        }
    },

    async fetchYahooProxy(ticker) {
        try {
            const yUrl = encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`);
            const res = await fetch(`https://api.allorigins.win/raw?url=${yUrl}`);
            if (!res.ok) return null;
            const json = await res.json();
            return json.chart.result[0].meta.regularMarketPrice;
        } catch(e) { return null; }
    },

    applyLivePrice(key, price, source) {
        const assetData = window.TERMINAL_CONFIG.assets;
        if (!assetData[key]) return;
        const old = assetData[key].price;
        assetData[key].price = price;
        assetData[key].source = source;

        if (key === window.currentAsset) {
            window.currentS0 = price;
            const priceEl = document.getElementById('liveSpotPrice');
            if (priceEl) {
                priceEl.textContent = window.TERMINAL_CONFIG.formatPrice(price);
                if (price > old) {
                    priceEl.classList.add('flash-up');
                    setTimeout(() => priceEl.classList.remove('flash-up'), 500);
                } else if (price < old) {
                    priceEl.classList.add('flash-down');
                    setTimeout(() => priceEl.classList.remove('flash-down'), 500);
                }
            }

            if (window.TradingViewChartEngine) window.TradingViewChartEngine.updateLiveTick(price);
            if (typeof window.updateBreakEven === 'function') window.updateBreakEven();

            if (window.autoSimEnabled && window.activeChartEngine === 'MC') {
                if (typeof window.runMonteCarlo === 'function') window.runMonteCarlo();
            }
        }
    },

    initMicroTicks() {
        const assetData = window.TERMINAL_CONFIG.assets;
        setInterval(() => {
            ['BULL', 'HOOD', 'COIN'].forEach(k => {
                if (Math.random() > 0.45 && assetData[k]) {
                    const driftBias = (assetData[k].defaultDrift / 100) * 0.00006;
                    const volNoise = (Math.random() - 0.495) * (assetData[k].defaultVol / 100) * 0.0006;
                    assetData[k].price = Math.max(0.01, assetData[k].price * (1 + driftBias + volNoise));
                }
            });

            const termView = document.getElementById('terminal-view');
            if (termView && termView.classList.contains('active') && assetData[window.currentAsset]) {
                const curPrice = assetData[window.currentAsset].price;
                window.currentS0 = curPrice;
                const priceEl = document.getElementById('liveSpotPrice');
                if (priceEl) priceEl.textContent = window.TERMINAL_CONFIG.formatPrice(curPrice);
                if (window.TradingViewChartEngine) window.TradingViewChartEngine.updateLiveTick(curPrice);
                if (typeof window.updateBreakEven === 'function') window.updateBreakEven();

                if (window.autoSimEnabled && window.activeChartEngine === 'MC') {
                    if (typeof window.runMonteCarlo === 'function') window.runMonteCarlo();
                }
            }

            if (typeof window.renderRibbon === 'function') window.renderRibbon();
        }, 1200);
    }
};
