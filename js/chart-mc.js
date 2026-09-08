// Webull Intelligence Terminal - Monte Carlo Stochastic Simulation Engine
// Featuring Merton Jump-Diffusion, Quantile Confidence Cloud & Mobile Touch Scrubbing

window.MonteCarloEngine = {
    canvas: null,
    ctx: null,

    init() {
        this.canvas = document.getElementById('simCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.bindEvents();
        this.resize();
    },

    resize() {
        if (!this.canvas || !this.ctx) return;
        const rect = this.canvas.getBoundingClientRect();
        const w = rect.width || this.canvas.clientWidth || 800;
        const h = rect.height || this.canvas.clientHeight || 340;
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = w * dpr;
        this.canvas.height = h * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },

    bindEvents() {
        if (!this.canvas) return;

        const handleHover = (clientX) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = clientX - rect.left;
            const simW = Math.max(100, rect.width - 105);
            const daysRange = document.getElementById('daysRange');
            const volRange = document.getElementById('volRange');
            const driftRange = document.getElementById('driftRange');
            const hoverInspectBox = document.getElementById('hoverInspectBox');

            const days = parseInt(daysRange ? daysRange.value : 90) || 90;
            const dayHover = Math.min(days, Math.max(0, Math.round((mouseX / simW) * days)));
            const sigma = parseInt(volRange ? volRange.value : 62) / 100;
            const mu = parseInt(driftRange ? driftRange.value : 28) / 100;
            const dt = 1 / 365;
            const estP = window.currentS0 * Math.exp((mu - 0.5 * sigma * sigma) * (dayHover * dt));

            if (hoverInspectBox) {
                hoverInspectBox.innerHTML = `
                    <span>Day <strong>${dayHover}</strong> of ${days}</span>
                    <span>Median: <strong>${window.TERMINAL_CONFIG.formatPrice(estP)}</strong></span>
                `;
            }
        };

        // Desktop Mouse Move
        this.canvas.addEventListener('mousemove', (e) => {
            handleHover(e.clientX);
        });

        // Mobile Touch Gestures (Touch Scrubbing)
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                handleHover(e.touches[0].clientX);
            }
        }, { passive: true });

        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length > 0) {
                handleHover(e.touches[0].clientX);
            }
        }, { passive: true });
    },

    run() {
        if (!this.canvas || !this.ctx) return;
        const data = window.TERMINAL_CONFIG.assets[window.currentAsset];
        if (!data) return;

        const rect = this.canvas.getBoundingClientRect();
        const W = rect.width || this.canvas.clientWidth || 800;
        const H = rect.height || this.canvas.clientHeight || 340;
        const paths = window.simPathsCount || 1000;

        const daysRange = document.getElementById('daysRange');
        const volRange = document.getElementById('volRange');
        const driftRange = document.getElementById('driftRange');
        const probTarget = document.getElementById('probTargetVal');
        const probStretch = document.getElementById('probStretchVal');

        const days = parseInt(daysRange ? daysRange.value : 90) || 90;
        const sigma = parseInt(volRange ? volRange.value : 62) / 100;
        const mu = parseInt(driftRange ? driftRange.value : 28) / 100;
        const dt = 1 / 365;

        const histW = W < 600 ? 65 : 85;
        const simW = Math.max(100, W - histW - 15);

        this.ctx.clearRect(0, 0, W, H);

        // Subtle Grid
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        this.ctx.lineWidth = 1;
        for (let y = 30; y < H; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(W, y);
            this.ctx.stroke();
        }

        let terminalPrices = [];
        let hitTargetCount = 0;
        let hitStretchCount = 0;

        const extremeUp = window.currentS0 * Math.exp(mu * (days / 365) + sigma * Math.sqrt(days / 365) * 3);
        const extremeDown = window.currentS0 * Math.exp(mu * (days / 365) - sigma * Math.sqrt(days / 365) * 2.5);

        const yMin = Math.max(0.0001, extremeDown * 0.75);
        const yMax = extremeUp * 1.15;

        const scaleY = (val) => H - ((val - yMin) / (yMax - yMin)) * (H - 50) - 25;
        const scaleX = (d) => (d / days) * (simW - 20) + 16;

        // Vertical divider between simulation and terminal histogram
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        this.ctx.setLineDash([3, 3]);
        this.ctx.beginPath();
        this.ctx.moveTo(simW + 5, 10);
        this.ctx.lineTo(simW + 5, H - 10);
        this.ctx.stroke();
        this.ctx.restore();

        // Target benchmark line
        const yTgt = scaleY(data.targetLine);
        this.ctx.save();
        this.ctx.strokeStyle = data.theme;
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, yTgt);
        this.ctx.lineTo(W - 10, yTgt);
        this.ctx.stroke();
        this.ctx.fillStyle = data.theme;
        this.ctx.font = '10px "Azeret Mono", monospace';
        this.ctx.fillText(`TARGET ${window.TERMINAL_CONFIG.formatPrice(data.targetLine)}`, W - 80, yTgt - 4);
        this.ctx.restore();

        const lambda = 4.0;
        const jumpMean = -0.05;
        const jumpVol = 0.15;

        for (let i = 0; i < paths; i++) {
            let p = window.currentS0;
            let hitTgt = false;
            let hitStr = false;

            this.ctx.beginPath();
            this.ctx.moveTo(scaleX(0), scaleY(p));

            for (let d = 1; d <= days; d++) {
                const z = window.TERMINAL_CONFIG.randn();
                let jumpFactor = 0;

                if (window.mertonJumpEnabled && Math.random() < lambda * dt) {
                    jumpFactor = jumpMean + jumpVol * window.TERMINAL_CONFIG.randn();
                }

                p = p * Math.exp((mu - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * z + jumpFactor);
                if (p >= data.targetLine) hitTgt = true;
                if (p >= data.stretchLine) hitStr = true;
                this.ctx.lineTo(scaleX(d), scaleY(p));
            }
            terminalPrices.push(p);
            if (hitTgt) hitTargetCount++;
            if (hitStr) hitStretchCount++;

            this.ctx.strokeStyle = hitTgt ? 'rgba(0, 229, 255, 0.045)' : 'rgba(0, 102, 255, 0.022)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }

        terminalPrices.sort((a, b) => a - b);
        const p50 = terminalPrices[Math.floor(paths * 0.50)] || window.currentS0;
        const p95 = terminalPrices[Math.floor(paths * 0.95)] || window.currentS0;

        // Shaded 10th-90th Quantile Confidence Cloud
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(scaleX(0), scaleY(window.currentS0));
        for (let d = 1; d <= days; d++) {
            const driftTerm = (mu - 0.5 * sigma * sigma) * (d * dt);
            const upperP = window.currentS0 * Math.exp(driftTerm + sigma * Math.sqrt(d * dt) * 1.28);
            this.ctx.lineTo(scaleX(d), scaleY(upperP));
        }
        for (let d = days; d >= 1; d--) {
            const driftTerm = (mu - 0.5 * sigma * sigma) * (d * dt);
            const lowerP = window.currentS0 * Math.exp(driftTerm - sigma * Math.sqrt(d * dt) * 1.28);
            this.ctx.lineTo(scaleX(d), scaleY(lowerP));
        }
        this.ctx.closePath();
        this.ctx.fillStyle = 'rgba(0, 102, 255, 0.07)';
        this.ctx.fill();
        this.ctx.restore();

        // Expected 50th percentile median trajectory
        this.ctx.save();
        this.ctx.strokeStyle = '#00e5ff';
        this.ctx.lineWidth = 2.5;
        this.ctx.shadowColor = '#00e5ff';
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(scaleX(0), scaleY(window.currentS0));
        let medP = window.currentS0;
        for (let d = 1; d <= days; d++) {
            medP = medP * Math.exp((mu - 0.5 * sigma * sigma) * dt);
            this.ctx.lineTo(scaleX(d), scaleY(medP));
        }
        this.ctx.stroke();
        this.ctx.restore();

        // Right-side Terminal Density Bell Curve / Histogram
        const binsCount = 28;
        const binSize = (yMax - yMin) / binsCount;
        const bins = new Array(binsCount).fill(0);

        terminalPrices.forEach(p => {
            const bIdx = Math.min(binsCount - 1, Math.max(0, Math.floor((p - yMin) / binSize)));
            bins[bIdx]++;
        });

        const maxBinCount = Math.max(...bins, 1);
        const histStartX = simW + 12;

        for (let b = 0; b < binsCount; b++) {
            const binPrice = yMin + (b + 0.5) * binSize;
            const binY = scaleY(binPrice);
            const binHeight = Math.max(3, (H / binsCount) * 0.85);
            const binBarWidth = (bins[b] / maxBinCount) * (histW - 15);

            const isProfitZone = binPrice >= data.targetLine;
            this.ctx.fillStyle = isProfitZone ? 'rgba(0, 230, 118, 0.45)' : 'rgba(0, 102, 255, 0.3)';
            this.ctx.fillRect(histStartX, binY - binHeight / 2, binBarWidth, binHeight);
        }

        // Target Probability Readouts
        if (probTarget) probTarget.textContent = ((hitTargetCount / paths) * 100).toFixed(1) + '%';
        if (probStretch) probStretch.textContent = ((hitStretchCount / paths) * 100).toFixed(1) + '%';
        const p50El = document.getElementById('p50Val');
        if (p50El) p50El.textContent = window.TERMINAL_CONFIG.formatPrice(p50);
        const p95El = document.getElementById('p95Val');
        if (p95El) p95El.textContent = window.TERMINAL_CONFIG.formatPrice(p95);
    }
};

window.runMonteCarlo = function() {
    window.MonteCarloEngine.run();
};

window.applyMacroScenario = function(e, scenario) {
    document.querySelectorAll('.scenario-chip').forEach(c => c.classList.remove('active'));
    const targetChip = e.currentTarget || e.target.closest('.scenario-chip');
    if (targetChip) targetChip.classList.add('active');

    const asset = window.TERMINAL_CONFIG.assets[window.currentAsset];
    if (!asset) return;

    const baseVol = asset.defaultVol;
    const baseDrift = asset.defaultDrift;

    if (scenario === 'BASE') {
        animateSliders(baseVol, baseDrift, asset.defaultDays);
        window.mertonJumpEnabled = false;
        const mToggle = document.getElementById('mertonJumpToggle');
        if (mToggle) mToggle.checked = false;
    } else if (scenario === 'BULL') {
        animateSliders(Math.round(baseVol * 1.25), Math.round(Math.max(45, baseDrift * 1.8)), 90);
        window.mertonJumpEnabled = false;
        const mToggle = document.getElementById('mertonJumpToggle');
        if (mToggle) mToggle.checked = false;
    } else if (scenario === 'REVERT') {
        animateSliders(Math.round(baseVol * 0.7), 0, 90);
        window.mertonJumpEnabled = false;
        const mToggle = document.getElementById('mertonJumpToggle');
        if (mToggle) mToggle.checked = false;
    } else if (scenario === 'SHOCK') {
        animateSliders(Math.round(baseVol * 1.6), -35, 90);
        window.mertonJumpEnabled = true;
        const mToggle = document.getElementById('mertonJumpToggle');
        if (mToggle) mToggle.checked = true;
    }

    window.runMonteCarlo();
};

function animateSliders(targetVol, targetDrift, targetDays) {
    const volRange = document.getElementById('volRange');
    const driftRange = document.getElementById('driftRange');
    const daysRange = document.getElementById('daysRange');
    const volReadout = document.getElementById('volReadout');
    const driftReadout = document.getElementById('driftReadout');
    const daysReadout = document.getElementById('daysReadout');

    if (volRange) volRange.value = targetVol;
    if (driftRange) driftRange.value = targetDrift;
    if (daysRange) daysRange.value = targetDays;
    if (volReadout) volReadout.textContent = targetVol + '%';
    if (driftReadout) driftReadout.textContent = (targetDrift >= 0 ? '+' : '') + targetDrift + '%';
    if (daysReadout) daysReadout.textContent = targetDays + ' Days';
}
