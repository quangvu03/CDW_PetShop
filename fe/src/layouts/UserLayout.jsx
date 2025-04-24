import React, { useEffect, useState } from 'react';
import UserHeader from '../components/user/UserHeader';
import UserFooter from '../components/user/UserFooter';
import Preloader from '../components/common/PreLoader';
import { Helmet } from 'react-helmet-async';

export default function UserLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scripts = [
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js',
      '/assets/user/js/jquery-ui.min.js',
      '/assets/user/js/popper.min.js',
      '/assets/user/js/bootstrap.min.js',
      '/assets/user/js/slicknav.min.js',
      '/assets/user/js/jquery.nice-select.min.js',
      '/assets/user/js/owl-carousel.js',
      '/assets/user/js/flex-slider.js',
      '/assets/user/js/magnific-popup.js',
      '/assets/user/js/scrollup.js',
      '/assets/user/js/finalcountdown.min.js',
      '/assets/user/js/active.js'
    ];

    let loaded = 0;
    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => {
        loaded++;
        if (loaded === scripts.length) {
          setTimeout(() => setLoading(false), 300); // delay nhỏ để mượt hơn
        }
      };
      document.body.appendChild(script);
    });
  }, []);

  return (
    <>
      <Helmet>
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
      </Helmet>

      {loading ? (
        <Preloader />
      ) : (
        <>
          <UserHeader />
          <main>{children}</main>
          <UserFooter />
        </>
      )}
    </>
  );
}
