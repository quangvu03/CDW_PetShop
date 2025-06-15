const AdminHeader = () => {
    return (
      <header className="topbar-nav">
        <nav className="navbar navbar-expand fixed-top">
          <ul className="navbar-nav mr-auto align-items-center">
            <li className="nav-item">
              <a className="nav-link toggle-menu" href="#">
                <i className="icon-menu menu-icon"></i>
              </a>
            </li>
          </ul>
  
          <ul className="navbar-nav align-items-center right-nav-link">
            <li className="nav-item">
              <a className="nav-link dropdown-toggle dropdown-toggle-nocaret" data-toggle="dropdown" href="#">
                <span className="user-profile">
                  <img src="/assets/admin/images/avatar-admin.png" className="img-circle" alt="user avatar" />
                </span>
              </a>
              <ul className="dropdown-menu dropdown-menu-right">
                <li className="dropdown-item user-details">
                  <a href="#">
                    <div className="media">
                      <div className="avatar">
                        <img className="align-self-start mr-3" src="/assets/admin/images/avatar-admin.png" alt="user avatar" />
                      </div>
                      <div className="media-body">
                        <h6 className="mt-2 user-title">PetShop</h6>
                        <b>Admin:</b>
                      </div>
                    </div>
                  </a>
                </li>
                <li className="dropdown-divider"></li>
                <li className="dropdown-item">
                  <i className="icon-power mr-2"></i>
                  <a href="/auth/login">Đăng xuất</a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
    );
  };
  
  export default AdminHeader;
  