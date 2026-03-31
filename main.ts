import '@fontsource/quicksand/400.css';
import '@fontsource/quicksand/500.css';
import '@fontsource/quicksand/600.css';
import '@fontsource/quicksand/700.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/700-italic.css';
import '@phosphor-icons/web/regular';
import '@phosphor-icons/web/fill';
import { initCore } from './src/js/core';
import { initPWA } from './src/js/pwa';
import { loadCMSAndRender } from './src/js/cms';
import { inject } from '@vercel/analytics';

document.addEventListener('DOMContentLoaded', async () => {
    initCore();
    inject(); // Initialize Vercel Analytics
    initPWA();
    
    // Tải Dữ liệu từ Google Sheets hoặc Local Data
    await loadCMSAndRender();

    // Fast render badge before heavy cart JS loads
    try {
        const cart = JSON.parse(localStorage.getItem('che-phuong-cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        document.querySelectorAll('.cart-badge, .badgen').forEach(badge => badge.textContent = totalItems);
    } catch (e) { }

    // Lazy load the heavy UI and Cart logics
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            import('./src/js/ui').then(m => m.initUI());
            import('./src/js/cart').then(m => m.initCart());
        });
    } else {
        setTimeout(() => {
            import('./src/js/ui').then(m => m.initUI());
            import('./src/js/cart').then(m => m.initCart());
        }, 1000);
    }
});
