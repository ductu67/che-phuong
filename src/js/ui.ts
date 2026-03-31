export function initUI() {
    // 2. Scroll Reveal Animations
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-card').forEach(el => revealObserver.observe(el));

    // 3. Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 4. Shop Status Badge
    function updateShopStatus() {
        const badge = document.getElementById('status-badge');
        if (!badge) return;
        const hour = new Date().getHours();
        const isOpen = hour >= 8 && hour < 22;
        badge.textContent = isOpen ? 'Đang mở cửa' : 'Quán đã nghỉ';
        badge.className = `status-badge ${isOpen ? 'status-open' : 'status-closed'}`;
    }
    updateShopStatus();
    setInterval(updateShopStatus, 60000);

    // 5. Social Proof
    const socialProofEl = document.getElementById('social-proof');
    const messages = [
        'Một khách vừa đặt 2 Combo Sống Thảnh Thơi.',
        '15 người đang xem thực đơn của tiệm.',
        'Món Chè Sầu Riêng đang rất hot hôm nay!',
        'Một khách vừa đặt Chè Bưởi ít ngọt.',
        '8 người đang lựa chọn món cho bữa xế.'
    ];
    function cycleSocialProof() {
        if (!socialProofEl) return;
        const msg = messages[Math.floor(Math.random() * messages.length)];
        socialProofEl.innerHTML = '<i class="ph-fill ph-fire"></i> ' + msg;
        socialProofEl.classList.add('show');
        setTimeout(() => socialProofEl.classList.remove('show'), 4000);
        setTimeout(cycleSocialProof, 15000);
    }
    setTimeout(cycleSocialProof, 5000);

    // 6. Image Zoom (Lightbox)
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.getElementById('close-lightbox');

    function closeLightbox() {
        lightbox?.classList.remove('active');
        setTimeout(() => { if (lightboxImg) (lightboxImg as HTMLImageElement).src = ''; }, 300);
    }
    closeLightboxBtn?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    // 7. Sticky Nav Scroll Spy
    const catLinks = document.querySelectorAll('.cat-link');
    const navContainer = document.getElementById('sticky-cat-nav');
    const catLinksWrapper = document.querySelector('.cat-links-wrapper');
    const sectionIds = ['modern', 'traditional', 'yogurt', 'drinks'];
    const spySections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    let scrollTicking = false;
    let lastActiveId = '';

    function updateArrowVisibility() {
        if (!catLinksWrapper || !navContainer) return;
        const scrollLeft = catLinksWrapper.scrollLeft;
        const maxScroll = catLinksWrapper.scrollWidth - catLinksWrapper.clientWidth;
        
        navContainer.classList.toggle('has-left-scroll', scrollLeft > 10);
        navContainer.classList.toggle('has-right-scroll', scrollLeft < maxScroll - 10);
    }

    if (catLinksWrapper) {
        catLinksWrapper.addEventListener('scroll', updateArrowVisibility, { passive: true });
        window.addEventListener('resize', updateArrowVisibility, { passive: true });
        updateArrowVisibility();
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                let current = '';
                const scrollPos = window.scrollY || window.pageYOffset;
                
                spySections.forEach(section => {
                    if (scrollPos >= section.offsetTop - 250) current = section.id;
                });

                if (current !== lastActiveId) {
                    lastActiveId = current;
                    catLinks.forEach(link => {
                        const href = link.getAttribute('href').substring(1);
                        if (href === current) {
                            link.classList.add('active');
                            if (catLinksWrapper) {
                                const scrollLeft = (link as HTMLElement).offsetLeft - (catLinksWrapper as HTMLElement).offsetWidth / 2 + (link as HTMLElement).offsetWidth / 2;
                                catLinksWrapper.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
                            }
                        } else {
                            link.classList.remove('active');
                        }
                    });
                    updateArrowVisibility();
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // 8. FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });

    // 9. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 10. Floating Bubbles Decoration
    function createBubbles() {
        const container = document.createElement('div');
        container.className = 'bubble-container';
        document.body.appendChild(container);

        const bubbleCount = 15;
        for (let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            
            const size = Math.random() * 60 + 20 + 'px';
            bubble.style.width = size;
            bubble.style.height = size;
            
            bubble.style.left = Math.random() * 100 + '%';
            bubble.style.animationDuration = Math.random() * 10 + 10 + 's';
            bubble.style.animationDelay = Math.random() * 10 + 's';
            
            container.appendChild(bubble);
        }
    }
    createBubbles();
}

import confetti from 'canvas-confetti';

export function launchConfetti() {
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#F48FB1', '#F8BBD0', '#FFEB3B', '#4FC3F7', '#81C784']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#F48FB1', '#F8BBD0', '#FFEB3B', '#4FC3F7', '#81C784']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}
