document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Check local storage for theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(currentTheme);
        updateThemeIcon(currentTheme);
    }

    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            updateThemeIcon('dark-mode');
        } else {
            document.body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light-mode');
            updateThemeIcon('light-mode');
        }
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark-mode') {
            themeIcon.classList.replace('ph-moon', 'ph-sun');
        } else {
            themeIcon.classList.replace('ph-sun', 'ph-moon');
        }
    }

    // 2. Scroll Reveal Animations with Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealCards = document.querySelectorAll('.reveal-card');

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Staggered animation for cards
    const cardOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 150); // 150ms delay between cards

                observer.unobserve(entry.target);
            }
        });
    }, cardOptions);

    revealCards.forEach(card => {
        cardObserver.observe(card);
    });

    // 3. Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });


    // ==========================================
    // Advanced Features: Shopping Cart Logic
    // ==========================================
    let cart = [];
    const cartFloatingBtn = document.getElementById('cart-floating-btn');
    const navCartBtn = document.getElementById('nav-cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartBadges = document.querySelectorAll('.cart-badge, .badgen');
    const toast = document.getElementById('toast');

    // Toggle Cart
    function toggleCart() {
        cartModal.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        renderCart();
    }

    if (cartFloatingBtn) cartFloatingBtn.addEventListener('click', toggleCart);
    if (navCartBtn) navCartBtn.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Render Cart
    function renderCart() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Giỏ hàng đang trống. Hãy chọn món thả ga nhé!</p>';
            checkoutBtn.disabled = true;
        } else {
            cartItemsContainer.innerHTML = '';
            cart.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn minus" data-index="${index}">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>
                `;
                cartItemsContainer.appendChild(div);
            });
            checkoutBtn.disabled = false;
        }

        // Update badges
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartBadges.forEach(badge => badge.textContent = totalItems);
    }

    // Add to cart from menu
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemName = e.target.closest('.add-to-cart-btn').dataset.name;
            const existingItem = cart.find(i => i.name === itemName);
            
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ name: itemName, qty: 1 });
            }
            
            renderCart();
            showToast('Đã thêm ' + itemName);
        });
    });

    // Handle +/- buttons in cart
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('qty-btn')) {
            const index = e.target.dataset.index;
            if (e.target.classList.contains('plus')) {
                cart[index].qty += 1;
            } else if (e.target.classList.contains('minus')) {
                cart[index].qty -= 1;
                if (cart[index].qty === 0) {
                    cart.splice(index, 1);
                }
            }
            renderCart();
        }
    });

    // Toast Notification Maker
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    // Checkout Logic (Copy to clipboard and open FB)
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        
        let orderText = "Chào tiệm Chè Phương, mình muốn đặt các món sau ít ngọt:\n";
        cart.forEach(item => {
            orderText += `- ${item.qty} x ${item.name}\n`;
        });
        orderText += "\nCảm ơn tiệm!";

        // Copy to clipboard
        navigator.clipboard.writeText(orderText).then(() => {
            showToast('Đã chép đơn. Mở Messenger...');
            setTimeout(() => {
                window.open('https://m.me/phuong.nguyen.298061', '_blank');
            }, 1000);
        }).catch(err => {
            console.error('Lỗi khi sao chép: ', err);
            // Fallback if clipboard fails
            window.open('https://m.me/phuong.nguyen.298061', '_blank');
        });
    });

    // ==========================================
    // Advanced Features: Sticky Nav Scroll Spy
    // ==========================================
    const catLinks = document.querySelectorAll('.cat-link');
    const sections = ['modern', 'traditional', 'yogurt', 'drinks', 'gallery'].map(id => document.getElementById(id));
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (!section) return;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        catLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                
                // Keep active link in view for horizontal scroll
                const nav = document.getElementById('sticky-cat-nav');
                if (nav) {
                    const scrollLeft = link.offsetLeft - nav.offsetWidth / 2 + link.offsetWidth / 2;
                    nav.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
                }
            }
        });
    });


    // ==========================================
    // Image Zoom (Lightbox)
    // ==========================================
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.getElementById('close-lightbox');
    
    // Convert background-image url to src
    function extractImgUrl(element) {
        const style = window.getComputedStyle(element);
        const bgInput = style.backgroundImage;
        if (bgInput && bgInput !== 'none') {
            return bgInput.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
        }
        return null;
    }

    document.querySelectorAll('.card-img').forEach(imgDiv => {
        imgDiv.addEventListener('click', (e) => {
            const url = extractImgUrl(imgDiv);
            if (url) {
                lightboxImg.src = url;
                lightbox.classList.add('active');
            }
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => lightboxImg.src = '', 300); // clear after animation
    }

    if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }


    // ==========================================
    // Live Status Badge
    // ==========================================
    function updateShopStatus() {
        const statusBadge = document.getElementById('status-badge');
        if (!statusBadge) return;

        const now = new Date();
        const hour = now.getHours();
        
        // Open from 8:00 to 22:00
        if (hour >= 8 && hour < 22) {
            statusBadge.textContent = 'Đang mở cửa';
            statusBadge.className = 'status-badge status-open';
        } else {
            statusBadge.textContent = 'Quán đã nghỉ';
            statusBadge.className = 'status-badge status-closed';
        }
    }
    updateShopStatus();
    setInterval(updateShopStatus, 60000); // Update every minute

    // ==========================================
    // Fly to Cart Animation
    // ==========================================
    function createFlyingElement(sourceBtn) {
        const cartIcon = document.querySelector('.nav-cart-btn .ph-shopping-bag') || document.getElementById('nav-cart-btn');
        if (!cartIcon) return;

        const btnRect = sourceBtn.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        const flyer = document.createElement('div');
        flyer.className = 'flying-item';
        flyer.innerHTML = '<i class="ph ph-sparkle"></i>';
        flyer.style.left = `${btnRect.left + btnRect.width / 2 - 20}px`;
        flyer.style.top = `${btnRect.top + btnRect.height / 2 - 20}px`;
        document.body.appendChild(flyer);

        // Animate
        requestAnimationFrame(() => {
            flyer.style.left = `${cartRect.left + cartRect.width / 2 - 20}px`;
            flyer.style.top = `${cartRect.top + cartRect.height / 2 - 20}px`;
            flyer.style.transform = 'scale(0.2) rotate(360deg)';
            flyer.style.opacity = '0';
        });

        setTimeout(() => {
            flyer.remove();
            // Subtle pop animation for the cart button
            const navBtn = document.getElementById('nav-cart-btn');
            if (navBtn) {
                navBtn.style.transform = 'scale(1.2)';
                setTimeout(() => navBtn.style.transform = '', 200);
            }
        }, 800);
    }

    // Wrap the existing add-to-cart listener or add to it
    const originalAddButtons = document.querySelectorAll('.add-to-cart-btn');
    originalAddButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            createFlyingElement(e.currentTarget);
        });
    });

});
