document.addEventListener('DOMContentLoaded', () => {
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
    const themeIcon = themeToggle.querySelector('i');

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

    // 2. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealCards = document.querySelectorAll('.reveal-card');

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before it enters fully
    });

    revealElements.forEach(el => revealObserver.observe(el));
    revealCards.forEach(card => revealObserver.observe(card));

    // 3. Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ==========================================
    // Registered Service Worker for PWA
    // ==========================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(err => console.warn('SW register error', err));
        });
    }

    // Sound Effects (Web Audio API) - lazy init AudioContext on first interaction
    let audioCtx = null;
    function getAudioCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
    }
    function playClickSound() {
        const ctx = getAudioCtx();
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    }
    document.addEventListener('click', (e) => {
        if (e.target.closest('button, a, .card-img')) playClickSound();
    });

    // ==========================================
    // Shopping Cart & Topping Logic
    // ==========================================
    let cart = JSON.parse(localStorage.getItem('che-phuong-cart') || '[]');

    // 0. Skeleton Loader Lifecycle
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.classList.add('skeleton'));
    
    // Smooth transition from preloader to content
    setTimeout(() => {
        cards.forEach(card => card.classList.remove('skeleton'));
    }, 1500);
    const cartFloatingBtn = document.getElementById('cart-floating-btn');
    const navCartBtn = document.getElementById('nav-cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartBadges = document.querySelectorAll('.cart-badge, .badgen');
    const toast = document.getElementById('toast');

    // Product Detail Modal Elements
    const productModal = document.getElementById('product-modal');
    const productOverlay = document.getElementById('product-overlay');
    const closeProductBtn = document.getElementById('close-product-btn');
    const modalProductImg = document.getElementById('modal-product-img');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductDesc = document.getElementById('modal-product-desc');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalProductBadge = document.getElementById('modal-product-badge');
    const modalQtyValue = document.getElementById('modal-qty-value');
    const modalQtyMinus = document.getElementById('modal-qty-minus');
    const modalQtyPlus = document.getElementById('modal-qty-plus');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
    const modalToppingsSection = document.getElementById('modal-toppings-section');
    const modalToppingsContainer = document.getElementById('modal-toppings-container');
    
    let modalQty = 1;

    const availableToppings = [
        { name: 'Caramen', icon: 'ph-star' },
        { name: 'Trân châu đen', icon: 'ph-circle' },
        { name: 'Trân châu giòn', icon: 'ph-circle-dashed' },
        { name: 'Trân châu nhân dừa', icon: 'ph-nut' }
    ];
    let pendingItemName = null;

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function toggleCart() {
        const isActive = cartModal.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        document.body.classList.toggle('cart-open', isActive);
        if (isActive) renderCart();
    }

    if (cartFloatingBtn) cartFloatingBtn.addEventListener('click', toggleCart);
    if (navCartBtn) navCartBtn.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Auto-close cart and clear search when navigating
    function clearSearch() {
        document.querySelectorAll('.menu-search').forEach(input => { input.value = ''; });
        document.body.classList.remove('search-active');
        document.querySelectorAll('.menu-section, #hero, #combos').forEach(el => { el.style.display = ''; });
        document.querySelectorAll('.card').forEach(card => { card.style.display = ''; });
    }

    document.querySelectorAll('.logo a, .nav-links a:not(.nav-cart-btn), .cat-link').forEach(link => {
        link.addEventListener('click', () => {
            cartModal.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.classList.remove('cart-open');
            clearSearch();
        });
    });

    function renderCart() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Giỏ hàng đang trống. Hãy chọn món thả ga nhé!</p>';
            checkoutBtn.disabled = true;
        } else {
            cartItemsContainer.innerHTML = '';
            cart.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'cart-item';
                const itemPrice = item.price || 0;
                const toppingPrice = (item.toppings || []).length * 5000;
                const totalForItem = (itemPrice + toppingPrice) * item.qty;

                const toppingText = item.toppings && item.toppings.length > 0 ? 
                                   `<small style="display:block; color:var(--accent-color)">+ ${item.toppings.join(', ')}</small>` : '';
                div.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        ${toppingText}
                        <div class="cart-item-qty">
                            <button class="qty-btn minus" data-index="${index}">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn plus" data-index="${index}">+</button>
                        </div>
                    </div>
                    <div class="cart-item-total">
                        ${totalForItem.toLocaleString('vi-VN')}đ
                    </div>
                `;
                cartItemsContainer.appendChild(div);
            });
            checkoutBtn.disabled = false;

            // Add clear cart button if items exist
            if (!document.getElementById('clear-cart-btn')) {
                const clearContainer = document.createElement('div');
                clearContainer.className = 'clear-cart-container';
                const clearBtn = document.createElement('button');
                clearBtn.id = 'clear-cart-btn';
                clearBtn.textContent = 'Xóa toàn bộ giỏ hàng';
                clearBtn.addEventListener('click', () => {
                    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
                        cart = [];
                        renderCart();
                        showToast('Đã xóa giỏ hàng');
                    }
                });
                clearContainer.appendChild(clearBtn);
                cartItemsContainer.appendChild(clearContainer);
            }
        }
        
        // Always update grand total display
        const grandTotalEl = document.getElementById('cart-grand-total');
        if (grandTotalEl) {
            const grandTotal = cart.reduce((sum, item) => {
                const itemPrice = item.price || 0;
                const toppingPrice = (item.toppings || []).length * 5000;
                return sum + (itemPrice + toppingPrice) * item.qty;
            }, 0);
            grandTotalEl.textContent = grandTotal.toLocaleString('vi-VN') + 'đ';
        }

        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartBadges.forEach(badge => badge.textContent = totalItems);
        localStorage.setItem('che-phuong-cart', JSON.stringify(cart));
    }

    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    // Add to cart from menu (with topping check)
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentBtn = e.currentTarget;
            const name = currentBtn.dataset.name;
            const card = currentBtn.closest('.card');
            let price = 0;
            if (card) {
                const priceEl = card.querySelector('.card-price') || card.querySelector('.new-price');
                if (priceEl) {
                    price = parseInt(priceEl.textContent.replace(/\D/g, ''));
                }
            }

            // NEW: Always open the premium detail modal instead of adding directly
            // This ensures a "Premium" experience where users see details/toppings first.
            card.click();
        });
    });

    // Product Detail Modal Logic
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) return;
            
            const name = card.querySelector('h3').textContent;
            const desc = card.querySelector('p').textContent;
            const priceEl = card.querySelector('.card-price') || card.querySelector('.new-price');
            const price = priceEl ? priceEl.textContent : '0đ';
            
            const imgDiv = card.querySelector('.card-img');
            let imgSrc = "";
            if (imgDiv) {
                const style = window.getComputedStyle(imgDiv);
                imgSrc = style.backgroundImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
            }

            modalProductName.textContent = name;
            modalProductDesc.textContent = desc;
            modalProductPrice.textContent = price;
            
            const modalImgContainer = document.querySelector('.product-detail-image');
            if (imgSrc && imgSrc !== 'none') {
                modalProductImg.src = imgSrc;
                modalImgContainer.style.display = 'block';
            } else {
                modalImgContainer.style.display = 'none';
            }
            
            // For badge, we can determine based on category
            const parentSection = card.closest('.menu-section');
            const catName = parentSection ? parentSection.querySelector('h2').textContent : "Phổ biến";
            
            modalProductName.textContent = name;
            modalProductDesc.textContent = desc;
            modalProductPrice.textContent = price;
            modalProductImg.src = imgSrc;
            modalProductBadge.textContent = catName;
            
            modalQty = 1;
            modalQtyValue.textContent = modalQty;
            
            productModal.classList.add('active');
            productOverlay.classList.add('active');

            // Toppings Logic
            const needsTopping = name.includes('Chè') || name.includes('Sữa Chua') || name.includes('Sương Sáo') || name.includes('Trà') || name.includes('Matcha') || name.includes('Đồ Uống');
            const isCombo = name.includes('Combo');

            if (needsTopping && !isCombo) {
                modalToppingsSection.style.display = 'block';
                modalToppingsContainer.innerHTML = '';
                availableToppings.forEach(top => {
                    const chip = document.createElement('div');
                    chip.className = 'topping-chip';
                    chip.innerHTML = `<i class="ph ${top.icon}"></i> ${top.name}`;
                    chip.addEventListener('click', () => chip.classList.toggle('selected'));
                    modalToppingsContainer.appendChild(chip);
                });
            } else {
                modalToppingsSection.style.display = 'none';
            }
        });
    });

    const closeProductModal = () => {
        productModal.classList.remove('active');
        productOverlay.classList.remove('active');
    };

    if (closeProductBtn) closeProductBtn.addEventListener('click', closeProductModal);
    if (productOverlay) productOverlay.addEventListener('click', closeProductModal);

    if (modalQtyPlus) {
        modalQtyPlus.addEventListener('click', () => {
            modalQty++;
            modalQtyValue.textContent = modalQty;
        });
    }

    if (modalQtyMinus) {
        modalQtyMinus.addEventListener('click', () => {
            if (modalQty > 1) {
                modalQty--;
                modalQtyValue.textContent = modalQty;
            }
        });
    }

    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', () => {
            const name = modalProductName.textContent;
            let price = parseInt(modalProductPrice.textContent.replace(/\D/g, ''));
            
            // Collect selected toppings from chips
            const selectedToppings = [];
            modalToppingsContainer.querySelectorAll('.topping-chip.selected').forEach(chip => {
                selectedToppings.push(chip.textContent.trim());
            });

            // Add multiple based on modalQty
            for(let i=0; i<modalQty; i++) {
                addToCart(name, selectedToppings, price);
            }
            
            closeProductModal();
        });
    }

    function addToCart(name, toppings = [], price = 0) {
        const existingItem = cart.find(i => i.name === name && JSON.stringify(i.toppings) === JSON.stringify(toppings));
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ name, qty: 1, toppings, price });
        }
        renderCart();

        // Trigger Cart Bounce on all badges
        const cartTargets = document.querySelectorAll('.nav-cart-btn, #cart-floating-btn');
        cartTargets.forEach(target => {
            target.classList.add('cart-bounce');
            setTimeout(() => {
                target.classList.remove('cart-bounce');
            }, 500);
        });

        showToast(`Đã thêm ${name} vào giỏ!`);
    }

    // Handle +/- buttons
    cartItemsContainer.addEventListener('click', e => {
        if (e.target.classList.contains('qty-btn')) {
            const index = e.target.dataset.index;
            if (e.target.classList.contains('plus')) cart[index].qty += 1;
            else if (e.target.classList.contains('minus')) {
                cart[index].qty -= 1;
                if (cart[index].qty <= 0) cart.splice(index, 1);
            }
            renderCart();
        }
    });

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        let orderText = "Chào tiệm Chè Phương, mình muốn đặt các món sau (ít ngọt, giao tận nơi ạ):\n";
        let grandTotal = 0;
        cart.forEach(item => {
            const itemPrice = item.price || 0;
            const toppingPrice = (item.toppings || []).length * 5000;
            const totalForItem = (itemPrice + toppingPrice) * item.qty;
            grandTotal += totalForItem;

            orderText += `- ${item.qty} x ${item.name}`;
            if (item.toppings && item.toppings.length > 0) orderText += ` (Topping: ${item.toppings.join(', ')})`;
            orderText += `: ${totalForItem.toLocaleString('vi-VN')}đ\n`;
        });
        orderText += `\nTổng cộng: ${grandTotal.toLocaleString('vi-VN')}đ`;
        
        const deliveryNotesInput = document.getElementById('cart-delivery-notes');
        const notes = deliveryNotesInput ? deliveryNotesInput.value.trim() : '';
        if (notes) {
            orderText += `\n\n📝 Ghi chú: ${notes}`;
        }

        orderText += "\nCảm ơn tiệm!";
        
        // Success handler for clipboard
        const handleSuccess = () => {
            showToast('Đã chép đơn. Mở Messenger...');
            // On iOS/Safari, window.open in a promise or timeout is often blocked.
            // window.location.href is more reliable for app redirection.
            window.location.href = 'https://m.me/phuong.nguyen.298061';
        };

        // Fallback for clipboard
        const handleFailure = (err) => {
            console.error('Clipboard error:', err);
            showToast('Lỗi chép đơn. Đang mở Messenger...');
            window.location.href = 'https://m.me/phuong.nguyen.298061';
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(orderText)
                .then(handleSuccess)
                .catch(handleFailure);
        } else {
            // Fallback for browsers without clipboard API
            handleSuccess();
        }
    });

    // ==========================================
    // Real-time Search Filtering
    // ==========================================
    const searchInputs = document.querySelectorAll('.menu-search');
    // Cache sections and their cards for performance
    const menuSections = Array.from(document.querySelectorAll('.menu-section')).map(section => ({
        el: section,
        cards: Array.from(section.querySelectorAll('.card')).map(card => ({
            el: card,
            name: card.querySelector('h3').textContent.toLowerCase(),
            desc: card.querySelector('p').textContent.toLowerCase()
        }))
    }));
    const heroSection = document.getElementById('hero');
    const comboSection = document.getElementById('combos');

    const handleSearch = debounce((term) => {
        // Hide/show hero and combo sections
        if (heroSection) heroSection.style.display = term ? 'none' : '';
        if (comboSection) comboSection.style.display = term ? 'none' : '';

        // Toggle compact mode on body
        document.body.classList.toggle('search-active', !!term);

        // Scroll to top when searching
        if (term) window.scrollTo({ top: 0, behavior: 'smooth' });

        menuSections.forEach(({ el: section, cards }) => {
            let sectionHasMatch = false;
            cards.forEach(({ el: card, name, desc }) => {
                const matches = !term || name.includes(term) || desc.includes(term);
                card.style.display = matches ? '' : 'none';
                if (matches) sectionHasMatch = true;
            });
            section.style.display = (!term || sectionHasMatch) ? '' : 'none';
        });
    }, 250);

    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            
            // Sync all search inputs
            searchInputs.forEach(otherInput => {
                if (otherInput !== e.target) otherInput.value = e.target.value;
            });

            handleSearch(term);
        });
    });
    // ==========================================
    // Social Proof Notifications
    // ==========================================
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
        setTimeout(cycleSocialProof, 10000 + Math.random() * 5000);
    }
    setTimeout(cycleSocialProof, 5000);

    // ==========================================
    // Live Status Badge
    // ==========================================
    function updateShopStatus() {
        const badge = document.getElementById('status-badge');
        if (!badge) return;
        const hour = new Date().getHours();
        if (hour >= 8 && hour < 22) {
            badge.textContent = 'Đang mở cửa';
            badge.className = 'status-badge status-open';
        } else {
            badge.textContent = 'Quán đã nghỉ';
            badge.className = 'status-badge status-closed';
        }
    }
    updateShopStatus();
    setInterval(updateShopStatus, 60000);

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

        requestAnimationFrame(() => {
            flyer.style.left = `${cartRect.left + cartRect.width / 2 - 20}px`;
            flyer.style.top = `${cartRect.top + cartRect.height / 2 - 20}px`;
            flyer.style.transform = 'scale(0.2) rotate(360deg)';
            flyer.style.opacity = '0';
        });
        setTimeout(() => flyer.remove(), 800);
    }

    // ==========================================
    // Image Zoom (Lightbox)
    // ==========================================
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.getElementById('close-lightbox');


    function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => lightboxImg.src = '', 300);
    }
    if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    }

    // ==========================================
    // Sticky Nav Scroll Spy (debounced with rAF)
    // ==========================================
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
                                const scrollLeft = link.offsetLeft - catLinksWrapper.offsetWidth / 2 + link.offsetWidth / 2;
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

    // ==========================================
    // FAQ Accordion
    // ==========================================
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });

    // ==========================================
    // Back to Top Button
    // ==========================================
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // Floating Bubbles Decoration
    // ==========================================
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
    function createFlyingElement(btn) {
        if (!btn) return;
        const img = btn.closest('.card')?.querySelector('.card-img');
        if (!img) return;

        const rect = img.getBoundingClientRect();
        const flyer = document.createElement('div');
        flyer.className = 'cart-flyer';
        
        const style = window.getComputedStyle(img);
        flyer.style.backgroundImage = style.backgroundImage;
        flyer.style.left = rect.left + 'px';
        flyer.style.top = rect.top + 'px';
        flyer.style.width = rect.width + 'px';
        flyer.style.height = rect.height + 'px';
        
        document.body.appendChild(flyer);

        const cartTarget = document.querySelector('#nav-cart-btn') || document.querySelector('#cart-floating-btn');
        const targetRect = cartTarget.getBoundingClientRect();

        flyer.animate([
            { left: rect.left + 'px', top: rect.top + 'px', width: rect.width + 'px', height: rect.height + 'px', opacity: 1, borderRadius: '20px' },
            { left: targetRect.left + 'px', top: targetRect.top + 'px', width: '20px', height: '20px', opacity: 0, borderRadius: '50%' }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        }).onfinish = () => flyer.remove();
    }

    createBubbles();

    // Render cart on page load (restore from localStorage)
    renderCart();
    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const wasActive = item.classList.contains('active');
            
            // Close all other items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });

    // Feedback Form
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="ph ph-spinner-gap mdi-spin"></i> Đang gửi...';

            // Simulate submission
            setTimeout(() => {
                showToast('Cảm ơn bạn đã góp ý! <i class="ph-fill ph-check-circle"></i>');
                feedbackForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1000);
        });
    }

    // Initialize reveal animations for new sections
    if (typeof revealObserver !== 'undefined') {
        document.querySelectorAll('.faq-section, .feedback-section').forEach(el => revealObserver.observe(el));
    }
});
