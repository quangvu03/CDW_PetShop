import{ useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import '../assets/admin/js/admin-imports.js';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminRightSidebar from '../components/admin/AdminRightSidebar';
import AdminLoader from '../components/admin/AdminLoader';

const AdminLayout = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const theme = 'bg-theme7';
    const allThemes = Array.from({ length: 15 }, (_, i) => `bg-theme${i + 1}`);
    document.body.classList.remove(...allThemes);
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);

    // ✅ Load CSS
    const cssFiles = [
      '/assets/admin/css/bootstrap.min.css',
      '/assets/admin/css/animate.css',
      '/assets/admin/css/icons.css',
      '/assets/admin/css/sidebar-menu.css',
      '/assets/admin/css/app-style.css',
      '/assets/admin/plugins/simplebar/css/simplebar.css',
      '/assets/admin/plugins/summernote/dist/summernote-bs4.css',
      '//code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css',
      '/assets/admin/resources/demos/style.css',
      '/assets/admin/css/custom.css'
    ];

    const cssPromises = cssFiles.map(href => {
      return new Promise(resolve => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        document.head.appendChild(link);
      });
    });

    // ✅ Load jQuery đầu tiên
    const loadScript = (src) =>
      new Promise(resolve => {
        const s = document.createElement('script');
        s.src = src;
        s.async = false;
        s.onload = resolve;
        document.body.appendChild(s);
      });

    const loadAll = async () => {
      await Promise.all(cssPromises);
      await loadScript('https://code.jquery.com/jquery-3.6.0.min.js');

      // ✅ Load các plugin phụ thuộc jQuery
      const jsFiles = [
        'https://code.jquery.com/ui/1.13.2/jquery-ui.js',
        '/assets/admin/js/popper.min.js',
        '/assets/admin/js/bootstrap.min.js',
        '/assets/admin/plugins/simplebar/js/simplebar.js',
        '/assets/admin/js/sidebar-menu.js',
        '/assets/admin/js/app-script.js',
        '/assets/admin/plugins/Chart.js/Chart.min.js',
        '/assets/admin/plugins/summernote/dist/summernote-bs4.min.js',
        '/assets/admin/js/index.js',
      ];

      for (const src of jsFiles) {
        await loadScript(src);
      }

      // ✅ Cho phép render giao diện sau khi load đủ
      setReady(true);
    };

    loadAll();

    return () => {
      document.body.classList.remove(theme);
    };
  }, []);

  if (!ready) return null; // chờ load xong mới render

  return (
    <div className="bg-theme bg-theme7">
      <AdminLoader />
      <div id="wrapper">
        <AdminSidebar />
        <AdminHeader />
        <div className="clearfix"></div>

        <main>
          <Outlet />
        </main>

        <a href="#" className="back-to-top">
          <i className="fa fa-angle-double-up" />
        </a>

        <AdminRightSidebar />
      </div>
    </div>
  );
};

export default AdminLayout;
