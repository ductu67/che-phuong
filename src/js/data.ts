export interface MenuItem {
    id: string;
    name: string;
    desc: string;
    price: number;
    image: string;
    category: string;
    needsTopping: boolean;
}

export const menuData: Record<string, MenuItem> = {
    "combo-song-thanh-thoi": {
        "id": "combo-song-thanh-thoi",
        "name": "Combo Sống Thảnh Thơi",
        "desc": "2 Chè Sầu Riêng + 1 Chè Bơ. Một bữa tiệc hương vị béo ngậy, ngọt thanh cho nhóm bạn.",
        "price": 70000,
        "image": "",
        "category": "combos",
        "needsTopping": false
    },
    "combo-cap-doi-hoan-hao": {
        "id": "combo-cap-doi-hoan-hao",
        "name": "Combo Cặp Đôi Hoàn Hảo",
        "desc": "1 Chè Xoài Hồng Kông + 1 Sữa Chua Mít. Sự cân bằng giữa vị ngọt dịu và chua thanh.",
        "price": 45000,
        "image": "",
        "category": "combos",
        "needsTopping": false
    },
    "combo-tra-che": {
        "id": "combo-tra-che",
        "name": "Combo Trà & Chè",
        "desc": "1 Trà Tắc Xí Muội + 1 Chè Ngọc Thạch. Kết hợp chua thanh và ngọt mát — chuẩn combo giải\r\n                            nhiệt.",
        "price": 30000,
        "image": "",
        "category": "combos",
        "needsTopping": false
    },
    "combo-healthy-chua-ngot": {
        "id": "combo-healthy-chua-ngot",
        "name": "Combo Healthy Chua Ngọt",
        "desc": "1 Sữa Chua Chanh Leo + 1 Sữa Chua Hoa Quả. Hai vị chua thanh hòa quyện, nhẹ ngọt và rất tươi.",
        "price": 45000,
        "image": "",
        "category": "combos",
        "needsTopping": false
    },
    "combo-matcha-che": {
        "id": "combo-matcha-che",
        "name": "Combo Matcha & Chè",
        "desc": "1 Matcha Latte + 1 Chè Khúc Bạch. Đắng nhẹ của matcha hòa cùng khúc bạch béo mềm — combo sang\r\n                            chảnh nhất tiệm.",
        "price": 45000,
        "image": "",
        "category": "combos",
        "needsTopping": false
    },
    "matcha-latte": {
        "id": "matcha-latte",
        "name": "Matcha Latte",
        "desc": "Trà xanh Nhật Bản đậm vị chan lẫn sữa tươi thơm béo và bọt kem mịn màng.",
        "price": 25000,
        "image": "/matcha-latte.webp",
        "category": "drinks",
        "needsTopping": true
    },
    "tra-quat-nha-dam": {
        "id": "tra-quat-nha-dam",
        "name": "Trà Quất Nha Đam",
        "desc": "Vị chua thanh của quất hòa với nha đam giòn tan, thanh mát giải nhiệt mùa hè.",
        "price": 15000,
        "image": "/tra-quat-nhadam.webp",
        "category": "drinks",
        "needsTopping": true
    },
    "tra-chanh": {
        "id": "tra-chanh",
        "name": "Trà Chanh",
        "desc": "Hương vị trà đen nguyên bản kết hợp chanh tươi mộc mạc và sảng khoái.",
        "price": 15000,
        "image": "/tra-chanh.webp",
        "category": "drinks",
        "needsTopping": true
    },
    "tra-tac-xi-muoi": {
        "id": "tra-tac-xi-muoi",
        "name": "Trà Tắc Xí Muội",
        "desc": "Trà ủ sậm màu với tắc thơm lừng thêm viên xí muội mặn mặn chua chua độc đáo.",
        "price": 20000,
        "image": "/tra-tac-ximuoi.webp",
        "category": "drinks",
        "needsTopping": true
    },
    "tra-thai-xanh": {
        "id": "tra-thai-xanh",
        "name": "Trà Thái Xanh",
        "desc": "Trà Thái xanh thơm mát với sữa đặc béo nhẹ, thêm chút hương vani dịu dàng khó cưỡng.",
        "price": 20000,
        "image": "/tra-thai-xanh.webp",
        "category": "drinks",
        "needsTopping": true
    },
    "sua-chua-danh-da": {
        "id": "sua-chua-danh-da",
        "name": "Sữa Chua Đánh Đá",
        "desc": "Sữa chua tươi đánh bông mịn, đá xay lạnh sảng khoái — giải nhiệt nhanh nhất hè này.",
        "price": 25000,
        "image": "/sua-chua-danh-da.webp",
        "category": "drinks",
        "needsTopping": true
    },
    "sua-chua-viet-quat": {
        "id": "sua-chua-viet-quat",
        "name": "Sữa Chua Việt Quất",
        "desc": "Sữa chua chua dịu kết hợp việt quất tím đậm antioxidant, vừa ngon vừa healthy.",
        "price": 25000,
        "image": "/sua-chua-viet-quat.webp",
        "category": "drinks",
        "needsTopping": true
    },
    "sua-chua-chanh-leo": {
        "id": "sua-chua-chanh-leo",
        "name": "Sữa Chua Chanh Leo",
        "desc": "Chanh leo chua thanh bùng nổ hòa vào lớp sữa chua mịn mượt, cực mát và đã khát.",
        "price": 25000,
        "image": "/sua-chua-chanh-leo.webp",
        "category": "drinks",
        "needsTopping": true
    },
    "sua-chua-dau-tay": {
        "id": "sua-chua-dau-tay",
        "name": "Sữa Chua Dâu Tây",
        "desc": "Dâu tây đỏ mọng đậm hương, hòa quyện cùng sữa chua trắng tinh khiết — màu sắc và vị đều đỉnh.",
        "price": 25000,
        "image": "/sua-chua-dau-tay.webp",
        "category": "drinks",
        "needsTopping": true
    },
    "sua-chua-oi-hong": {
        "id": "sua-chua-oi-hong",
        "name": "Sữa Chua Ổi Hồng",
        "desc": "Ổi hồng giòn thơm đặc trưng, kết hợp sữa chua tươi mát — vị ngọt nhẹ rất đặc biệt.",
        "price": 25000,
        "image": "/sua-chua-oi-hong.webp",
        "category": "drinks",
        "needsTopping": true
    },
    "che-sau-rieng": {
        "id": "che-sau-rieng",
        "name": "Chè Sầu Riêng",
        "desc": "Sầu riêng tươi xay nhuyễn, thạch dai giòn kết hợp nước cốt dừa thơm béo, vị ngọt thanh dễ\r\n                            chịu.",
        "price": 25000,
        "image": "/saurieng.webp",
        "category": "modern",
        "needsTopping": true
    },
    "che-xoai-hong-kong": {
        "id": "che-xoai-hong-kong",
        "name": "Chè Xoài Hồng Kông",
        "desc": "Xoài cát chín tự nhiên, trân châu trắng và cốt dừa mang lại hương vị ngọt dịu thanh mát.",
        "price": 25000,
        "image": "/xoai.webp",
        "category": "modern",
        "needsTopping": true
    },
    "che-ngoc-thach": {
        "id": "che-ngoc-thach",
        "name": "Chè Ngọc Thạch",
        "desc": "Các loại thạch rực rỡ, dai dai giòn giòn cùng nước dùng sữa dừa phảng phất hương hoa bưởi.",
        "price": 15000,
        "image": "/ngocthach.webp",
        "category": "modern",
        "needsTopping": true
    },
    "che-khoai-deo": {
        "id": "che-khoai-deo",
        "name": "Chè Khoai Dẻo",
        "desc": "Khoai lang tím, vàng dẻo bùi xắt hạt lựu hòa quyện vị thanh mát cốt dừa.",
        "price": 20000,
        "image": "/khoaideo.webp",
        "category": "modern",
        "needsTopping": true
    },
    "che-khuc-bach-nhan": {
        "id": "che-khuc-bach-nhan",
        "name": "Chè Khúc Bạch Nhãn",
        "desc": "Những viên khúc bạch phô mai mềm tan cùng độ ngọt thanh của nhãn lồng giòn sần sật.",
        "price": 25000,
        "image": "/khucbach.webp",
        "category": "modern",
        "needsTopping": true
    },
    "che-dua-non": {
        "id": "che-dua-non",
        "name": "Chè Dừa Non",
        "desc": "Nước cốt dừa thơm, thạch lá dứa núng nính, và sợi dừa non sần sật ít ngọt.",
        "price": 25000,
        "image": "/duanon.webp",
        "category": "modern",
        "needsTopping": true
    },
    "che-bo": {
        "id": "che-bo",
        "name": "Chè Bơ",
        "desc": "Bơ dằm béo xốp kết hợp thạch phô mai và sữa tươi thanh nhẹ.",
        "price": 25000,
        "image": "/bo.webp",
        "category": "modern",
        "needsTopping": true
    },
    "suong-sao-tran-chau-cot-dua": {
        "id": "suong-sao-tran-chau-cot-dua",
        "name": "Sương Sáo Trân Châu Cốt Dừa",
        "desc": "Sương sáo thanh mát đen nhánh, trân châu dẻo bùi kết hợp cốt dừa.",
        "price": 15000,
        "image": "/suongsao.webp",
        "category": "modern",
        "needsTopping": true
    },
    "che-thap-cam": {
        "id": "che-thap-cam",
        "name": "Chè Thập Cẩm",
        "desc": "Tuyển tập đậu đỏ, đậu đen, thạch đen, dừa khô quyện bùi và nước cốt mộc mạc.",
        "price": 20000,
        "image": "/thapcam.webp",
        "category": "traditional",
        "needsTopping": true
    },
    "che-buoi": {
        "id": "che-buoi",
        "name": "Chè Bưởi",
        "desc": "Cùi bưởi giòn sần sật, dẻo quẹo đậu xanh đánh nhuyễn mịn màng.",
        "price": 20000,
        "image": "/buoi.webp",
        "category": "traditional",
        "needsTopping": true
    },
    "che-do-den-tran-chau-dua": {
        "id": "che-do-den-tran-chau-dua",
        "name": "Chè Đỗ Đen Trân Châu Dừa",
        "desc": "Đỗ đen hầm nhừ ngọt thanh ăn kèm trân châu bọc dừa tươi dai sần sật.",
        "price": 15000,
        "image": "/doden.webp",
        "category": "traditional",
        "needsTopping": true
    },
    "che-ngo-dua-non": {
        "id": "che-ngo-dua-non",
        "name": "Chè Ngô Dừa Non",
        "desc": "Ngô luộc dẻo mềm, cốt dừa thơm lừng, giữ trọn vị ngọt tự nhiên của ngô non.",
        "price": 15000,
        "image": "/ngo.webp",
        "category": "traditional",
        "needsTopping": true
    },
    "che-com-dua-non": {
        "id": "che-com-dua-non",
        "name": "Chè Cốm Dừa Non",
        "desc": "Hương cốm xanh thoang thoảng mùa thu Hà Nội, quấn quýt cùng dừa non thanh tao.",
        "price": 15000,
        "image": "/com.webp",
        "category": "traditional",
        "needsTopping": true
    },
    "sua-chua-mit": {
        "id": "sua-chua-mit",
        "name": "Sữa Chua Mít",
        "desc": "Mít vàng dai giòn thơm tự nhiên, thạch sương sáo thanh mát trộn sữa chua chua dịu.",
        "price": 20000,
        "image": "/suachuamit.webp",
        "category": "yogurt",
        "needsTopping": true
    },
    "sua-chua-nep-cam": {
        "id": "sua-chua-nep-cam",
        "name": "Sữa Chua Nếp Cẩm",
        "desc": "Nếp cẩm ủ men thơm nồng bùi bùi, ăn kèm sữa chua thanh mát ít ngọt.",
        "price": 25000,
        "image": "/suachuanepcam.webp",
        "category": "yogurt",
        "needsTopping": true
    },
    "sua-chua-hoa-qua": {
        "id": "sua-chua-hoa-qua",
        "name": "Sữa Chua Hoa Quả",
        "desc": "Trái cây tươi theo mùa cắt hạt lựu hòa mình trong lớp sữa chua chua ngọt đánh thức vị giác.",
        "price": 25000,
        "image": "/suachuahoaqua.webp",
        "category": "yogurt",
        "needsTopping": true
    },
    "sua-chua-tran-chau": {
        "id": "sua-chua-tran-chau",
        "name": "Sữa Chua Trân Châu",
        "desc": "Trân châu trắng giòn và trân châu đen dẻo bùi trong sốt sữa chua thanh dịu.",
        "price": 20000,
        "image": "/suachuatranchau.webp",
        "category": "yogurt",
        "needsTopping": true
    }
};

export function getMenuData(id: string): MenuItem | null {
    return menuData[id] || null;
}

export function updateMenuData(newData: Record<string, MenuItem>) {
    // Xóa ruột cũ một cách an toàn và đảm bảo GC
    Object.keys(menuData).forEach(key => delete menuData[key]);
    
    // Chắp vá ruột mới từ Google Sheets
    Object.assign(menuData, newData);
}

export function injectSEOMenuSchema() {
    const items = Object.values(menuData).map((item, index) => ({
        "@type": "MenuItem",
        "name": item.name,
        "description": item.desc,
        "position": index + 1,
        "offers": {
            "@type": "Offer",
            "price": item.price,
            "priceCurrency": "VND"
        }
    }));

    const schema = {
        "@context": "https://schema.org",
        "@type": "Menu",
        "name": "Thực đơn Tiệm Chè Phương",
        "hasMenuSection": [
            {
                "@type": "MenuSection",
                "name": "Tất cả món",
                "hasMenuItem": items
            }
        ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
}
