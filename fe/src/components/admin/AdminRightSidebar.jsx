const AdminRightSidebar = () => {
  return (
    <div className="right-sidebar">
      <div className="switcher-icon">
        <i className="zmdi zmdi-settings zmdi-hc-spin"></i>
      </div>
      <div className="right-sidebar-content">
        <p className="mb-1">Màu nền admin</p>
        <hr />
        <ul className="switcher">
          {[...Array(6)].map((_, i) => <li id={`theme${i + 1}`} key={i}></li>)}
        </ul>
        <p className="mb-1">Màu nền gradient</p>
        <hr />
        <ul className="switcher">
          {[...Array(9)].map((_, i) => <li id={`theme${i + 7}`} key={i}></li>)}
        </ul>
      </div>
    </div>
  );
};

export default AdminRightSidebar;
