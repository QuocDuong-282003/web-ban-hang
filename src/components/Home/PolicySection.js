import React from 'react';

function PolicySection() {
    const policies = [
        {
            img: "https://bizweb.dktcdn.net/100/344/983/themes/704702/assets/policy_images_1.png?1628514159582",
            alt: "Miễn phí vận chuyển",
            title: "Miễn phí vận chuyển",
            subtitle: "Cho các đơn hàng"
        },
        {
            img: "https://bizweb.dktcdn.net/100/344/983/themes/704702/assets/policy_images_2.png?1628514159582",
            alt: "Hỗ trợ 24/7",
            title: "Hỗ trợ 24/7",
            subtitle: "Liên hệ hỗ trợ 24h/ngày"
        },
        {
            img: "https://bizweb.dktcdn.net/100/344/983/themes/704702/assets/policy_images_3.png?1628514159582",
            alt: "Hoàn tiền 100%",
            title: "Hoàn tiền 100%",
            subtitle: "Nếu sản phẩm bị lỗi, hư hỏng"
        },
        {
            img: "https://bizweb.dktcdn.net/100/344/983/themes/704702/assets/policy_images_4.png?1628514159582",
            alt: "Thanh toán",
            title: "Thanh toán",
            subtitle: "Được bảo mật 100%"
        }
    ];

    return (
        <section className="awe-section-9">
            <div className="section_policy clearfix">
                <div className="col-12">
                    <div className="owl-policy-mobile"> {/* Thay thế Owl Carousel nếu cần */}
                        <div className="owl-stage-outer">
                            <div className="owl-stage" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                {policies.map((policy, index) => (
                                    <div className="owl-item" style={{ flex: '1 1 200px', margin: '10px', minWidth: '200px' }} key={index}>
                                        <div className="section_policy_content">
                                            <img src={policy.img} alt={policy.alt} />
                                            <div className="section-policy-padding">
                                                <h3>{policy.title}</h3>
                                                <div className="section_policy_title">{policy.subtitle}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PolicySection;