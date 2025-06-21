
import React from 'react';
import { Link } from 'react-router-dom';

function RegisterPrompt() {
    return (
        <div>
            <h3 className="heading">TẠO MỘT TÀI KHOẢN</h3>
            <p className="text-login">
                Thật dễ dàng tạo một tài khoản. Hãy nhập địa chỉ email của bạn
                và điền vào mẫu trên trang tiếp theo và tận hưởng những lợi ích
                của việc sở hữu một tài khoản :
            </p>
            <ul>
                <li className="text-login-item">
                    <i className="fas fa-check"></i>{' '}
                    <p className="text-login">Tổng quan đơn giản về thông tin cá nhân của bạn</p>
                </li>
                <li className="text-login-item">
                    <i className="fas fa-check"></i>{' '}
                    <p className="text-login">Thanh toán nhanh hơn</p>
                </li>
                <li className="text-login-item">
                    <i className="fas fa-check"></i>{' '}
                    <p className="text-login">Ưu đãi và khuyến mãi độc quyền</p>
                </li>
                <li className="text-login-item">
                    <i className="fas fa-check"></i>{' '}
                    <p className="text-login">Các sản phẩm mới nhất</p>
                </li>
                <li className="text-login-item">
                    <i className="fas fa-check"></i>{' '}
                    <p className="text-login">Các bộ sưu tập giới hạn và bộ sưu tập theo mùa mới</p>
                </li>
                <li className="text-login-item">
                    <i className="fas fa-check"></i>{' '}
                    <p className="text-login">Các sự kiện sắp tới</p>
                </li>
            </ul>

            <Link to="/register">
                <button className="form-submit btn-blocker custom-btn" style={{ borderRadius: 'unset', margin: 'unset' }}>
                    ĐĂNG KÍ <i className="fas fa-arrow-right" style={{ fontSize: '16px', marginLeft: '10px' }}></i>
                </button>
            </Link>
        </div>
    );
}

export default RegisterPrompt;