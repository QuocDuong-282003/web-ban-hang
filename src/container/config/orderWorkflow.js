
// Cấu hình  hiển thị cho mỗi trạng thái
export const WORKFLOW_CONFIG = {
    // Trạng thái hiện tại: 'pending' (Chờ xử lý)
    pending: [
        {
            label: 'Xác nhận',
            nextStatus: 'processing',
            className: 'action-btn--confirm',
            confirmMessage: 'Bạn có chắc muốn xác nhận đơn hàng này không?'
        },
        {
            label: 'Hủy đơn',
            nextStatus: 'cancelled',
            className: 'action-btn--cancel', // Cần thêm class này vào file SCSS
            confirmMessage: 'Bạn có chắc muốn hủy đơn hàng này? Hành động này sẽ hoàn trả hàng về kho.'
        }
    ],
    // Trạng thái hiện tại: 'processing' (Đang xử lý)
    processing: [
        {
            label: 'Giao hàng',
            nextStatus: 'shipped',
            className: 'action-btn--ship',
            confirmMessage: 'Xác nhận bắt đầu giao đơn hàng này?'
        }
    ],
    // Trạng thái hiện tại: 'shipped' (Đang giao)
    shipped: [
        {
            label: 'Đã giao',
            nextStatus: 'delivered',
            className: 'action-btn--deliver',
            confirmMessage: 'Xác nhận đơn hàng đã được giao thành công?'
        }
    ],


    // Khi trạng thái là một trong những cái này, mảng rỗng sẽ khiến không có nút nào được hiển thị.
    // Đây chính là câu trả lời cho câu hỏi "làm sao biết đơn nào đã hoàn thành/hủy".
    delivered: [],
    cancelled: [],
    refunded: []
};

// Cấu hình để render tag trạng thái 
export const STATUS_TAG_CONFIG = {
    pending: { text: 'Chờ xử lý', color: '#faad14' },
    processing: { text: 'Đang xử lý', color: '#1890ff' },
    shipped: { text: 'Đang giao', color: '#13c2c2' },
    delivered: { text: 'Đã giao', color: '#52c41a' },
    cancelled: { text: 'Đã hủy', color: '#f5222d' },
    refunded: { text: 'Đã hoàn tiền', color: '#8c8c8c' },
    default: { text: 'Không rõ', color: '#888' }
};