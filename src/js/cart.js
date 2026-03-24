import { launchConfetti } from './ui.js';
import { getMenuData } from './data.js';

export function initCart() {
    let cart = JSON.parse(localStorage.getItem('che-phuong-cart') || '[]');

    const elements = {
        cartFloatingBtn: document.getElementById('cart-floating-btn'),
        navCartBtn: document.getElementById('nav-cart-btn'),
        cartModal: document.getElementById('cart-modal'),
        cartOverlay: document.getElementById('cart-overlay'),
        closeCartBtn: document.getElementById('close-cart'),
        cartItemsContainer: document.getElementById('cart-items'),
        checkoutBtn: document.getElementById('checkout-btn'),
        cartBadges: document.querySelectorAll('.cart-badge, .badgen'),
        toast: document.getElementById('toast'),
        productModal: document.getElementById('product-modal'),
        productOverlay: document.getElementById('product-overlay'),
        closeProductBtn: document.getElementById('close-product-btn'),
        modalProductName: document.getElementById('modal-product-name'),
        modalProductDesc: document.getElementById('modal-product-desc'),
        modalProductPrice: document.getElementById('modal-product-price'),
        modalProductImg: document.getElementById('modal-product-img'),
        modalProductBadge: document.getElementById('modal-product-badge'),
        modalQtyValue: document.getElementById('modal-qty-value'),
        modalQtyMinus: document.getElementById('modal-qty-minus'),
        modalQtyPlus: document.getElementById('modal-qty-plus'),
        modalAddToCartBtn: document.getElementById('modal-add-to-cart-btn'),
        modalToppingsSection: document.getElementById('modal-toppings-section'),
        modalToppingsContainer: document.getElementById('modal-toppings-container'),
        searchInputs: document.querySelectorAll('.menu-search'),
        deliveryNotesInput: document.getElementById('cart-delivery-notes')
    };

    let modalQty = 1;

    const availableToppings = [
        { name: 'Caramen', icon: 'ph-star', price: 5000 },
        { name: 'Trân châu đen', icon: 'ph-circle', price: 5000 },
        { name: 'Trân châu giòn', icon: 'ph-circle-dashed', price: 5000 },
        { name: 'Trân châu nhân dừa', icon: 'ph-nut', price: 8000 }
    ];

    function renderCart() {
        if (!elements.cartItemsContainer) return;
        
        if (cart.length === 0) {
            elements.cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Giỏ hàng đang trống.</p>';
            if (elements.checkoutBtn) elements.checkoutBtn.disabled = true;
        } else {
            elements.cartItemsContainer.innerHTML = '';
            cart.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'cart-item';
                const itemPrice = item.price || 0;
                const toppingPrice = (item.selectedToppings || []).reduce((sum, t) => sum + (t.price || 0), 0);
                const totalForItem = (itemPrice + toppingPrice) * item.qty;

                const toppingText = item.selectedToppings?.length > 0 ? 
                    `<small style="display:block; color:var(--accent-color)">+ ${item.selectedToppings.map(t => t.name).join(', ')}</small>` : '';
                
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
                    <div class="cart-item-total">${totalForItem.toLocaleString('vi-VN')}đ</div>
                `;
                elements.cartItemsContainer.appendChild(div);
            });
            if (elements.checkoutBtn) elements.checkoutBtn.disabled = false;

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
                elements.cartItemsContainer.appendChild(clearContainer);
            }
        }

        const grandTotal = cart.reduce((sum, item) => {
            const itemPrice = item.price || 0;
            const toppingPrice = (item.selectedToppings || []).reduce((sum, t) => sum + (t.price || 0), 0);
            return sum + (itemPrice + toppingPrice) * item.qty;
        }, 0);

        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        elements.cartBadges.forEach(badge => badge.textContent = totalItems);
        const totalEl = document.getElementById('cart-grand-total');
        if (totalEl) totalEl.textContent = grandTotal.toLocaleString('vi-VN') + 'đ';
        
        localStorage.setItem('che-phuong-cart', JSON.stringify(cart));
    }

    function toggleCart() {
        if (!elements.cartModal) return;
        const isActive = elements.cartModal.classList.toggle('active');
        elements.cartOverlay?.classList.toggle('active');
        document.body.classList.toggle('cart-open', isActive);
        if (isActive) renderCart();
    }

    // Toggle Events
    [elements.cartFloatingBtn, elements.navCartBtn, elements.closeCartBtn, elements.cartOverlay].forEach(el => {
        el?.addEventListener('click', toggleCart);
    });

    // Product Modal & Add Actions
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Remove the early return so clicking "Add to cart" button still opens the modal
            const id = card.dataset.id;
            const product = getMenuData(id);
            
            if (!product) {
                console.error("Product not found for id:", id);
                return;
            }

            elements.modalProductName.textContent = product.name;
            elements.modalProductDesc.textContent = product.desc;
            elements.modalProductPrice.textContent = product.price.toLocaleString('vi-VN') + 'đ';
            
            const modalImgContainer = document.querySelector('.product-detail-image');
            const modalGrid = document.querySelector('.product-detail-grid');
            const modalContent = document.querySelector('.product-detail-content');
            
            // We use the image from data, but fallback to DOM if empty
            let imgSrc = product.image;
            if (!imgSrc) {
                const imgEl = card.querySelector('.card-img');
                if (imgEl) {
                    if (imgEl.tagName.toLowerCase() === 'img') {
                        imgSrc = imgEl.src;
                    } else {
                        const style = window.getComputedStyle(imgEl);
                        imgSrc = style.backgroundImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
                    }
                }
            }

            if (imgSrc && imgSrc !== 'none') {
                elements.modalProductImg.src = imgSrc;
                if (modalImgContainer) modalImgContainer.style.display = 'block';
                if (modalGrid) modalGrid.classList.remove('no-image');
                if (modalContent) modalContent.classList.remove('no-image-content');
            } else {
                elements.modalProductImg.src = '';
                if (modalImgContainer) modalImgContainer.style.display = 'none';
                if (modalGrid) modalGrid.classList.add('no-image');
                if (modalContent) modalContent.classList.add('no-image-content');
            }
            
            // Generate category name
            const categoryNames = {
                'combos': 'Combo',
                'modern': 'Kiểu mới',
                'traditional': 'Truyền thống',
                'yogurt': 'Sữa chua',
                'drinks': 'Đồ uống'
            };
            elements.modalProductBadge.textContent = categoryNames[product.category] || "Phổ biến";
            
            modalQty = 1;
            elements.modalQtyValue.textContent = modalQty;
            
            elements.productModal.classList.add('active');
            elements.productOverlay.classList.add('active');

            // Toppings Logic
            if (product.needsTopping) {
                elements.modalToppingsSection.style.display = 'block';
                elements.modalToppingsContainer.innerHTML = '';
                availableToppings.forEach(top => {
                    const chip = document.createElement('div');
                    chip.className = 'topping-chip';
                    chip.innerHTML = `<i class="ph ${top.icon}"></i> ${top.name} (+${(top.price/1000)}k)`;
                    chip.dataset.price = top.price;
                    chip.dataset.name = top.name;
                    chip.addEventListener('click', () => chip.classList.toggle('selected'));
                    elements.modalToppingsContainer.appendChild(chip);
                });
            } else {
                elements.modalToppingsSection.style.display = 'none';
                elements.modalToppingsContainer.innerHTML = '';
            }
        });
    });

    // Close Modal Logic
    elements.closeProductBtn?.addEventListener('click', () => {
        elements.productModal.classList.remove('active');
        elements.productOverlay.classList.remove('active');
    });
    elements.productOverlay?.addEventListener('click', () => {
        elements.productModal.classList.remove('active');
        elements.productOverlay.classList.remove('active');
    });

    elements.modalQtyPlus?.addEventListener('click', () => elements.modalQtyValue.textContent = ++modalQty);
    elements.modalQtyMinus?.addEventListener('click', () => { if (modalQty > 1) elements.modalQtyValue.textContent = --modalQty; });

    function showToast(msg) {
        if (!elements.toast) return;
        elements.toast.textContent = msg;
        elements.toast.classList.add('show');
        setTimeout(() => elements.toast.classList.remove('show'), 2000);
    }

    elements.modalAddToCartBtn?.addEventListener('click', () => {
        const name = elements.modalProductName.textContent;
        const price = parseInt(elements.modalProductPrice.textContent.replace(/\D/g, ''));
        const selectedToppings = Array.from(elements.modalToppingsContainer.querySelectorAll('.topping-chip.selected')).map(chip => ({
            name: chip.dataset.name,
            price: parseInt(chip.dataset.price)
        }));

        for(let i=0; i<modalQty; i++) {
            const existing = cart.find(item => item.name === name && JSON.stringify(item.selectedToppings) === JSON.stringify(selectedToppings));
            if (existing) existing.qty += 1;
            else cart.push({ name, qty: 1, selectedToppings, price });
        }
        
        launchConfetti();
        renderCart();
        
        // Trigger Cart Bounce on all badges
        const cartTargets = document.querySelectorAll('.nav-cart-btn, #cart-floating-btn');
        cartTargets.forEach(target => {
            target.classList.add('cart-bounce');
            setTimeout(() => { target.classList.remove('cart-bounce'); }, 500);
        });

        showToast(`Đã thêm ${name} vào giỏ!`);

        elements.productModal.classList.remove('active');
        elements.productOverlay.classList.remove('active');
    });

    // Handle +/- buttons and delete in cart
    elements.cartItemsContainer?.addEventListener('click', e => {
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

    // Checkout Action
    elements.checkoutBtn?.addEventListener('click', () => {
        if (cart.length === 0) return;
        let orderText = "Chào tiệm Chè Phương, mình muốn đặt các món sau:\n";
        cart.forEach(item => {
            orderText += `- ${item.qty} x ${item.name}`;
            if (item.selectedToppings?.length > 0) orderText += ` (Topping: ${item.selectedToppings.map(t => t.name).join(', ')})`;
            orderText += `\n`;
        });
        const notes = elements.deliveryNotesInput?.value.trim();
        if (notes) orderText += `\n📝 Ghi chú: ${notes}`;
        
        navigator.clipboard.writeText(orderText).then(() => {
            window.location.href = 'https://m.me/phuong.nguyen.298061';
        });
    });

    // Search Logic (Debounced)
    const handleSearch = (term) => {
        document.body.classList.toggle('search-active', !!term);
        document.querySelectorAll('.menu-section').forEach(section => {
            let hasMatch = false;
            section.querySelectorAll('.card').forEach(card => {
                const matches = !term || card.textContent.toLowerCase().includes(term);
                card.style.display = matches ? '' : 'none';
                if (matches) hasMatch = true;
            });
            section.style.display = (!term || hasMatch) ? '' : 'none';
        });
    };

    elements.searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            elements.searchInputs.forEach(i => (i.value = e.target.value));
            handleSearch(term);
        });
    });

    renderCart(); // Initial load
}
