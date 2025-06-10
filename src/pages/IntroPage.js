import React, { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';
// import './IntroPage.css';

function IntroPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={isMobileMenuOpen ? toggleMobileMenu : null}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="content" style={{ marginTop: '30px' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12">
                            <div className="page-title">
                                <h1 className="title-head">Giới thiệu</h1>
                            </div>
                            <div className="content-page">
                                <h2><strong>I/ Tầm nhìn</strong></h2>
                                <p>
                                    Tại P&T SHOP, chúng tôi luôn hướng đến việc cải tiến chất lượng
                                    trải nghiệm của khách hàng thông qua việc đa dạng hóa các loại sản phẩm,
                                    đầu tư nghiên cứu để đưa ra những tư vấn phù hợp với từng khách hàng một.
                                    Và với định hướng trở thành một trong những cửa hàng cung cấp các sản
                                    phẩm giày đá bóng chính hãng tốt nhất Việt Nam,
                                    P&T SHOP luôn hướng đến những giá trị cốt lõi cho khách hàng bao gồm:
                                </p>
                                <h3><strong>1. Trải nghiệm hoàn hảo</strong></h3>
                                <p>Thông qua việc tư vấn, hỗ trợ khách hàng tận tâm và nhanh nhất có thể.</p>
                                <h3><strong>2. Sản phẩm chính hãng</strong></h3>
                                <p>
                                    Sản phẩm được P&T SHOP mua trực tiếp từ công ty và các trang web
                                    uy tín của Nike, adidas,
                                    Puma v.v… nên các bạn có thể yên tâm về nguồn gốc sản phẩm.
                                </p>
                                <h3><strong>3. Chế độ dịch vụ</strong></h3>
                                <p>
                                    Những sản phẩm giày đá banh tại P&T SHOP được bảo hành 3 tháng,
                                    hỗ trợ trả góp 0% lãi suất qua Fundiin, Freeship toàn quốc
                                    khi khách hàng thanh toán chuyển khoản trước, tặng vớ & balo khi mua giày.
                                </p>
                                <h2><strong>II/ Sứ mệnh</strong></h2>
                                <p>
                                    Đặt khách hàng làm trung tâm. Đáp ứng hiệu quả nhất mọi nhu cầu vì lợi ích khách hàng và chất lượng dịch vụ.
                                    Đặt nhân sự là yếu tố quyết định và là nền tảng của sự phát triển. Không ngừng đào tạo và xây dựng đội ngũ kế thừa.
                                    Chia sẽ các quyền lợi với các thành viên trong công ty, cùng xây dựng và phát triển vì mục tiêu chung của công ty.
                                </p>
                                <h2><strong>III/ Cửa hàng của P&T SHOP</strong></h2>
                                <p>
                                    <b>P&T SHOP Store I: 86 Đinh Bộ Lĩnh, P. 26 Q. Bình Thạnh, TP. HCM | ĐT: 0123456789</b>
                                    <br />
                                    <b>P&T SHOP Store II: 26 Đinh Bộ Lĩnh, P. 26 Q. Bình Thạnh, TP. HCM | ĐT: 0123456789</b>
                                    <br />
                                    Hoạt động từ 9h tới 21h hàng ngày và cả 7 ngày trong tuần. Rất vui được đón tiếp các bạn.
                                    <br />
                                    Xin cảm ơn các bạn đã tin tưởng và ủng hộ P&T SHOP.
                                </p>
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

export default IntroPage;