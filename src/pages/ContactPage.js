import React, { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';
import { toast } from 'react-toastify';
import { createContact } from '../container/services/userService';
import './ContactPage.scss'; // Import SCSS tách riêng

function ContactPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const [contactData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        content: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...contactData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tempErrors = {};
        if (!contactData.name.trim()) tempErrors.name = "Vui lòng nhập tên đầy đủ";
        if (!contactData.email.trim()) tempErrors.email = "Vui lòng nhập email";
        else if (!/\S+@\S+\.\S+/.test(contactData.email)) tempErrors.email = "Email không hợp lệ";
        if (!contactData.phone.trim()) tempErrors.phone = "Vui lòng nhập số điện thoại";
        if (!contactData.content.trim()) tempErrors.content = "Vui lòng nhập nội dung";

        setErrors(tempErrors);

        if (Object.keys(tempErrors).length === 0) {
            setIsLoading(true);
            setStatusMessage({ type: '', text: '' });
            try {
                await createContact(contactData);
                toast.success('Gửi thành công. Chúng tôi sẽ sớm phản hồi lại cho bạn!');
                setFormData({ name: '', phone: '', email: '', content: '' });
                setErrors({});
            } catch (error) {
                const errorText = error.response?.data?.message || 'Có lỗi xảy ra! Vui lòng thử lại!';
                setStatusMessage({ type: 'error', text: errorText });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="content contact-page">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-12 pt-4">
                            <div className="info-shop">
                                <h3 className="title-heading">Thông tin liên hệ</h3>
                                <ul className="contact-info">
                                    <li>P&T SHOP xin hân hạnh phục vụ quý khách với những bộ quần áo phụ kiện rất nhiều khách hàng tại Việt Nam ưa thích và chọn lựa.</li>
                                    <li className="footer__item">
                                        <p><i className="fas fa-search-location footer__item-icon"></i> Ho Chi Minh, Viet Nam</p>
                                    </li>
                                    <li className="footer__item">
                                        <p><i className="fas fa-phone-square-alt footer__item-icon"></i> Phone:
                                            <a href="tel:0889251448">0889251448</a></p>
                                    </li>
                                    <li className="footer__item">
                                        <p><i className="fas fa-envelope-square footer__item-icon"></i>
                                            Email:
                                            <a href="mailto:baoduong2972003@gmail.com">baoduong2972003@gmail.com</a></p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-8 col-12">
                            <div className="page-login">
                                <h3 className="title-heading">Gửi thông tin</h3>
                                <span className="text-contact">
                                    Bạn hãy điền nội dung tin nhắn vào form dưới đây và gửi cho chúng tôi. Chúng tôi sẽ trả lời bạn sau khi nhận được.
                                </span>

                                <form onSubmit={handleSubmit} className="form" id="form-contact">
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Tên đầy đủ</label>
                                        <input id="name" name="name" type="text" className="form-control" value={contactData.name} onChange={handleChange} />
                                        {errors.name && <span className="form-message">{errors.name}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input id="email" name="email" type="text" placeholder="VD: email@domain.com" className="form-control" value={contactData.email} onChange={handleChange} />
                                        {errors.email && <span className="form-message">{errors.email}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone" className="form-label">Điện thoại</label>
                                        <input id="phone" name="phone" type="tel" placeholder="0912*******" className="form-control" value={contactData.phone} onChange={handleChange} />
                                        {errors.phone && <span className="form-message">{errors.phone}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="content" className="form-label">Nội dung</label>
                                        <textarea name="content" id="noidung" cols="30" rows="10" className="form-control" value={contactData.content} onChange={handleChange}></textarea>
                                        {errors.content && <span className="form-message">{errors.content}</span>}
                                    </div>

                                    {statusMessage.text && (
                                        <div className={`form-message ${statusMessage.type === 'success' ? 'success-message' : 'error-message'}`}>
                                            {statusMessage.text}
                                        </div>
                                    )}

                                    <button type="submit" className="form-submit btn-blocker" disabled={isLoading}>
                                        {isLoading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                                        <i className="fas fa-arrow-right"></i>
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="col-12">
                            <h3 className="map-title">Bản đồ cửa hàng</h3>
                            <div className="mapbox">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.954111076736!2d106.7086283147493!3d10.81482379229551!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175289741790d39%3A0x95362685e34cec2f!2zQuG6v24gWGUgTWnhu4FuIMSQw7RuZyDEkGluaCBC4buZIEzEqW5o!5e0!3m2!1svi!2s!4v1637980933100!5m2!1svi!2s"
                                    width="100%"
                                    height="100%"
                                    allowFullScreen
                                    loading="lazy"
                                    title="Store Map"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <GoToTop />
        </div>
    );
}

export default ContactPage;
