// src/data/productsData.js
// Đây chỉ là dữ liệu mẫu, bạn cần thêm các trường cần thiết và dữ liệu thực tế
export const apiProducts = [
    {
        id: 1,
        name: 'Nike Mercurial Vapor 14 Elite TF',
        price: 2800000,
        oldPrice: 3200000,
        brand: 'Nike',
        size: ['39', '40', '41', '42'],
        colors: [
            { id: 'white_red', name: 'Trắng/Đỏ', hex: '#FFFFFF', secondaryHex: '#FF0000' },
            { id: 'black_volt', name: 'Đen/Vàng Neon', hex: '#000000', secondaryHex: '#CEFF00' }
        ],
        img: './assets/img/product/nikedrifit1.jpg',
        gallery: [
            './assets/img/product/nikedrifit1.jpg',
            './assets/img/product/superfly2.png',
            './assets/img/product/superfly3.png'
        ],
        category: 'Giày dép',
        type: 'Bóng đá',
        inStock: true,
        date: '2023-01-15',
        sales: 120,
        rating: 4.5,
        shortDescription: 'Giày đá bóng sân cỏ nhân tạo Nike Mercurial Vapor 14 Elite TF với thiết kế tốc độ.',
        fullDescription: `
          <p><strong>NIKE MERCURIAL VAPOR 14 ELITE TF – CV0953-107 - TRẮNG/BẠC SAFARI</strong></p>
          <p>Thông số kĩ thuật:</p>
          <ul>
              <li>Phân khúc: Elite (cao cấp).</li>
              <li>Upper: Flyknit kết hợp NikeSkin - Siêu mỏng, siêu nhẹ, siêu bền.</li>
              <li>Thiết kế đinh giày: Đinh TF chuyên dụng cho sân cỏ nhân tạo.</li>
              <li>Độ ôm chân: Cao, vừa vặn.</li>
              <li>Bộ sưu tập: SAFARI PACK - Ra mắt tháng 4/2021</li>
              <li>Trên chân các cầu thủ nổi tiếng như: Cristiano Ronaldo, Kylian Mbappé...</li>
          </ul>
      `
    },
    {
        id: 2,
        name: 'Adidas Stan Smith Originals',
        price: 1800000,
        brand: 'Adidas',
        size: ['38', '39', '40', '41'],
        colors: [
            { id: 'classic_white_green', name: 'Trắng/Xanh Lá', hex: '#FFFFFF', secondaryHex: '#008000' }
        ],
        img: './assets/img/product/stansmithgolf1.jpg',
        gallery: [
            './assets/img/product/stansmithgolf1.jpg',
            './assets/img/product/stansmithgolf2.jpg',
            './assets/img/product/stansmithgolf3.jpg'
        ],
        category: 'Giày dép',
        type: 'Thời trang',
        inStock: true,
        date: '2023-02-20',
        sales: 250,
        rating: 5,
        shortDescription: 'Đôi giày huyền thoại Adidas Stan Smith, biểu tượng của phong cách tối giản.',
        fullDescription: `<p>Đúng chất kinh điển. Trước đây, Stan Smith từng là ngôi sao lớn của làng quần vợt. Mang đôi giày adidas xứng tầm tên tuổi của ông, bạn sẽ là ngôi sao đường phố. Từ trên xuống dưới, đôi giày kinh điển này bắt trọn tinh hoa phong cách của kiểu dáng nguyên bản năm 1971, với thiết kế bằng da tối giản và đường nét gọn gàng.</p>`
    },
    // Thêm các sản phẩm khác vào đây với đầy đủ các trường
    {
        id: 'joma_super', // Dùng string id để khớp với ProductDetailPage ví dụ
        name: 'Joma Super Regate',
        price: 1500000,
        oldPrice: 1750000,
        brand: 'Joma',
        size: ['40', '41', '42'],
        img: './assets/img/product/addidas1.jpg', // Thay hình ảnh
        category: 'Giày dép',
        type: 'Futsal',
        inStock: true,
        date: '2023-03-10',
        sales: 80,
        rating: 4,
        shortDescription: 'Giày futsal Joma Super Regate chuyên nghiệp.',
        fullDescription: '<p>Mô tả chi tiết về Joma Super Regate...</p>',
        gallery: ['./assets/img/product/addidas1.jpg', './assets/img/product/giayxanh.jpg'],
        colors: [{ id: 'blue_yellow', name: 'Xanh/Vàng', hex: '#0000FF', secondaryHex: '#FFFF00' }],
    },
    {
        id: 'ambush1', // ID này đã được dùng trong HomePage
        name: 'Áo Brooklyn Ambush',
        price: 1000000,
        oldPrice: 1200000,
        brand: 'Ambush',
        size: ['S', 'M', 'L'],
        img: './assets/img/product/ambush1.jpg',
        gallery: ['./assets/img/product/ambush1.jpg', './assets/img/product/ambush2.png', './assets/img/product/ambush3.png'],
        category: 'Quần, áo',
        type: 'Thời trang',
        inStock: true,
        date: '2023-04-01',
        sales: 79,
        rating: 3.5,
        shortDescription: 'Áo thun Brooklyn cá tính từ thương hiệu Ambush.',
        fullDescription: '<p>Chi tiết về áo Brooklyn Ambush...</p>',
        colors: [{ id: 'black', name: 'Đen', hex: '#000000' }],
    },
];