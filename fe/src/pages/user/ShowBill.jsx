import React, { useEffect } from 'react';

export default function ShowBill() {
  useEffect(() => {
    window.print();
  }, []);

  return (
    <div id="page" className="page" style={styles.page}>
      <div style={styles.header}>
        <div style={styles.logo}><img src="/assets/images/logopetshop.jpg" alt="Logo PetShop" style={{ width: 60, height: 60 }} /></div>
        <div style={styles.company}>C.Ty TNHH PetShop</div>
      </div>

      <div style={styles.title}>
        HÓA ĐƠN THANH TOÁN
        <br />
        -------oOo-------
      </div>

      <table style={styles.table} className="TableData">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên khách hàng</th>
            <th>Địa chỉ</th>
            <th>Tổng tiền</th>
            <th>Phương thức thanh toán</th>
            <th>Trạng thái thanh toán</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Nguyễn Văn A</td>
            <td>123 Đường ABC, Quận 1, TP.HCM</td>
            <td>1 triệu đồng</td>
            <td>Thanh toán bằng VNPay</td>
            <td>Đã xác nhận</td>
          </tr>
        </tbody>
      </table>

      <div style={styles.footerLeft}>
        Tp.HCM, ngày 16 tháng 12 năm 2014<br />
        Khách hàng
      </div>
      <div style={styles.footerRight}>
        Tp.HCM, ngày 16 tháng 12 năm 2014<br />
        Nhân viên
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: '21cm',
    minHeight: '29.7cm',
    padding: '2.5cm',
    margin: 'auto',
    background: 'white',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Poppins, Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    flex: 1,
  },
  company: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    textTransform: 'uppercase'
  },
  title: {
    textAlign: 'center',
    color: '#0000FF',
    fontSize: 24,
    margin: '20px 0'
  },
  footerLeft: {
    float: 'left',
    textAlign: 'center',
    width: '50%',
    marginTop: 50,
    fontSize: 12,
    textTransform: 'uppercase'
  },
  footerRight: {
    float: 'right',
    textAlign: 'center',
    width: '50%',
    marginTop: 50,
    fontSize: 12,
    textTransform: 'uppercase'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 12,
    marginTop: 30
  }
};
