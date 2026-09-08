// Webull Intelligence Terminal - Quantitative Risk, Break-Even & Portfolio Engine
// Implements Half-Kelly Capital Allocation, Target Stages & Multi-Asset Matrix

window.updateBreakEven = function() {
    const assetData = window.TERMINAL_CONFIG.assets;
    const data = assetData[window.currentAsset];
    if (!data) return;

    const costBasisInput = document.getElementById('costBasis');
    const sharesInput = document.getElementById('sharesCount');

    const basis = parseFloat(costBasisInput ? costBasisInput.value : data.costBasis) || data.costBasis;
    const shares = parseFloat(sharesInput ? sharesInput.value : data.shares) || data.shares;

    const currentDiff = window.currentS0 - basis;
    const currentPct = (currentDiff / basis) * 100;
    const totalDollarDiff = currentDiff * shares;

    const pnlHero = document.getElementById('currentPnl');
    if (pnlHero) {
        pnlHero.textContent = `${totalDollarDiff >= 0 ? '+' : '-'}$${Math.abs(totalDollarDiff).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${currentPct.toFixed(2)}%)`;
        pnlHero.style.color = totalDollarDiff >= 0 ? 'var(--brand-emerald)' : 'var(--brand-crimson)';
    }

    const dist = ((basis - window.currentS0) / window.currentS0) * 100;
    const distEl = document.getElementById('distToBE');
    if (distEl) {
        distEl.textContent = dist > 0 
            ? `Requires +${dist.toFixed(2)}% push from current spot (${window.TERMINAL_CONFIG.formatPrice(window.currentS0)}) to Parity (${window.TERMINAL_CONFIG.formatPrice(basis)})`
            : `Currently in profit by +${Math.abs(dist).toFixed(2)}% above entry base!`;
    }

    const tbody = document.getElementById('matrixBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td style="font-weight: 700; color: var(--brand-cyan);">Current Spot</td>
                <td>${window.TERMINAL_CONFIG.formatPrice(window.currentS0)}</td>
                <td style="color: ${currentPct >= 0 ? 'var(--brand-emerald)' : 'var(--brand-crimson)'}; font-weight:700;">${currentPct >= 0 ? '+' : ''}${currentPct.toFixed(1)}%</td>
                <td style="color: ${totalDollarDiff >= 0 ? 'var(--brand-emerald)' : 'var(--brand-crimson)'}; font-weight:700;">${totalDollarDiff >= 0 ? '+' : '-'}$${Math.abs(totalDollarDiff).toLocaleString('en-US', {maximumFractionDigits:0})}</td>
            </tr>
        `;

        data.stages.forEach(st => {
            const gainPct = ((st.price - basis) / basis) * 100;
            const netPnl = (st.price - basis) * shares;
            const tr = document.createElement('tr');
            if (Math.abs(st.price - basis) < 0.0001) tr.style.background = 'rgba(255, 179, 0, 0.08)';

            tr.innerHTML = `
                <td style="font-weight: 600; color: ${Math.abs(st.price - basis) < 0.0001 ? 'var(--brand-amber)' : 'var(--text-primary)'};">${st.label}</td>
                <td>${window.TERMINAL_CONFIG.formatPrice(st.price)}</td>
                <td style="color: ${gainPct >= 0 ? 'var(--brand-emerald)' : 'var(--brand-crimson)'}; font-weight: 700;">${gainPct >= 0 ? '+' : ''}${gainPct.toFixed(1)}%</td>
                <td style="color: ${netPnl >= 0 ? 'var(--brand-emerald)' : 'var(--brand-crimson)'}; font-weight: 700;">${netPnl >= 0 ? '+' : '-'}$${Math.abs(netPnl).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
            `;
            tbody.appendChild(tr);
        });
    }
};

window.renderTiers = function(data) {
    const container = document.getElementById('executionTiersContainer');
    if (!container) return;
    container.innerHTML = '';

    data.tiers.forEach((tier, i) => {
        const el = document.createElement('div');
        el.className = 'tier-strategy-card' + (i === 1 ? ' active' : '');

        const rr = ((tier.tp - tier.entry) / (tier.entry - tier.sl)).toFixed(2);

        el.innerHTML = `
            <div class="tier-card-title">
                <span style="color: ${tier.color};">TIER ${i+1}: ${tier.name}</span>
                <span>${window.TERMINAL_CONFIG.formatPrice(tier.entry)}</span>
            </div>
            <div class="tier-card-specs">
                <span>Target: ${window.TERMINAL_CONFIG.formatPrice(tier.tp)}</span>
                <span>Stop: ${window.TERMINAL_CONFIG.formatPrice(tier.sl)}</span>
                <span style="color: var(--brand-emerald); font-weight: 700;">R:R = 1 : ${Math.abs(rr)}</span>
            </div>
        `;

        el.onclick = () => {
            document.querySelectorAll('.tier-strategy-card').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
            const rrVal = Math.max(0.1, Math.abs(rr));
            const winRate = 0.58;
            const halfKelly = Math.max(0, ((winRate - (1 - winRate) / rrVal) * 0.5) * 100).toFixed(1);

            const kellyEl = document.getElementById('kellyRecommendation');
            if (kellyEl) {
                kellyEl.innerHTML = 
                    `Selected: <strong>${window.TERMINAL_CONFIG.formatPrice(tier.entry)}</strong> | Stop Loss: <strong>${window.TERMINAL_CONFIG.formatPrice(tier.sl)}</strong> | Target: <strong>${window.TERMINAL_CONFIG.formatPrice(tier.tp)}</strong> (R:R <strong>1:${rrVal}</strong>)<br>
                     Half-Kelly Capital Allocation: <strong style="color: var(--brand-cyan)">${halfKelly}% of Portfolio</strong> (Max Risk Limit 2.0% equity)`;
            }
        };
        container.appendChild(el);
    });

    const active = container.querySelector('.active') || container.firstChild;
    if (active) active.click();
};

window.renderRibbon = function() {
    const track = document.getElementById('ribbonTrack');
    if (!track) return;
    track.innerHTML = '';

    const assetData = window.TERMINAL_CONFIG.assets;
    Object.keys(assetData).forEach(k => {
        const item = assetData[k];
        const div = document.createElement('div');
        div.className = 'ribbon-item';
        div.onclick = () => {
            const btn = document.querySelector(`.nav-pill[data-target="${k}"]`);
            if (btn) btn.click();
        };

        div.innerHTML = `
            <span class="ribbon-symbol">${item.ticker}</span>
            <span class="ribbon-price">${window.TERMINAL_CONFIG.formatPrice(item.price)}</span>
            <span style="color: var(--brand-emerald); font-weight:700;">${item.change}</span>
            <span class="ribbon-tag-source">${item.source.split(' ')[0]}</span>
        `;
        track.appendChild(div);
    });
};

window.renderComparison = function() {
    const tbody = document.getElementById('comparisonTableBody');
    const cardsContainer = document.getElementById('comparisonCardsContainer');
    const visualBars = document.getElementById('visualBarsList');

    if (!tbody || !cardsContainer || !visualBars) return;

    tbody.innerHTML = '';
    cardsContainer.innerHTML = '';
    visualBars.innerHTML = '';

    const assetData = window.TERMINAL_CONFIG.assets;
    const keys = Object.keys(assetData);
    let maxDrift = 1;
    keys.forEach(k => { if (assetData[k].defaultDrift > maxDrift) maxDrift = assetData[k].defaultDrift; });

    keys.forEach(key => {
        const a = assetData[key];
        const drift = a.defaultDrift / 100;
        const vol = a.defaultVol / 100;
        const dt = 90 / 365;

        const medPath = a.price * Math.exp((drift - 0.5 * vol * vol) * dt);
        const p95Path = a.price * Math.exp((drift - 0.5 * vol * vol) * dt + vol * Math.sqrt(dt) * 1.645);
        const rrScore = (a.defaultDrift / a.defaultVol).toFixed(2);

        const barWidth = Math.min(100, Math.max(6, (a.defaultDrift / maxDrift) * 100));
        visualBars.innerHTML += `
            <div class="visual-bar-item">
                <div class="bar-label-symbol" style="color: ${a.theme}">${a.ticker}</div>
                <div class="bar-track-shell">
                    <div class="bar-fill-element" style="width: ${barWidth}%; background: linear-gradient(90deg, #0052ff, ${a.theme});"></div>
                </div>
                <div class="bar-stat-readout">+${a.defaultDrift}% Drift</div>
            </div>
        `;

        tbody.innerHTML += `
            <tr>
                <td style="font-weight: 800; color: ${a.theme}; cursor: pointer;" onclick="document.querySelector('.nav-pill[data-target=${key}]').click()">${a.ticker}</td>
                <td><span class="tag ${a.type === 'CRYPTO' ? 'tag-purple' : 'tag-blue'}">${a.classType}</span></td>
                <td style="font-weight: 700;">${window.TERMINAL_CONFIG.formatPrice(a.price)}</td>
                <td style="color: var(--brand-cyan); font-size: 11px;">${a.source}</td>
                <td>${a.defaultVol}%</td>
                <td style="color: var(--brand-emerald); font-weight: 700;">+${a.defaultDrift}%</td>
                <td>${window.TERMINAL_CONFIG.formatPrice(medPath)}</td>
                <td style="color: var(--brand-amber); font-weight: 700;">${window.TERMINAL_CONFIG.formatPrice(p95Path)}</td>
                <td style="font-weight: 800; color: var(--brand-cyan);">${rrScore}</td>
            </tr>
        `;

        cardsContainer.innerHTML += `
            <div class="glass-card" style="padding: 18px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 13px; font-weight: 800; color: ${a.theme}; font-family: var(--font-mono);">${a.ticker} • ${a.name}</span>
                    <span class="tag ${a.type === 'CRYPTO' ? 'tag-purple' : 'tag-blue'}">${a.classType}</span>
                </div>
                <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">
                    ${a.summary}
                </p>
            </div>
        `;
    });
};
