
export const formatCurrency = (number) => {

    if (typeof number !== 'number' || isNaN(number)) {
        return '0 ₫'; // Trả về giá trị mặc định an toàn
    }

    // Sử dụng Intl.NumberFormat để định dạng
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(number);
};

export const formatDate = (dateString) => {
    try {
        if (!dateString) return '';
        return new Intl.DateTimeFormat('vi-VN').format(new Date(dateString));
    } catch (error) {
        return 'Ngày không hợp lệ';
    }
};