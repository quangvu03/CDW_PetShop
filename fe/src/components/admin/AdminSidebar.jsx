const AdminSidebar = () => {
  return (
    <div id="sidebar-wrapper" data-simplebar data-simplebar-auto-hide="true">
      <div className="brand-logo">
        <a href="/admin">
          <img src="/assets/admin/images/logo-icon.png" className="logo-icon" alt="logo icon" />
          <h5 className="logo-text">Admin PetShop Website</h5>
        </a>
      </div>
      <ul className="sidebar-menu do-nicescrol">
        <li className="sidebar-header">MENU ADMIN</li>

        <li><a href="/admin"><i className="zmdi zmdi-view-dashboard"></i> <span>Doanh Thu</span></a></li>
        <li><a href="/admin/users"><i className="zmdi zmdi-accounts"></i> <span>Quản lí người dùng</span></a></li>
        {/* <li><a href="/admin/categories"><i className="zmdi zmdi-grid"></i> <span>Chuyên Mục</span></a></li> */}
        <li><a href="/admin/products"><i className="zmdi zmdi-widgets"></i> <span>Danh Sách Sản Phẩm</span></a></li>
        <li><a href="/admin/orders"><i className="zmdi zmdi-shopping-cart"></i> <span>Quản lí Đơn hàng</span></a></li>

        {/* Các mục bổ sung */}
        <li><a href="/admin/reviews"><i className="zmdi zmdi-star"></i> <span>Quản lí Đánh giá</span></a></li>
        <li><a href="/admin/shipping-methods"><i className="zmdi zmdi-truck"></i> <span>Phương thức vận chuyển</span></a></li>
        <li><a href="/admin/vouchers"><i className="zmdi zmdi-card-giftcard"></i> <span>Quản lí Voucher</span></a></li>
        {/* <li><a href="/admin/browsing-history"><i className="zmdi zmdi-time"></i> <span>Lịch sử duyệt SP</span></a></li> */}
        {/* <li><a href="/admin/cart-items"><i className="zmdi zmdi-shopping-basket"></i> <span>Quản lí Giỏ hàng</span></a></li> */}
        <li><a href="/admin/chatbox"><i className="zmdi zmdi-comment-text-alt"></i> <span>Quản lí Chatbox</span></a></li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
