import React, { useEffect, useState, useRef } from 'react';
import UserHeader from '../components/user/UserHeader';
import UserFooter from '../components/user/UserFooter';
import Preloader from '../components/common/PreLoader';
import { Helmet } from 'react-helmet-async';

export default function UserLayout({ children }) {
  // Dùng useRef để lưu trữ các script đã thêm, không làm component re-render
  const addedScripts = useRef([]);
  // Chỉ state loading cho preloader
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    // Đánh dấu là đang thêm script
    let isMounted = true;
    setShowPreloader(true); // Bật preloader khi bắt đầu load script

    const scripts = [
      // jQuery thường cần load trước tiên và không nên defer nếu script khác phụ thuộc ngay
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js', defer: false },
      // Các script còn lại có thể defer
      { src: '/assets/user/js/jquery-ui.min.js', defer: true },
      { src: '/assets/user/js/popper.min.js', defer: true }, // Thường đi kèm Bootstrap
      { src: '/assets/user/js/bootstrap.min.js', defer: true }, // Phụ thuộc jQuery và Popper
      { src: '/assets/user/js/slicknav.min.js', defer: true }, // Phụ thuộc jQuery
      { src: '/assets/user/js/jquery.nice-select.min.js', defer: true }, // Phụ thuộc jQuery
      { src: '/assets/user/js/owl-carousel.js', defer: true }, // Phụ thuộc jQuery
      { src: '/assets/user/js/flex-slider.js', defer: true }, // Phụ thuộc jQuery
      { src: '/assets/user/js/magnific-popup.js', defer: true }, // Phụ thuộc jQuery
      { src: '/assets/user/js/scrollup.js', defer: true }, // Phụ thuộc jQuery
      { src: '/assets/user/js/finalcountdown.min.js', defer: true }, // Phụ thuộc jQuery
      // active.js nên chạy cuối cùng, sau khi các thư viện và DOM sẵn sàng (defer giúp phần nào)
      { src: '/assets/user/js/active.js', defer: true } // Phụ thuộc jQuery và các plugin khác
    ];

    const loadScript = (scriptConfig) => {
      return new Promise((resolve, reject) => {
        // Kiểm tra xem script đã tồn tại chưa (phòng trường hợp re-render không mong muốn)
        // Lưu ý: Cách kiểm tra này đơn giản, có thể không chính xác 100% nếu URL có query params
        if (document.querySelector(`script[src="${scriptConfig.src}"]`)) {
          console.warn(`Script ${scriptConfig.src} đã được tải.`);
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = scriptConfig.src;
        // Dùng defer nếu được chỉ định, defer thường tốt hơn async cho các script phụ thuộc nhau
        script.defer = scriptConfig.defer;
        script.async = false; // Vẫn giữ async=false cho jQuery nếu cần đảm bảo thứ tự tuyệt đối

        script.onload = () => {
          console.log(`Script loaded: ${scriptConfig.src}`);
          resolve();
        };
        script.onerror = (error) => {
          console.error(`Error loading script: ${scriptConfig.src}`, error);
          reject(error); // Báo lỗi
        };
        document.body.appendChild(script);
        addedScripts.current.push(script); // Lưu lại script đã thêm để cleanup
      });
    };

    // Load tuần tự jQuery trước, sau đó load song song các script còn lại
    loadScript(scripts[0]) // Load jQuery
       .then(() => {
           // Load các script còn lại bằng Promise.all sau khi jQuery đã load
           const remainingScriptPromises = scripts.slice(1).map(loadScript);
           return Promise.all(remainingScriptPromises);
       })
       .then(() => {
           console.log("Tất cả các script phụ thuộc đã được tải.");
            // Chỉ tắt preloader nếu component vẫn còn mounted
           if (isMounted) {
               // Đợi một chút để đảm bảo script (như active.js) có thời gian thực thi nếu cần
               setTimeout(() => {
                    if (isMounted) {
                        setShowPreloader(false);
                    }
               }, 500); // Tăng nhẹ delay nếu cần
           }
       })
       .catch(error => {
           console.error("Đã xảy ra lỗi khi tải scripts.", error);
           // Có thể hiển thị thông báo lỗi cho người dùng ở đây
           if (isMounted) {
              // Vẫn tắt preloader để người dùng không bị kẹt, dù có lỗi script
               setShowPreloader(false);
               // Có thể set một state lỗi khác để hiển thị thông báo
           }
       });


    // --- Cleanup Function ---
    return () => {
      isMounted = false; // Đánh dấu component đã unmount
      console.log("Cleaning up UserLayout scripts...");
      addedScripts.current.forEach(script => {
        if (script && script.parentNode) {
          console.log("Removing script:", script.src);
          script.parentNode.removeChild(script);
        }
      });
      addedScripts.current = []; // Reset mảng ref
      // Cần thêm logic để gỡ bỏ các event listener hoặc các đối tượng mà active.js đã tạo (rất khó nếu không biết chi tiết active.js)
      // Ví dụ nếu active.js khởi tạo slider: $('.slider').slick('unslick'); (nhưng gọi từ đâu?)
    };
  }, []); // Chỉ chạy 1 lần khi component mount

  return (
    <>
      <Helmet>
        {/* --- Các thẻ Link CSS (Giữ nguyên) --- */}
        <title>Petshop</title>
        <link rel="icon" href="/assets/user/images/favicon.png" />
        <link href="https://fonts.googleapis.com/css?family=Poppins:200i,300,400,600,700,900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/user/css/bootstrap.css" />
        <link rel="stylesheet" href="/assets/user/css/font-awesome.css" />
        <link rel="stylesheet" href="/assets/user/css/themify-icons.css" />
        <link rel="stylesheet" href="/assets/user/css/magnific-popup.min.css" />
        <link rel="stylesheet" href="/assets/user/css/flex-slider.min.css" />
        <link rel="stylesheet" href="/assets/user/css/animate.css" />
        <link rel="stylesheet" href="/assets/user/css/owl-carousel.css" />
        <link rel="stylesheet" href="/assets/user/css/slicknav.min.css" />
        <link rel="stylesheet" href="/assets/user/css/nice-select.css" />
        <link rel="stylesheet" href="/assets/user/css/jquery.fancybox.min.css" />
        <link rel="stylesheet" href="/assets/user/css/reset.css" />
        <link rel="stylesheet" href="/assets/user/style.css" />
        <link rel="stylesheet" href="/assets/user/css/responsive.css" />
         {/* Thêm link CSS của bạn cho ProductArea và Skeleton nếu cần */}
         {/* <link rel="stylesheet" href="/path/to/your/ProductArea.css" /> */}
      </Helmet>

      {/* Hiển thị Preloader dựa trên state */}
      {showPreloader && <Preloader />}

      {/* Chỉ hiển thị nội dung chính khi preloader đã tắt */}
      {/* Dùng visibility hoặc display none thay vì render có điều kiện
          để tránh component con bị unmount/remount khi preloader tắt */}
      <div style={{ visibility: showPreloader ? 'hidden' : 'visible' }}>
          <UserHeader />
          <main>{children}</main>
          <UserFooter />
      </div>
    </>
  );
}