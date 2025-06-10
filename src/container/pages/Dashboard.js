import React from 'react';
import DailyChart from '../char/DailyChart';
import MonthlyChart from '../char/MonthlyChart';
import LoginPieChart from '../char/LoginPieChart';
import LoginBarChart from '../char/LoginBarChart';
const Dashboard = () => {
    return (
        <div className='container'>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Thống kê đơn hàng theo ngày</h5>
                        </div>
                        <div className="card-body">
                            <DailyChart />
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Thống kê đơn hàng theo tháng</h5>
                        </div>
                        <div className="card-body">
                            <MonthlyChart />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Thống kê truy cập</h5>
                        </div>
                        <div className="card-body">
                            <LoginPieChart />

                        </div>
                    </div>
                </div>


                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Thống kê truy cập</h5>
                        </div>
                        <div className="card-body">
                            <LoginBarChart />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
