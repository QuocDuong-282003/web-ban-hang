import React from 'react';

// Key của mỗi mục ('bao-hanh', 'doi-tra',...) phải khớp với slug trong URL của Footer
export const policyData = {
    // 1. Chính sách bảo hành
    'bao-hanh': {
        title: 'Chính Sách Bảo Hành',
        content: (
            <>
                <h2>1. Điều kiện bảo hành</h2>
                <p>Sản phẩm được bảo hành miễn phí nếu sản phẩm đó còn thời hạn bảo hành được tính kể từ ngày giao hàng, sản phẩm được bảo hành trong thời hạn bảo hành ghi trên sổ bảo hành, tem bảo hành và theo quy định của từng hãng sản xuất tất cả các sự cố về mặt kỹ thuật.</p>
                <p>Có phiếu bảo hành và tem bảo hành của công ty trên sản phẩm, đồng thời sản phẩm không thuộc các trường hợp từ chối bảo hành.</p>

                <h2>2. Những trường hợp không được bảo hành</h2>
                <ul>
                    <li>Sản phẩm đã hết thời hạn bảo hành hoặc mất Phiếu bảo hành.</li>
                    <li>Tem niêm phong bảo hành bị rách, vỡ, bị dán đè hoặc bị sửa đổi.</li>
                    <li>Sản phẩm bị hư hỏng do tác động cơ học làm rơi, vỡ, va đập, trầy xước, móp méo, ẩm ướt, hoen rỉ, chảy nước.</li>
                    <li>Sản phẩm có dấu hiệu hư hỏng do chuột bọ hoặc côn trùng xâm nhập.</li>
                    <li>Sử dụng sai điện áp quy định, hoặc do thiên tai, hỏa hoạn gây nên.</li>
                </ul>

                <h2>3. Liên hệ bảo hành</h2>
                <p>Khi có yêu cầu bảo hành, Quý khách vui lòng liên hệ trực tiếp với chúng tôi qua Hotline: <strong>0123.456.789</strong> hoặc Email: <strong>hotro@ptshop.com</strong> để được hỗ trợ.</p>
            </>
        )
    },

    // 2. Chính sách đổi trả
    'doi-tra': {
        title: 'Chính Sách Đổi Trả',
        content: (
            <>
                <h2>1. Thời gian áp dụng</h2>
                <p>Hỗ trợ đổi trả trong vòng <strong>07 ngày</strong> kể từ ngày Quý khách nhận được sản phẩm.</p>

                <h2>2. Điều kiện sản phẩm đổi trả</h2>
                <ul>
                    <li>Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng, còn nguyên tem, mác, hộp đựng và phụ kiện đi kèm (nếu có).</li>
                    <li>Sản phẩm bị lỗi kỹ thuật do nhà sản xuất.</li>
                    <li>Sản phẩm giao không đúng về mẫu mã, số lượng so với đơn hàng đã đặt.</li>
                    <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển của chúng tôi.</li>
                </ul>

                <h2>3. Quy trình đổi trả</h2>
                <p><strong>Bước 1:</strong> Liên hệ với bộ phận CSKH qua Hotline <strong>0123.456.789</strong> để thông báo về yêu cầu đổi, trả hàng.</p>
                <p><strong>Bước 2:</strong> Sau khi xác nhận yêu cầu, Quý khách vui lòng đóng gói sản phẩm và gửi về địa chỉ do nhân viên CSKH cung cấp.</p>
                <p><strong>Bước 3:</strong> Sau khi nhận được sản phẩm trả về, chúng tôi sẽ tiến hành kiểm tra và thông báo kết quả cho Quý khách trong vòng 3 ngày làm việc.</p>
            </>
        )
    },

    // 3. Chính sách thanh toán
    'thanh-toan': {
        title: 'Chính Sách Thanh Toán',
        content: (
            <>
                <p>Chúng tôi cung cấp các phương thức thanh toán linh hoạt để mang lại sự tiện lợi tối đa cho khách hàng:</p>

                <h2>1. Thanh toán tiền mặt khi nhận hàng (COD)</h2>
                <p>Quý khách có thể thanh toán bằng tiền mặt cho nhân viên giao hàng ngay sau khi nhận và kiểm tra sản phẩm. Phương thức này áp dụng trên toàn quốc.</p>

                <h2>2. Chuyển khoản qua ngân hàng</h2>
                <p>Quý khách có thể thanh toán trước bằng cách chuyển khoản vào tài khoản ngân hàng của chúng tôi. Sau khi nhận được thanh toán, chúng tôi sẽ tiến hành giao hàng.</p>
                <p>Nội dung chuyển khoản vui lòng ghi rõ: <strong>[Tên người đặt hàng] - [Số điện thoại] - [Mã đơn hàng]</strong></p>
                <p>Thông tin tài khoản:</p>
                <ul>
                    <li><strong>Ngân hàng:</strong> Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)</li>
                    <li><strong>Chủ tài khoản:</strong> CÔNG TY TNHH P&T SHOP</li>
                    <li><strong>Số tài khoản:</strong> 987654321012345</li>
                    <li><strong>Chi nhánh:</strong> TP. Hồ Chí Minh</li>
                </ul>
            </>
        )
    },

    // 4. Chính sách giao nhận hàng
    'giao-nhan-hang': {
        title: 'Chính Sách Giao Nhận Hàng',
        content: (
            <>
                <h2>1. Phí vận chuyển</h2>
                <ul>
                    <li><strong>Nội thành TP.HCM:</strong> 20.000 VNĐ. Miễn phí vận chuyển cho đơn hàng từ 500.000 VNĐ.</li>
                    <li><strong>Các tỉnh thành khác:</strong> 30.000 VNĐ. Miễn phí vận chuyển cho đơn hàng từ 1.000.000 VNĐ.</li>
                </ul>

                <h2>2. Thời gian giao hàng</h2>
                <ul>
                    <li><strong>Nội thành TP.HCM:</strong> 1-2 ngày làm việc.</li>
                    <li><strong>Các tỉnh thành khác:</strong> 3-5 ngày làm việc.</li>
                </ul>
                <p>Thời gian giao hàng không bao gồm Chủ Nhật và các ngày Lễ, Tết. Thời gian có thể thay đổi do các yếu tố khách quan như thời tiết, tình hình giao thông,...</p>

                <h2>3. Kiểm tra hàng khi nhận</h2>
                <p>Quý khách vui lòng kiểm tra kỹ sản phẩm (số lượng, mẫu mã, tình trạng) trước khi ký nhận hàng. Nếu có vấn đề, vui lòng từ chối nhận hàng và liên hệ ngay với chúng tôi qua hotline <strong>0123.456.789</strong>.</p>
            </>
        )
    },

    // 5. Chính sách bảo mật
    'bao-mat': {
        title: 'Chính Sách Bảo Mật',
        content: (
            <>
                <h2>1. Mục đích thu thập thông tin cá nhân</h2>
                <p>Chúng tôi thu thập thông tin khách hàng (Họ tên, Email, Số điện thoại, Địa chỉ) chủ yếu để phục vụ cho mục đích xử lý đơn hàng, giao hàng và chăm sóc khách hàng sau bán hàng.</p>

                <h2>2. Phạm vi sử dụng thông tin</h2>
                <p>Thông tin cá nhân của khách hàng được sử dụng trong các trường hợp sau:</p>
                <ul>
                    <li>Cung cấp dịch vụ, xử lý đơn hàng và các yêu cầu của khách hàng.</li>
                    <li>Gửi thông báo về các chương trình khuyến mãi, sản phẩm mới (nếu khách hàng đăng ký nhận tin).</li>
                    <li>Liên hệ và giải quyết các trường hợp đặc biệt.</li>
                </ul>

                <h2>3. Cam kết bảo mật thông tin</h2>
                <p>Chúng tôi cam kết không bán, chia sẻ hay trao đổi thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào khác, ngoại trừ các trường hợp liên quan đến yêu cầu của pháp luật.</p>
            </>
        )
    }
};