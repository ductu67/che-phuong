export function initCore() {
    // 0. Preloader Logic
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.remove(), 600);
        }
    });

    // 0.1 Reading Progress Bar Logic
    const progressBar = document.getElementById('reading-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + "%";
    }, { passive: true });

    // 1. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');

    const currentTheme = localStorage.getItem('theme') || 'light-mode';
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(currentTheme);
    if (themeIcon) updateThemeIcon(themeIcon, currentTheme);

    themeToggle?.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
        document.body.classList.replace(newTheme === 'dark-mode' ? 'light-mode' : 'dark-mode', newTheme);
        localStorage.setItem('theme', newTheme);
        if (themeIcon) updateThemeIcon(themeIcon, newTheme);
    });
}

function updateThemeIcon(icon, theme) {
    if (theme === 'dark-mode') {
        icon.classList.replace('ph-moon', 'ph-sun');
    } else {
        icon.classList.replace('ph-sun', 'ph-moon');
    }
}
