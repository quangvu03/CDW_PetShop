import { useEffect } from 'react';

import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import DateRangePicker from '../../components/common/DateRangePicker';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  useEffect(() => {
    const ctx = document.getElementById("chart2")?.getContext("2d");
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ["Chó", "Mèo", "Thú cưng khác"],
          datasets: [
            {
              backgroundColor: [
                "#ffffff",
                "rgba(255, 255, 255, 0.70)",
                "rgba(255, 255, 255, 0.50)"
              ],
              data: [1, 2, 3],
              borderWidth: [0, 0, 0]
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
              labels: {
                color: '#ddd',
                boxWidth: 15
              }
            },
            tooltip: {
              displayColors: false
            }
          }
        }
      });
    }
  }, []);

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <form id="filterForm" method="get">
          <DateRangePicker />
          <div className="row mt-3">
            <div className="col-lg-3">
              <button type="submit" className="btn btn-primary">Lọc</button>
              <button type="button" id="loadDefault" className="btn btn-secondary ml-2">Load</button>
            </div>
          </div>
        </form>

        <div className="card mt-4">
          <div className="card-content">
            <div className="row row-group m-0">
              {/* Cards thống kê */}
              {[
                { icon: 'shopping-cart', text: 'Đơn hàng', value: '3' },
                { icon: '', text: 'Tổng thu nhập', value: '2 triệu đồng' },
                { icon: 'user', text: 'Người dùng', value: '3' },
                { icon: 'envira', text: 'Bán ra', value: '2' },
              ].map((item, i) => (
                <div className="col-12 col-lg-6 col-xl-3 border-light" key={i}>
                  <div className="card-body">
                    <h5 className="text-white mb-0">
                      {item.value}
                      <span className="float-right">
                        <i className={`fa fa-${item.icon}`}></i>
                      </span>
                    </h5>
                    <div className="progress my-3" style={{ height: '3px' }}>
                      <div className="progress-bar" style={{ width: '100%' }}></div>
                    </div>
                    <p className="mb-0 text-white small-font">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12 col-lg-4 col-xl-4">
            <div className="card">
              <div className="card-header">Danh mục bán chạy</div>
              <div className="card-body">
                <div className="chart-container-2">
                  <canvas id="chart2"></canvas>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table align-items-center">
                  <tbody>
                    <tr><td><i className="fa fa-circle text-white mr-2"></i>Chó</td><td>2</td><td>20%</td></tr>
                    <tr><td><i className="fa fa-circle text-light-1 mr-2"></i>Mèo</td><td>3</td><td>30%</td></tr>
                    <tr><td><i className="fa fa-circle text-light-1 mr-2"></i>Thú cưng khác</td><td>5</td><td>50%</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
