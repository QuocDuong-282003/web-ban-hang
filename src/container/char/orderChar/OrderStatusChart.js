
import React, { useState, useEffect, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
//import './OrderStatusChart.css';
import { getOrderStatusStats } from '../../services/dashboardService';


ChartJS.register(ArcElement, Tooltip, Legend, Title);

const OrderStatusChart = () => {
    // --- STATE MANAGEMENT ---
    const [apiData, setApiData] = useState(null);       // Dữ liệu gốc từ API
    const [selection, setSelection] = useState({});     // Trạng thái các checkbox
    const [isLoading, setIsLoading] = useState(true);   // Trạng thái tải dữ liệu

    // -- DATA FETCHING EFFECT ---
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await getOrderStatusStats();
                const dataFromApi = response.data;

                setApiData(dataFromApi);

                // Khởi tạo trạng thái cho các checkbox,
                const initialSelection = {};
                if (dataFromApi?.labels) {
                    dataFromApi.labels.forEach(label => {
                        initialSelection[label] = true;
                    });
                }
                setSelection(initialSelection);

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu trạng thái đơn hàng:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // --- . MEMOIZED DATA PROCESSING ---

    const chartData = useMemo(() => {
        if (!apiData?.labels) {
            return null;
        }

        const filteredLabels = [];
        const filteredDataPoints = [];
        const filteredColors = [];

        apiData.labels.forEach((label, index) => {
            if (selection[label]) { // Chỉ thêm vào nếu được chọn
                filteredLabels.push(label);
                filteredDataPoints.push(apiData.datasets?.[0]?.data?.[index] || 0);
                filteredColors.push(apiData.datasets?.[0]?.backgroundColor?.[index] || '#cccccc');
            }
        });

        return {
            labels: filteredLabels,
            datasets: [{
                ...apiData.datasets[0],
                data: filteredDataPoints,
                backgroundColor: filteredColors,
                borderColor: filteredColors.map(color => color.replace('0.8', '1')),
                borderWidth: 1,
            }]
        };
    }, [apiData, selection]);

    // ---  EVENT HANDLER ---
    const handleSelectionChange = (event) => {
        const { name, checked } = event.target;
        setSelection(prevSelection => ({
            ...prevSelection,
            [name]: checked,
        }));
    };

    // ---  CHART OPTIONS ---
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' },
            title: {
                display: true,
                text: 'Tình hình Trạng thái Đơn hàng',
                font: { size: 16 },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw;
                        const total = context.chart.getDatasetMeta(0).total;
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(2) + '%' : '0.00%';
                        return `${label}: ${value} (${percentage})`;
                    }
                }
            }
        },
    };

    // ---  RENDER LOGIC ---
    if (isLoading) {
        return <p>Đang tải dữ liệu biểu đồ...</p>;
    }

    return (
        <div className="order-status-chart">
            {/* Phần biểu đồ */}
            <div className="order-status-chart__chart-wrapper">
                {(!chartData || chartData.labels.length === 0) ? (
                    <div className="order-status-chart__no-data-message">
                        <p>Không có dữ liệu để hiển thị. <br /> Vui lòng chọn ít nhất một trạng thái.</p>
                    </div>
                ) : (
                    <Doughnut data={chartData} options={options} />
                )}
            </div>

            {/* Phần bộ lọc (checkboxes) */}
            <div className="order-status-chart__filter-controls">
                <h4 className="order-status-chart__filter-title">Hiển thị trạng thái</h4>
                {Object.keys(selection).map(statusName => (
                    <div key={statusName} className="order-status-chart__checkbox-wrapper">
                        <input
                            type="checkbox"
                            id={`filter-${statusName}`}
                            name={statusName}
                            checked={!!selection[statusName]}
                            onChange={handleSelectionChange}
                        />
                        <label htmlFor={`filter-${statusName}`} className="order-status-chart__checkbox-label">
                            {statusName}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderStatusChart;