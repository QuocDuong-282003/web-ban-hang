
export const formatCurrency = (number) => {

    if (typeof number !== 'number' || isNaN(number)) {
        return '0 VND'; // Trả về giá trị mặc định an toàn
    }

    // Format số với dấu chấm phân cách hàng nghìn
    const formatted = new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);

    return formatted + ' VND';
};

export const formatDate = (dateString) => {
    try {
        if (!dateString) return '';
        return new Intl.DateTimeFormat('vi-VN').format(new Date(dateString));
    } catch (error) {
        return 'Ngày không hợp lệ';
    }
};