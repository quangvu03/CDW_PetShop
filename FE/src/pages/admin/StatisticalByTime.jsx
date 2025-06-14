import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
    Chart,
    BarController,
    BarElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
} from 'chart.js';
import { getCompletedOrdersByDateRange } from '../../services/AdminOrderManagerService';
import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';

Chart.register(BarController, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

// Định nghĩa danh sách thống kê với key duy nhất
const statsItems = [
    { id: 'orders', icon: 'shopping-cart', text: 'Đơn hàng', getValue: (stats) => stats.orderCount },
    {
        id: 'revenue',
        icon: '',
        text: 'Tổng doanh thu',
        getValue: (stats) => `${(stats.totalRevenue / 1000000).toFixed(1)} triệu đồng`,
    },
    { id: 'products', icon: 'envira', text: 'Sản phẩm bán', getValue: () => '8' },
];

const StatisticalByTime = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{ data: [], backgroundColor: [] }],
    });
    const [stats, setStats] = useState({
        orderCount: 0,
        totalRevenue: 0,
    });
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date(),
    });
    const [filteredOrders, setFilteredOrders] = useState([]);
    const chartRef = useRef(null);
    const [activeTab, setActiveTab] = useState('goodsBar');
    const [error, setError] = useState(null);

    // Khởi tạo jQuery UI Datepicker và xử lý thay đổi ngày
    useEffect(() => {
        const startInput = $('#startDate');
        const endInput = $('#endDate');

        startInput.datepicker({
            dateFormat: 'dd-mm-yy',
            onSelect: (dateText) => {
                console.log('Ngày bắt đầu được chọn:', dateText);
                const [day, month, year] = dateText.split('-');
                const newStart = new Date(`${year}-${month}-${day}`);
                if (!isNaN(newStart)) {
                    setDateRange((prev) => ({ ...prev, startDate: newStart }));
                } else {
                    setError('Ngày bắt đầu không hợp lệ.');
                }
            },
        });

        endInput.datepicker({
            dateFormat: 'dd-mm-yy',
            onSelect: (dateText) => {
                console.log('Ngày kết thúc được chọn:', dateText);
                const [day, month, year] = dateText.split('-');
                const newEnd = new Date(`${year}-${month}-${day}`);
                if (!isNaN(newEnd)) {
                    setDateRange((prev) => ({ ...prev, endDate: newEnd }));
                } else {
                    setError('Ngày kết thúc không hợp lệ.');
                }
            },
        });

        // Đặt giá trị ban đầu cho input
        startInput.datepicker('setDate', dateRange.startDate);
        endInput.datepicker('setDate', dateRange.endDate);

        return () => {
            startInput.datepicker('destroy');
            endInput.datepicker('destroy');
        };
    }, [dateRange.startDate, dateRange.endDate]);

    const fetchData = async (startDate, endDate) => {
        try {
            console.log('Gọi fetchData với:', { startDate, endDate });
            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];
            console.log('Gửi API với:', { startDateStr, endDateStr });

            const response = await getCompletedOrdersByDateRange(startDateStr, endDateStr);
            console.log('Dữ liệu API trả về:', response.data);

            const orders = response.data || [];

            const orderCount = orders.length;
            let totalRevenue = 0;
            orders.forEach((order) => {
                totalRevenue += order.totalPrice || 0;
            });

            const revenueByDate = {};
            orders.forEach((order) => {
                const date = new Date(order.orderDate).toISOString().split('T')[0];
                revenueByDate[date] = (revenueByDate[date] || 0) + (order.totalPrice || 0);
            });

            const labels = [];
            const data = [];
            const backgroundColors = [];
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                labels.push(dateStr);
                data.push(revenueByDate[dateStr] || 0);
                backgroundColors.push('#007bff');
            }

            const newChartData = {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: backgroundColors,
                        borderWidth: 1,
                    },
                ],
            };
            console.log('Cập nhật chartData:', newChartData);
            setChartData(newChartData);

            console.log('Cập nhật stats:', { orderCount, totalRevenue });
            setStats({
                orderCount,
                totalRevenue,
            });
            setFilteredOrders(orders);
            setError(null);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu đơn hàng hoàn thành:', error);
            setError('Không thể tải dữ liệu. Vui lòng thử lại.');
        }
    };

    // Tải dữ liệu ban đầu khi vào trang
    useEffect(() => {
        console.log('Tải dữ liệu ban đầu với dateRange:', dateRange);
        fetchData(dateRange.startDate, dateRange.endDate);
    }, []); // Chỉ chạy một lần khi mount

    // Cập nhật biểu đồ khi chartData hoặc activeTab thay đổi
    useEffect(() => {
        const ctx = document.getElementById('barChart')?.getContext('2d');
        if (ctx && chartData.labels.length > 0 && activeTab === 'goodsBar') {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
            chartRef.current = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                            labels: {
                                color: '#ffffff',
                            },
                        },
                        tooltip: {
                            displayColors: false,
                            bodyColor: '#ffffff',
                            titleColor: '#ffffff',
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#ffffff',
                            },
                            title: {
                                display: true,
                                text: 'Doanh thu (VNĐ)',
                                color: '#ffffff',
                            },
                        },
                        x: {
                            ticks: {
                                color: '#ffffff',
                                maxRotation: 45,
                                minRotation: 45,
                            },
                            title: {
                                display: true,
                                text: 'Ngày',
                                color: '#ffffff',
                            },
                        },
                    },
                },
            });
        }
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [chartData, activeTab]);

    // Xử lý khi nhấn nút Lọc
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        console.log('Nhấn nút Lọc với dateRange:', dateRange);
        if (dateRange.startDate > dateRange.endDate) {
            toast.error('Ngày bắt đầu không thể lớn hơn ngày kết thúc.');
            return;
        }
        fetchData(dateRange.startDate, dateRange.endDate);
    };

    // Xử lý khi nhấn vào đơn hàng
    const handleOrderClick = (orderId) => {
        window.location.href = `/admin/orders/${orderId}`;
    };

    return (
        <div className="content-wrapper">
            <div className="container-fluid">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <div className="row mt-3">
                    <div
                        className="col-lg-12"
                        style={{ padding: '0 15px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}
                    >
                        <Link
                            to="/admin/dashboard"
                            style={{
                                padding: '5px 15px',
                                marginRight: '10px',
                                backgroundColor: activeTab === 'back' ? '#007bff' : '#fff',
                                color: activeTab === 'back' ? '#fff' : '#000',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                textDecoration: 'none',
                                cursor: 'pointer',
                            }}
                            onClick={() => setActiveTab('back')}
                        >
                            Thống kê theo danh mục hàng hóa
                        </Link>
                        <button
                            onClick={() => setActiveTab('goodsBar')}
                            style={{
                                padding: '5px 15px',
                                marginRight: '10px',
                                backgroundColor: activeTab === 'goodsBar' ? '#007bff' : '#fff',
                                color: activeTab === 'goodsBar' ? '#fff' : '#000',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Thống kê theo thời gian
                        </button>
                    </div>
                </div>

                <form id="filterForm" onSubmit={handleFilterSubmit}>
                    <div className="row">
                        <div className="col-lg-3">
                            <label htmlFor="startDate">Từ ngày:</label>
                            <input type="text" id="startDate" name="startDate" className="form-control" />
                        </div>
                        <div className="col-lg-3">
                            <label htmlFor="endDate">Đến ngày:</label>
                            <input type="text" id="endDate" name="endDate" className="form-control" />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">Lọc</button>
                </form>

                <div className="card mt-4">
                    <div className="card-content">
                        <div className="row row-group m-0">
                            {statsItems.map((item) => (
                                <div
                                    className="col-12 col-lg-6 col-xl-3 border-light"
                                    key={item.id}
                                    style={{
                                        borderRight: statsItems.indexOf(item) % 2 === 0 && statsItems.indexOf(item) < 2 ? '1px solid #ddd' : 'none',
                                        padding: '10px',
                                    }}
                                >
                                    <div className="card-body">
                                        <h5 className="text-white mb-0">
                                            {item.getValue(stats)}
                                            <span className="float-right">
                                                <i
                                                    className={`fa fa-${item.icon}`}
                                                    style={{ visibility: item.icon ? 'visible' : 'hidden' }}
                                                ></i>
                                            </span>
                                        </h5>
                                        <div
                                            className="progress my-3"
                                            style={{ height: '3px', backgroundColor: '#ddd' }}
                                        >
                                            <div
                                                className="progress-bar"
                                                style={{ width: '100%', backgroundColor: '#007bff' }}
                                            ></div>
                                        </div>
                                        <p className="mb-0 text-white small-font">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-12 col-lg-12 col-xl-12">
                        <div className="card">
                            <div className="card-header">
                                Doanh thu theo ngày (
                                {dateRange.startDate.toLocaleDateString()} -{' '}
                                {dateRange.endDate.toLocaleDateString()})
                            </div>
                            <div className="card-body">
                                {activeTab === 'goodsBar' && (
                                    <div
                                        className="chart-container-2"
                                        style={{
                                            height: '400px',
                                            width: '100%',
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <canvas
                                            id="barChart"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                width: '100% !important',
                                                height: '100% !important',
                                            }}
                                        ></canvas>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-12 col-xl-12">
                        <div className="card">
                            <div className="card-header">Chi tiết đơn hàng</div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    {activeTab === 'goodsBar' && (
                                        <table className="table align-items-center">
                                            <thead>
                                                <tr>
                                                    <th>Mã đơn hàng</th>
                                                    <th>Ngày</th>
                                                    <th>Tổng tiền (VNĐ)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredOrders.map((order) => (
                                                    <tr key={order.id}>
                                                        <td>
                                                            <a
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleOrderClick(order.id);
                                                                }}
                                                                style={{
                                                                    color: '#007bff',
                                                                    textDecoration: 'underline',
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                {order.id}
                                                            </a>
                                                        </td>
                                                        <td>
                                                            {new Date(order.orderDate)
                                                                .toISOString()
                                                                .split('T')[0]}
                                                        </td>
                                                        <td>{order.totalPrice.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticalByTime;