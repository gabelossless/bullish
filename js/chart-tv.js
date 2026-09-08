// Webull Intelligence Terminal - TradingView Lightweight Candlestick Engine
// Features EMA 20/50, Volume Profile, Real-time WebSocket Ticks & Touch Pan/Pinch

window.TradingViewChartEngine = {
    chart: null,
    candleSeries: null,
    volumeSeries: null,
    ema20Series: null,
    ema50Series: null,
    latestCandle: null,

    init() {
        const container = document.getElementById('tvChartContainer');
        if (!container || typeof LightweightCharts === 'undefined') return;

        container.innerHTML = '';
        this.chart = LightweightCharts.createChart(container, {
            layout: {
                background: { color: '#030508' },
                textColor: '#94a3b8',
                fontFamily: "'Azeret Mono', monospace",
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
            },
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.08)',
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.08)',
                timeVisible: true,
            },
            handleScroll: {
                mouseWheel: true,
                pressedMouseMove: true,
                horzTouchDrag: true,
                vertTouchDrag: false
            },
            handleScale: {
                axisPressedMouseMove: true,
                mouseWheel: true,
                pinch: true
            }
        });

        this.candleSeries = this.chart.addCandlestickSeries({
            upColor: '#00e676',
            downColor: '#ff3366',
            borderUpColor: '#00e676',
            borderDownColor: '#ff3366',
            wickUpColor: '#00e676',
            wickDownColor: '#ff3366',
        });

        this.volumeSeries = this.chart.addHistogramSeries({
            color: 'rgba(0, 102, 255, 0.25)',
            priceFormat: { type: 'volume' },
            priceScaleId: '',
        });
        this.volumeSeries.priceScale().applyOptions({
            scaleMargins: { top: 0.82, bottom: 0 },
        });

        this.ema20Series = this.chart.addLineSeries({
            color: '#00e5ff',
            lineWidth: 2,
            title: 'EMA 20',
        });

        this.ema50Series = this.chart.addLineSeries({
            color: '#ffb300',
            lineWidth: 2,
            title: 'EMA 50',
        });

        this.loadAssetCandles(window.currentAsset);
    },

    loadAssetCandles(assetKey) {
        if (!this.candleSeries) return;
        const assetData = window.TERMINAL_CONFIG.assets;
        if (!assetData[assetKey]) return;

        const basePrice = assetData[assetKey].price;
        const vol = assetData[assetKey].defaultVol / 100;
        const candles = [];
        const volumes = [];
        const ema20 = [];
        const ema50 = [];

        const days = 90;
        let currentP = basePrice * (1 - (assetData[assetKey].defaultDrift / 100) * 0.25);
        const now = new Date();

        for (let i = days; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const timeStr = date.toISOString().split('T')[0];

            const open = currentP;
            const change = (Math.random() - 0.48) * vol * currentP * 0.15;
            const close = i === 0 ? basePrice : Math.max(0.001, open + change);
            const high = Math.max(open, close) + Math.random() * vol * currentP * 0.08;
            const low = Math.min(open, close) - Math.random() * vol * currentP * 0.08;

            candles.push({ time: timeStr, open, high, low, close });
            volumes.push({
                time: timeStr,
                value: Math.floor(Math.random() * 500000 + 100000),
                color: close >= open ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 51, 102, 0.2)'
            });

            currentP = close;
        }

        this.candleSeries.setData(candles);
        this.volumeSeries.setData(volumes);
        this.latestCandle = { ...candles[candles.length - 1] };

        const k20 = 2 / (20 + 1);
        const k50 = 2 / (50 + 1);
        let prevEma20 = candles[0].close;
        let prevEma50 = candles[0].close;

        candles.forEach(c => {
            prevEma20 = c.close * k20 + prevEma20 * (1 - k20);
            prevEma50 = c.close * k50 + prevEma50 * (1 - k50);
            ema20.push({ time: c.time, value: prevEma20 });
            ema50.push({ time: c.time, value: prevEma50 });
        });

        this.ema20Series.setData(ema20);
        this.ema50Series.setData(ema50);
        this.chart.timeScale().fitContent();
    },

    updateLiveTick(price) {
        if (!this.candleSeries || !this.latestCandle) return;
        this.latestCandle.close = price;
        if (price > this.latestCandle.high) this.latestCandle.high = price;
        if (price < this.latestCandle.low) this.latestCandle.low = price;
        this.candleSeries.update(this.latestCandle);
    },

    resize() {
        if (!this.chart) return;
        const container = document.getElementById('tvChartContainer');
        if (container && container.clientWidth > 0) {
            this.chart.resize(container.clientWidth, container.clientHeight);
            this.chart.timeScale().fitContent();
        }
    }
};

window.switchChartEngine = function(engine) {
    window.activeChartEngine = engine;
    const mcBtn = document.getElementById('btnModeMonteCarlo');
    const tvBtn = document.getElementById('btnModeCandlestick');
    const mcContainer = document.getElementById('simCanvasContainer');
    const tvContainer = document.getElementById('tvChartContainer');
    const mcPresets = document.getElementById('mcPresetsBar');

    if (engine === 'TV') {
        if (mcBtn) mcBtn.classList.remove('active');
        if (tvBtn) tvBtn.classList.add('active');
        if (mcContainer) mcContainer.style.display = 'none';
        if (tvContainer) tvContainer.style.display = 'block';
        if (mcPresets) mcPresets.style.display = 'none';

        if (!window.TradingViewChartEngine.chart) {
            window.TradingViewChartEngine.init();
        } else {
            window.TradingViewChartEngine.loadAssetCandles(window.currentAsset);
            window.TradingViewChartEngine.resize();
        }
    } else {
        if (tvBtn) tvBtn.classList.remove('active');
        if (mcBtn) mcBtn.classList.add('active');
        if (tvContainer) tvContainer.style.display = 'none';
        if (mcContainer) mcContainer.style.display = 'block';
        if (mcPresets) mcPresets.style.display = 'flex';

        window.MonteCarloEngine.resize();
        window.MonteCarloEngine.run();
    }
};
