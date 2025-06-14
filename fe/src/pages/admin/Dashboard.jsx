import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { getCompletedOrders } from '../../services/AdminOrderManagerService';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  });
  const [stats, setStats] = useState({
    orderCount: 0,
    totalRevenue: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Mặc định tháng hiện tại (0-based + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Mặc định năm hiện tại
  const [filteredOrders, setFilteredOrders] = useState([]); // Lưu danh sách đơn hàng đã lọc
  const chartRef = useRef(null); // Thêm ref để lưu instance của Chart

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCompletedOrders();
        const orders = response.data;

        // Lọc đơn hàng theo tháng và năm được chọn
        const filteredOrders = orders.filter(order =>
          new Date(order.orderDate).getMonth() === selectedMonth - 1 && // Tháng (0-based index)
          new Date(order.orderDate).getFullYear() === selectedYear
        );

        // Cập nhật số lượng đơn hàng
        const orderCount = filteredOrders.length;

        // Tính tổng doanh thu
        let totalRevenue = 0;
        filteredOrders.forEach(order => {
          order.petDtoList.forEach(pet => {
            totalRevenue += pet.price * pet.quantity;
          });
        });

        // Tính tổng doanh thu theo danh mục (species)
        const revenueBySpecies = {};
        filteredOrders.forEach(order => {
          order.petDtoList.forEach(pet => {
            const species = pet.species;
            const revenue = pet.price * pet.quantity;
            revenueBySpecies[species] = (revenueBySpecies[species] || 0) + revenue;
          });
        });

        // Chuẩn bị dữ liệu cho biểu đồ
        const labels = Object.keys(revenueBySpecies);
        const data = Object.values(revenueBySpecies);
        const backgroundColors = [
          '#ffffff',
          'rgba(255, 255, 255, 0.70)',
          'rgba(255, 255, 255, 0.50)',
          'rgba(255, 255, 255, 0.30)',
          'rgba(255, 255, 255, 0.10)',
        ].slice(0, labels.length);

        setChartData({
          labels,
          datasets: [{
            data,
            backgroundColor: backgroundColors,
            borderWidth: [0, 0, 0, 0, 0].slice(0, labels.length),
          }],
        });

        // Cập nhật stats và filteredOrders
        setStats({
          orderCount,
          totalRevenue,
        });
        setFilteredOrders(filteredOrders);
      } catch (error) {
        console.error('Error fetching completed orders:', error);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const ctx = document.getElementById("chart2")?.getContext("2d");
    if (ctx && chartData.labels.length > 0) {
      // Hủy biểu đồ cũ nếu đã tồn tại
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      // Tạo biểu đồ mới và lưu instance
      chartRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              displayColors: false,
            },
          },
        },
      });
    }
    // Hủy biểu đồ khi component unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]);

  // Tạo danh sách tháng và năm
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));
  const years = Array.from({ length: 5 }, (_, i) => 2025 - i); // 2025, 2024, 2023, 2022, 2021

  // Hàm xử lý chuyển hướng khi nhấn vào mã đơn hàng
  const handleOrderClick = (orderId) => {
    window.location.href = `/admin/orders/${orderId}`; // Chuyển hướng bằng window.location
  };

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-lg-12" style={{ padding: '0 15px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
            <button
              style={{
                padding: '5px 15px',
                marginRight: '10px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.3s, color 0.3s', // Hiệu ứng hover
                '&:hover': { backgroundColor: '#0056b3' }, // Hover khi active
              }}
            >
              Thống kê doanh thu theo danh mục hàng hóa
            </button>
            <Link
              to="/admin/statisticalbytime"
              style={{
                padding: '5px 15px',
                backgroundColor: '#fff',
                color: '#000',
                border: '1px solid #ccc',
                borderRadius: '4px',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              Thống kê theo thời gian
            </Link>
          </div>
        </div>

        <form id="filterForm" method="get">
          <div className="row mt-3">
            <div className="col-lg-3" style={{ padding: '0 15px' }}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                style={{ padding: '5px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'transparent' }}
              >
                {months.map(month => (
                  <option key={month.value} value={month.value} style={{ backgroundColor: 'transparent' }}>{month.label}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'transparent' }}
              >
                {years.map(year => (
                  <option key={year} value={year} style={{ backgroundColor: 'transparent' }}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </form>

        <div className="card mt-4">
          <div className="card-content">
            <div className="row row-group m-0">
              {[
                { icon: 'shopping-cart', text: 'Đơn hàng', value: stats.orderCount },
                { icon: '', text: 'Tổng doanh thu', value: `${(stats.totalRevenue / 1000000).toFixed(1)} triệu đồng` },
                { icon: 'envira', text: 'Sản phẩm bán', value: '8' },
              ].map((item, i) => (
                <div className="col-12 col-lg-6 col-xl-3 border-light" key={i} style={{ borderRight: i % 2 === 0 && i < 2 ? '1px solid #ddd' : 'none', padding: '10px' }}>
                  <div className="card-body">
                    <h5 className="text-white mb-0">
                      {item.value}
                      <span className="float-right">
                        <i className={`fa fa-${item.icon}`} style={{ visibility: item.icon ? 'visible' : 'hidden' }}></i>
                      </span>
                    </h5>
                    <div className="progress my-3" style={{ height: '3px', backgroundColor: '#ddd' }}>
                      <div className="progress-bar" style={{ width: '100%', backgroundColor: '#007bff' }}></div>
                    </div>
                    <p className="mb-0 text-white small-font">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12 col-lg-6 col-xl-6">
            <div className="card">
              <div className="card-header">Doanh thu theo danh mục hàng hóa ({months[selectedMonth - 1].label} {selectedYear})</div>
              <div className="card-body">
                <div className="chart-container-2" style={{ height: '400px', width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <canvas id="chart2" style={{ maxWidth: '100%', maxHeight: '100%', width: '100% !important', height: '100% !important' }}></canvas>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table align-items-center">
                  <thead>
                    <tr>
                      <th>Danh mục</th>
                      <th>Doanh thu (VNĐ)</th>
                      <th>Tỷ lệ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.labels.map((label, index) => {
                      const totalRevenue = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
                      const revenue = chartData.datasets[0].data[index];
                      const percentage = totalRevenue ? ((revenue / totalRevenue) * 100).toFixed(2) : 0;
                      return (
                        <tr key={index}>
                          <td><i className="fa fa-square" style={{ color: chartData.datasets[0].backgroundColor[index] }}></i> {label}</td>
                          <td>{revenue.toLocaleString()}</td>
                          <td>{percentage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6 col-xl-6">
            <div className="card">
              <div className="card-header">Chi tiết đơn hàng</div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table align-items-center">
                    <thead>
                      <tr>
                        <th>Mã đơn hàng</th>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Loại</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(order => (
                        order.petDtoList.map((pet, petIndex) => (
                          <tr key={`${order.orderId}-${petIndex}`}>
                            <td>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOrderClick(order.orderId);
                                }}
                                style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                              >
                                {order.orderId}
                              </a>
                            </td>
                            <td>{pet.name}</td>
                            <td>{pet.quantity}</td>
                            <td>{pet.species}</td>
                          </tr>
                        ))
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hàm xử lý chuyển hướng khi nhấn vào mã đơn hàng
const handleOrderClick = (orderId) => {
  window.location.href = `/admin/orders/${orderId}`; // Chuyển hướng bằng window.location
};

export default Dashboard;