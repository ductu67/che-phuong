const fs = require('fs');
let html = fs.readFileSync('c:/Users/Admin/WebstormProjects/chephuong/index.html', 'utf8');

let count = 0;
let newHtml = html.replace(/<a href=\"https:\/\/zalo\.me\/[^\"]+\"[^>]*>Đặt hàng ngay<\/a>/g, () => {
    count++;
    return '<a href=\"https://m.me/phuong.nguyen.298061\" target=\"_blank\"\n                            class=\"btn order-btn\">Đặt qua Fanpage</a>';
});

fs.writeFileSync('c:/Users/Admin/WebstormProjects/chephuong/index.html', newHtml);
console.log('Modified ' + count + ' links.');
