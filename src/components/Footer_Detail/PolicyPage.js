import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { policyData } from './policyData';

import Header from '../common/Header';
import Footer from '../common/Footer';
import './PolicyPage.scss';

function PolicyPage() {
    const { slug } = useParams();
    const policy = policyData[slug];

    if (!policy) {
        return (
            <div>
                <Header />
                <div className="container text-center py-5">
                    <h2 className="display-4">404</h2>
                    <p className="lead">Trang chính sách bạn đang tìm kiếm không tồn tại.</p>
                    <Link to="/" className="btn btn-primary mt-3">Quay về trang chủ</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <main className="policy-page-background">
                <div className="container py-4">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-md-12">

                            {/* Phần JSX này đã đúng, vấn đề nằm ở CSS */}
                            <nav aria-label="breadcrumb" className="policy-breadcrumb mb-4">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">
                                            <i className="fas fa-home"></i>
                                            <span>Trang chủ</span>
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        {policy.title}
                                    </li>
                                </ol>
                            </nav>

                            <div className="policy-content-wrapper">
                                <h1 className="policy-title mb-4">
                                    {policy.title}
                                </h1>
                                <div className="policy-content">
                                    {policy.content}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default PolicyPage;