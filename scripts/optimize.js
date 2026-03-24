const fs = require('fs');
const path = require('path');

const htmlDir = path.join(process.cwd(), 'src', 'html');
const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

const menuData = {};

function stringToId(str) {
    return str.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

files.forEach(file => {
    let html = fs.readFileSync(path.join(htmlDir, file), 'utf-8');
    
    // Add loading="lazy" width="600" height="400" to card-img if not exists
    html = html.replace(/<img([^>]*)class="([^"]*)card-img([^"]*)"([^>]*)>/g, (match, p1, p2, p3, p4) => {
        let newMatch = match;
        if (!newMatch.includes('width=')) newMatch = newMatch.replace('<img', '<img width="600" height="400"');
        if (!newMatch.includes('loading="lazy"')) newMatch = newMatch.replace('<img', '<img loading="lazy"');
        return newMatch;
    });

    // Parse cards to inject data-id and extract data
    // We'll use a regex that captures the card inner HTML. 
    // This is a bit fragile with regex, but it's a known small structure.
    const cardRegex = /<div class="card[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
    
    html = html.replace(/<div class="(card[^"]*)">([\s\S]*?)<button class="([^"]*add-to-cart-btn[^"]*)"([^>]*)>([\s\S]*?)<\/button>\s*<\/div>\s*<\/div>/g, (match, classes, inner, btnClasses, btnAttrs, btnInner) => {
        // Extract info
        const nameMatch = inner.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
        if (!nameMatch) return match;
        
        const name = nameMatch[1].trim();
        const id = stringToId(name);
        
        const descMatch = inner.match(/<p[^>]*>([\s\S]*?)<\/p>/);
        const desc = descMatch ? descMatch[1].trim() : '';
        
        const priceMatch = inner.match(/(?:card-price|new-price)[^>]*>([^<]+)</);
        const priceText = priceMatch ? priceMatch[1].trim() : '0đ';
        const price = parseInt(priceText.replace(/\D/g, '')) || 0;
        
        const categoryMatch = file.replace('.html', '');
        
        // Image
        const imgMatch = inner.match(/<img[^>]*src="([^"]+)"/);
        let imgSrc = imgMatch ? imgMatch[1] : '';
        if (!imgSrc) {
            const bgMatch = inner.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/);
            if (bgMatch) imgSrc = bgMatch[1];
        }

        const isCombo = name.includes('Combo');
        const needsTopping = !isCombo && (name.includes('Chè') || name.includes('Sữa Chua') || name.includes('Sương Sáo') || name.includes('Trà') || name.includes('Matcha') || name.includes('Đồ Uống'));

        menuData[id] = { id, name, desc, price, image: imgSrc, category: categoryMatch, needsTopping };

        // Inject data-id into card and button
        // Reconstruct the HTML
        let newInner = inner.replace(/data-name="[^"]*"/, ''); // Remove old data-name if any
        let newBtnAttrs = btnAttrs.replace(/data-name="[^"]*"/, '');
        
        return `<div class="${classes}" data-id="${id}">${newInner}<button class="${btnClasses}" data-id="${id}"${newBtnAttrs}>${btnInner}</button>\n                    </div>\n                </div>`;
    });

    fs.writeFileSync(path.join(htmlDir, file), html);
});

// Write data.js
const dataJs = `export const menuData = ${JSON.stringify(menuData, null, 4)};\n\nexport function getMenuData(id) {\n    return menuData[id] || null;\n}\n`;
fs.writeFileSync(path.join(process.cwd(), 'src', 'js', 'data.js'), dataJs);

console.log("Extraction and optimization complete.");
