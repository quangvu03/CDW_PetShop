// Đảm bảo Popper tồn tại để tránh lỗi khi load Bootstrap JS
window.Popper = window.Popper || undefined;

// Chờ DOM + React + Plugin được mount xong
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    if (typeof $ !== "undefined") {
      // Khởi tạo Slicknav (Menu Mobile)
      $('.nav-inner .menu').slicknav({
        prependTo: ".mobile-menu",
        allowParentLinks: true
      });

      // Owl Carousel cho slider
      $('.hero-slider').owlCarousel?.({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        nav: true,
        dots: false,
        navText: ["<i class='ti-angle-left'></i>", "<i class='ti-angle-right'></i>"]
      });

      // Fancybox hoặc Magnific Popup
      $('.popup-link').magnificPopup?.({
        type: 'image',
        gallery: {
          enabled: true
        }
      });

      // Nice Select
      $('.nice-select').niceSelect?.();

      // Scrollup
      $.scrollUp?.({
        scrollText: '<i class="fa fa-angle-up"></i>',
        easingType: 'linear',
        scrollSpeed: 900,
        animation: 'fade'
      });

      // Flex Slider nếu có
      $('.flex-slider').flexslider?.({
        animation: "slide",
        controlNav: true,
        directionNav: false
      });

      // Waypoints (check scroll animation)
      $('.some-section').waypoint?.(function () {
        // animation callback...
      }, { offset: '75%' });
    }
  }, 300); // Delay nhẹ để React render xong
});
