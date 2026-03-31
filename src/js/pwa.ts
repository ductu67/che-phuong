export function initPWA() {
    let deferredPrompt;
    const installBanner = document.getElementById('install-banner');
    const installBtn = document.getElementById('install-btn');
    const navInstallBtn = document.getElementById('install-btn-nav');
    const mobileInstallBtn = document.getElementById('install-btn-mobile');
    const iosInstallBanner = document.getElementById('ios-install-banner');
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // Service Worker registration is now handled automatically by vite-plugin-pwa plugin during build.

    if (isIOS) {
        if (navInstallBtn) navInstallBtn.style.display = 'flex';
        const safariContent = document.getElementById('ios-safari-instruction');
        const nonSafariContent = document.getElementById('ios-not-safari-instruction');
        
        if (isSafari) {
            if (safariContent) safariContent.style.display = 'block';
            if (nonSafariContent) nonSafariContent.style.display = 'none';
        } else {
            if (safariContent) safariContent.style.display = 'none';
            if (nonSafariContent) nonSafariContent.style.display = 'block';
        }

        setTimeout(() => {
            if (!localStorage.getItem('ios-pwa-modal-closed') && iosInstallBanner) {
                iosInstallBanner.classList.add('show');
            }
        }, 3000);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (navInstallBtn) navInstallBtn.style.display = 'flex';
        if (installBanner && !isIOS && !localStorage.getItem('pwa-banner-closed')) {
            setTimeout(() => installBanner.classList.add('show'), 3000);
        }
    });

    [installBtn, navInstallBtn, mobileInstallBtn].forEach(btn => {
        btn?.addEventListener('click', () => {
            if (isIOS) iosInstallBanner?.classList.add('show');
            else if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(result => {
                    if (result.outcome === 'accepted') {
                        [navInstallBtn, mobileInstallBtn].forEach(b => b && (b.style.display = 'none'));
                    }
                    deferredPrompt = null;
                    installBanner?.classList.remove('show');
                });
            }
        });
    });

    document.getElementById('close-ios-install')?.addEventListener('click', () => {
        iosInstallBanner?.classList.remove('show');
        localStorage.setItem('ios-pwa-modal-closed', 'true');
    });

    document.getElementById('close-install')?.addEventListener('click', () => {
        installBanner?.classList.remove('show');
        localStorage.setItem('pwa-banner-closed', 'true');
    });
}
