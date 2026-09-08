// Webull Intelligence Terminal - Progressive Web App (PWA) Controller
// Handles Service Worker lifecycle, Android Install Prompt & iOS Home Screen Guide

window.PWAController = {
    deferredPrompt: null,
    isIOS: false,
    isStandalone: false,

    init() {
        this.checkPlatform();
        this.registerServiceWorker();
        this.bindInstallPrompt();
        this.bindNetworkTelemetry();
    },

    checkPlatform() {
        // Detect iOS (Safari on iPhone/iPad/iPod)
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        // Detect Standalone (already installed as PWA)
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

        if (this.isStandalone) {
            console.log('[PWA] Running in Standalone Application Mode');
            const installBtns = document.querySelectorAll('.btn-install-pwa-trigger');
            installBtns.forEach(b => {
                b.textContent = 'Installed';
                b.style.opacity = '0.6';
                b.disabled = true;
            });
        }
    },

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((reg) => {
                        console.log('[PWA] Service Worker registered with scope:', reg.scope);
                        
                        reg.onupdatefound = () => {
                            const installingWorker = reg.installing;
                            installingWorker.onstatechange = () => {
                                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    console.log('[PWA] New version available. Refresh to update.');
                                }
                            };
                        };
                    })
                    .catch((err) => {
                        console.warn('[PWA] Service Worker registration failed:', err);
                    });
            });
        }
    },

    bindInstallPrompt() {
        // Chromium Android & Desktop
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;

            const banner = document.getElementById('pwaInstallBanner');
            if (banner && !this.isStandalone) {
                // Show banner after 3 seconds of terminal usage
                setTimeout(() => {
                    banner.classList.add('active');
                }, 3000);
            }
        });

        window.addEventListener('appinstalled', () => {
            console.log('[PWA] Webull Pro successfully installed!');
            const banner = document.getElementById('pwaInstallBanner');
            if (banner) banner.classList.remove('active');
            this.deferredPrompt = null;
        });
    },

    triggerInstall() {
        if (this.isStandalone) {
            alert('Webull Pro Terminal is already installed on your device!');
            return;
        }

        if (this.deferredPrompt) {
            // Android / Chrome
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choice) => {
                if (choice.outcome === 'accepted') {
                    console.log('[PWA] User accepted installation');
                }
                this.deferredPrompt = null;
                const banner = document.getElementById('pwaInstallBanner');
                if (banner) banner.classList.remove('active');
            });
        } else if (this.isIOS) {
            // iOS Safari guide
            this.showIOSGuide(true);
        } else {
            // Fallback modal with install instructions
            this.showGenericInstallModal();
        }
    },

    dismissBanner() {
        const banner = document.getElementById('pwaInstallBanner');
        if (banner) banner.classList.remove('active');
    },

    showIOSGuide(show) {
        const modal = document.getElementById('iosInstallModal');
        if (modal) modal.classList.toggle('active', show);
    },

    showGenericInstallModal() {
        const modal = document.getElementById('deployModal');
        if (modal) modal.classList.toggle('active', true);
    },

    bindNetworkTelemetry() {
        window.addEventListener('online', () => {
            const status = document.getElementById('dockStatus');
            if (status) status.textContent = 'ONLINE: RE-CONNECTING WEBSOCKETS...';
            if (window.LiveWebSockets) window.LiveWebSockets.init();
            if (window.MarketOracle) window.MarketOracle.fetchRealTimeData();
        });

        window.addEventListener('offline', () => {
            const status = document.getElementById('dockStatus');
            if (status) status.textContent = 'OFFLINE MODE • CACHED ENGINE ACTIVE';
            const dot = document.getElementById('wsConnectionDot');
            if (dot) {
                dot.style.background = 'var(--brand-amber)';
                dot.style.boxShadow = '0 0 10px var(--brand-amber)';
            }
        });
    }
};

window.triggerPWAInstall = function() {
    window.PWAController.triggerInstall();
};
window.dismissPWABanner = function() {
    window.PWAController.dismissBanner();
};
window.toggleIOSGuide = function(show) {
    window.PWAController.showIOSGuide(show);
};
