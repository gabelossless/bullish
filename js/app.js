// Webull Intelligence Terminal - Main Application Bootstrap & UI Controller
// Supports Mobile Bottom Dock, Asset Switching, Timeframe Presets & PWA Shortcuts

// -------------------------------------------------------------
// GLOBAL RUNTIME STATE
// -------------------------------------------------------------
window.currentAsset = 'BULL';
window.currentS0 = window.TERMINAL_CONFIG.assets.BULL.price;
window.simPathsCount = 1000;
window.activeChartEngine = 'MC'; // 'MC' or 'TV'
window.autoSimEnabled = true;
window.mertonJumpEnabled = false;

// -------------------------------------------------------------
// ASSET LOADER
// -------------------------------------------------------------
window.loadAsset = function(key) {
    const assetData = window.TERMINAL_CONFIG.assets;
    if (!assetData[key]) return;
    window.currentAsset = key;
    const data = assetData[key];
    window.currentS0 = data.price;

    const badge = document.getElementById('assetBadge');
    if (badge) {
        badge.textContent = data.logo;
        badge.style.background = `linear-gradient(135deg, ${data.theme}, #090d16)`;
    }
    const ticker = document.getElementById('assetTicker');
    if (ticker) ticker.textContent = data.ticker;
    const title = document.getElementById('assetFullTitle');
    if (title) title.textContent = data.name;
    const tag = document.getElementById('assetClassTag');
    if (tag) tag.textContent = data.classType;

    const priceEl = document.getElementById('liveSpotPrice');
    if (priceEl) priceEl.textContent = window.TERMINAL_CONFIG.formatPrice(data.price);
    const deltaEl = document.getElementById('liveSpotDelta');
    if (deltaEl) deltaEl.textContent = data.change + ' (30D)';
    const oracle = document.getElementById('oracleSourceLabel');
    if (oracle) oracle.textContent = `${data.source} • AUTO-SYNC`;

    const volRange = document.getElementById('volRange');
    const driftRange = document.getElementById('driftRange');
    const daysRange = document.getElementById('daysRange');
    const volReadout = document.getElementById('volReadout');
    const driftReadout = document.getElementById('driftReadout');
    const daysReadout = document.getElementById('daysReadout');

    if (volRange) volRange.value = data.defaultVol;
    if (driftRange) driftRange.value = data.defaultDrift;
    if (daysRange) daysRange.value = data.defaultDays;
    if (volReadout) volReadout.textContent = data.defaultVol + '%';
    if (driftReadout) driftReadout.textContent = (data.defaultDrift >= 0 ? '+' : '') + data.defaultDrift + '%';
    if (daysReadout) daysReadout.textContent = data.defaultDays + ' Days';

    document.querySelectorAll('#timeframePresets .segment-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-days') == data.defaultDays);
    });

    const costBasisInput = document.getElementById('costBasis');
    const sharesInput = document.getElementById('sharesCount');
    if (costBasisInput) costBasisInput.value = data.costBasis;
    if (sharesInput) sharesInput.value = data.shares;
    
    const beTitle = document.getElementById('beTitle');
    if (beTitle) beTitle.textContent = `Analytics (${window.TERMINAL_CONFIG.formatPrice(data.costBasis)} Basis)`;
    const tgtLabel = document.getElementById('probTargetLabel');
    if (tgtLabel) tgtLabel.textContent = `P(Reach ≥ ${window.TERMINAL_CONFIG.formatPrice(data.targetLine)})`;
    const strLabel = document.getElementById('probStretchLabel');
    if (strLabel) strLabel.textContent = `P(Reach ≥ ${window.TERMINAL_CONFIG.formatPrice(data.stretchLine)})`;

    window.renderTiers(data);
    window.updateBreakEven();

    if (window.activeChartEngine === 'TV') {
        window.TradingViewChartEngine.loadAssetCandles(key);
    } else {
        window.MonteCarloEngine.resize();
        window.MonteCarloEngine.run();
    }
};

// -------------------------------------------------------------
// UI CONTROLLERS & EVENT BINDINGS
// -------------------------------------------------------------
function setupEventListeners() {
    // Navigation Pills (Asset Switcher)
    document.querySelectorAll('.nav-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-pill').forEach(b => b.classList.remove('active'));
            const targetBtn = e.target.closest('.nav-pill');
            if (!targetBtn) return;
            targetBtn.classList.add('active');

            const target = targetBtn.getAttribute('data-target');
            document.querySelectorAll('.section-view').forEach(s => s.classList.remove('active'));

            if (target === 'COMPARISON') {
                const compView = document.getElementById('comparison-view');
                if (compView) compView.classList.add('active');
                window.renderComparison();
                updateMobileDockState('compare');
            } else {
                const termView = document.getElementById('terminal-view');
                if (termView) termView.classList.add('active');
                window.loadAsset(target);
                updateMobileDockState('assets');
            }
        });
    });

    // Timeframe Presets
    document.querySelectorAll('#timeframePresets .segment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#timeframePresets .segment-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const days = e.target.getAttribute('data-days');
            const daysRange = document.getElementById('daysRange');
            const daysReadout = document.getElementById('daysReadout');
            if (daysRange) daysRange.value = days;
            if (daysReadout) daysReadout.textContent = days + ' Days';
            window.runMonteCarlo();
        });
    });

    // Path Density Presets
    document.querySelectorAll('#pathsPresets .segment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#pathsPresets .segment-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            window.simPathsCount = parseInt(e.target.getAttribute('data-paths'));
            const b = document.getElementById('pathsBadge');
            if (b) b.textContent = window.simPathsCount.toLocaleString() + ' PATHS';
            window.runMonteCarlo();
        });
    });

    // Sliders
    const volRange = document.getElementById('volRange');
    const driftRange = document.getElementById('driftRange');
    const daysRange = document.getElementById('daysRange');
    const volReadout = document.getElementById('volReadout');
    const driftReadout = document.getElementById('driftReadout');
    const daysReadout = document.getElementById('daysReadout');

    if (volRange) {
        volRange.addEventListener('input', (e) => {
            if (volReadout) volReadout.textContent = e.target.value + '%';
            if (window.activeChartEngine === 'MC') window.runMonteCarlo();
        });
    }

    if (driftRange) {
        driftRange.addEventListener('input', (e) => {
            if (driftReadout) driftReadout.textContent = (e.target.value >= 0 ? '+' : '') + e.target.value + '%';
            if (window.activeChartEngine === 'MC') window.runMonteCarlo();
        });
    }

    if (daysRange) {
        daysRange.addEventListener('input', (e) => {
            if (daysReadout) daysReadout.textContent = e.target.value + ' Days';
            document.querySelectorAll('#timeframePresets .segment-btn').forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-days') == e.target.value);
            });
            if (window.activeChartEngine === 'MC') window.runMonteCarlo();
        });
    }

    // Manual Re-run button
    const rerunBtn = document.getElementById('btnRerun');
    if (rerunBtn) {
        rerunBtn.addEventListener('click', () => {
            if (window.activeChartEngine === 'MC') window.runMonteCarlo();
            else window.TradingViewChartEngine.loadAssetCandles(window.currentAsset);
        });
    }

    // Cost basis & shares inputs
    const costBasisInput = document.getElementById('costBasis');
    const sharesInput = document.getElementById('sharesCount');
    if (costBasisInput) costBasisInput.addEventListener('input', window.updateBreakEven);
    if (sharesInput) sharesInput.addEventListener('input', window.updateBreakEven);

    // Responsive window resizing
    window.addEventListener('resize', () => {
        const termView = document.getElementById('terminal-view');
        if (termView && termView.classList.contains('active')) {
            if (window.activeChartEngine === 'TV') {
                window.TradingViewChartEngine.resize();
            } else {
                window.MonteCarloEngine.resize();
                window.MonteCarloEngine.run();
            }
        }
    });

    // Handle URL Parameters (from PWA Shortcuts)
    handleUrlParameters();
}

function handleUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    const assetParam = params.get('asset');
    const viewParam = params.get('view');

    if (viewParam === 'comparison') {
        const compBtn = document.querySelector('.nav-pill[data-target="COMPARISON"]');
        if (compBtn) compBtn.click();
    } else if (assetParam && window.TERMINAL_CONFIG.assets[assetParam.toUpperCase()]) {
        const assetBtn = document.querySelector(`.nav-pill[data-target="${assetParam.toUpperCase()}"]`);
        if (assetBtn) assetBtn.click();
    }
}

// -------------------------------------------------------------
// MOBILE BOTTOM DOCK CONTROLLER
// -------------------------------------------------------------
window.handleMobileDockTab = function(tabName) {
    updateMobileDockState(tabName);

    if (tabName === 'assets') {
        // Switch back to terminal view if needed, scroll to top nav
        const termBtn = document.querySelector(`.nav-pill[data-target="${window.currentAsset}"]`);
        if (termBtn) termBtn.click();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabName === 'chart') {
        const termView = document.getElementById('terminal-view');
        if (!termView.classList.contains('active')) {
            const termBtn = document.querySelector(`.nav-pill[data-target="${window.currentAsset}"]`);
            if (termBtn) termBtn.click();
        }
        const stage = document.querySelector('.chart-stage-wrapper');
        if (stage) stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (tabName === 'risk') {
        const termView = document.getElementById('terminal-view');
        if (!termView.classList.contains('active')) {
            const termBtn = document.querySelector(`.nav-pill[data-target="${window.currentAsset}"]`);
            if (termBtn) termBtn.click();
        }
        const beCard = document.getElementById('breakEvenSectionCard');
        if (beCard) beCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tabName === 'compare') {
        const compBtn = document.querySelector('.nav-pill[data-target="COMPARISON"]');
        if (compBtn) compBtn.click();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabName === 'install') {
        window.triggerPWAInstall();
    }
};

function updateMobileDockState(activeTab) {
    document.querySelectorAll('.mobile-dock-tab').forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-tab') === activeTab);
    });
}

// -------------------------------------------------------------
// MODALS & SHARING
// -------------------------------------------------------------
window.toggleDeployModal = function(show) {
    const m = document.getElementById('deployModal');
    if (m) m.classList.toggle('active', show);
};

window.closeDeployModal = function(e) {
    if (e.target.id === 'deployModal' || e.target.id === 'iosInstallModal') {
        e.target.classList.remove('active');
    }
};

window.shareTerminal = function() {
    if (navigator.share) {
        navigator.share({
            title: 'Webull Quantitative Intelligence Terminal',
            text: 'Live Multi-Asset WebSocket Engine: BULL, HOOD, COIN, MONAD, SOL, KAS',
            url: window.location.href,
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Terminal link copied to clipboard!');
    }
};

// -------------------------------------------------------------
// APP INITIALIZATION LIFECYCLE
// -------------------------------------------------------------
function initApp() {
    try {
        window.PWAController.init();
        window.MonteCarloEngine.init();
        window.renderRibbon();
        setupEventListeners();
        window.loadAsset('BULL');
        window.LiveWebSockets.init();
        window.MarketOracle.fetchRealTimeData();
        window.MarketOracle.initMicroTicks();
    } catch(e) {
        console.error('Terminal initialization error:', e);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

window.addEventListener('load', () => {
    window.MonteCarloEngine.resize();
    window.MonteCarloEngine.run();
});
