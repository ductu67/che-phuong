const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf-8');

const sections = [
    { regex: /<header id="header"[\s\S]*?<\/header>/, file: 'navbar.html' },
    { regex: /<section id="hero"[\s\S]*?<\/section>/, file: 'hero.html' },
    { regex: /<div id="sticky-cat-nav"[\s\S]*?<\/div>\s*<\/div>/, file: 'categories.html' },
    { regex: /<section id="combos"[\s\S]*?<\/section>/, file: 'combos.html' },
    { regex: /<section id="modern"[\s\S]*?<\/section>/, file: 'modern.html' },
    { regex: /<section id="traditional"[\s\S]*?<\/section>/, file: 'traditional.html' },
    { regex: /<section id="yogurt"[\s\S]*?<\/section>/, file: 'yogurt.html' },
    { regex: /<section id="drinks"[\s\S]*?<\/section>/, file: 'drinks.html' },
    { regex: /<section id="reviews"[\s\S]*?<\/section>/, file: 'reviews.html' },
    { regex: /<section id="faq"[\s\S]*?<\/section>/, file: 'faq.html' },
    { regex: /<section id="gallery"[\s\S]*?<\/section>/, file: 'gallery.html' },
    { regex: /<footer id="footer"[\s\S]*?<\/footer>/, file: 'footer.html' }
];

sections.forEach(sec => {
    const match = html.match(sec.regex);
    if (match) {
        fs.writeFileSync(`src/html/${sec.file}`, match[0]);
        html = html.replace(sec.regex, `<include src="./src/html/${sec.file}" />`);
    } else {
        console.log("Could not find", sec.file);
    }
});

fs.writeFileSync('index.html', html);
console.log("Refactored index.html");
