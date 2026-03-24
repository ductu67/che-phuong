import '@phosphor-icons/web/regular';
import '@phosphor-icons/web/fill';
import { initCore } from './src/js/core.js';
import { initUI, launchConfetti } from './src/js/ui.js';
import { initCart } from './src/js/cart.js';
import { initPWA } from './src/js/pwa.js';

document.addEventListener('DOMContentLoaded', () => {
    initCore();
    initUI();
    initCart();
    initPWA();
});
