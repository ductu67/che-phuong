import { updateMenuData, menuData } from './data.js';

// URL CSV của Google Sheets (Publish to Web -> CSV)
// VÍ DỤ: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT..../pub?gid=0&single=true&output=csv"
export const GOOGLE_SHEET_CSV_URL = ""; 

/**
 * Hàm phân tích file CSV đơn giản (không cần thư viện papaparse)
 */
function parseCSV(csvText: string) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const result = [];

    // Parse từng dòng
    for (let i = 1; i < lines.length; i++) {
        // Handle CSV properly ignoring commas inside quotes
        const regex = /(?:^|,)(?=[^"]|")("([^"]|"")*"|[^,]*)/g;
        let match;
        const row = [];
        
        while ((match = regex.exec(lines[i])) !== null) {
            if (match[1]) {
                let cell = match[1].replace(/^"|"$/g, '').replace(/""/g, '"').trim();
                row.push(cell);
            } else {
                row.push('');
            }
        }

        if (row.length === headers.length) {
            const obj: any = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            result.push(obj);
        }
    }
    return result;
}

/**
 * Render thẻ HTML Card vào đúng Grid
 */
function renderCardsToGrid(menuObj: any) {
    const categories = ['combos', 'modern', 'traditional', 'yogurt', 'drinks'];
    
    // Xóa nội dung cũ trong các grid
    categories.forEach(cat => {
        const grid = document.querySelector(`#${cat} .cards-grid`);
        if (grid) grid.innerHTML = '';
    });

    Object.values(menuObj).forEach((item: any) => {
        const grid = document.querySelector(`#${item.category} .cards-grid`);
        if (!grid) return;

        const card = document.createElement('div');
        card.className = 'card reveal-card';
        card.dataset.id = item.id;
        
        // Handle mock classes for images if real image URL doesn't exist
        let imgClass = '';
        let imgStyle = '';
        if (item.image) {
            imgStyle = `style="background-image: url('${item.image}')"`;
        } else if (item.category === 'combos') {
            imgStyle = `style="display: none;"`; // Hide entirely for combos without image
        } else {
            imgClass = `mock-img-${item.id.replace('che-', '')}`;
        }

        card.innerHTML = `
            <div class="card-img ${imgClass}" role="img" aria-label="Hình ảnh ${item.name}" ${imgStyle}></div>
            <div class="card-content">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="card-price">${parseInt(item.price as unknown as string).toLocaleString('vi-VN')}đ</div>
                <button class="btn order-btn add-to-cart-btn" data-id="${item.id}" 
                    aria-label="Thêm ${item.name} vào giỏ hàng">
                    <i class="ph ph-shopping-cart"></i> Thêm vào giỏ
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Kích hoạt lại animation reveal cho thẻ mới load
    const reveals = document.querySelectorAll('.reveal-card, .reveal, .reveal-text');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
}

/**
 * Gọi hàm tải CMS (Có sử dụng Cache localStorage)
 */
export async function loadCMSAndRender() {
    if (!GOOGLE_SHEET_CSV_URL) {
        console.log("CMS URL trống, sử dụng data cứng cục bộ mặc định.");
        renderCardsToGrid(menuData);
        return false;
    }

    const CACHE_KEY = 'che-phuong-cms-data';
    const CACHE_TTL = 3600 * 1000; // 1 giờ
    const cachedStr = localStorage.getItem(CACHE_KEY);

    try {
        if (cachedStr) {
            const parsedCache = JSON.parse(cachedStr);
            if (Date.now() - parsedCache.timestamp < CACHE_TTL) {
                console.log("Sử dụng dữ liệu CMS từ cache...");
                updateMenuData(parsedCache.data);
                renderCardsToGrid(parsedCache.data);
                
                // Fetch ngầm để cập nhật cache mới nhất cho lần sau
                setTimeout(() => fetchAndParseCMS(CACHE_KEY, false), 2000);
                return true;
            }
        }
    } catch (e) {
        console.warn("Lỗi đọc cache CMS, sẽ tải lại từ mạng.");
    }

    return await fetchAndParseCMS(CACHE_KEY, true);
}

async function fetchAndParseCMS(cacheKey: string, doRender: boolean) {
    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL, { cache: 'no-store' }); // Luôn tải dữ liệu mới nhất
        if (!response.ok) throw new Error("HTTP-Error: " + response.status);
        
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        
        const newMenuData: any = {};
        parsedData.forEach(item => {
            newMenuData[item.id] = {
                id: item.id,
                name: item.name,
                desc: item.desc,
                price: parseInt(item.price) || 0,
                image: item.image || "",
                category: item.category,
                needsTopping: item.needsTopping === "true" || item.needsTopping === "TRUE"
            };
        });

        // Lưu vào cache
        localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: newMenuData
        }));

        if (doRender) {
            // Cập nhật lại kho Data dùng chung
            updateMenuData(newMenuData);
            // Render lại giao diện lưới
            renderCardsToGrid(newMenuData);
        }
        return true;
    } catch (error) {
        console.error("Lỗi khi kéo Google Sheets CMS:", error);
        if (doRender) {
            renderCardsToGrid(menuData); // Fallback khi lỗi
        }
        return false; 
    }
}
