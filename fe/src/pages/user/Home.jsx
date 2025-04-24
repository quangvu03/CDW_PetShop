import React from 'react';
import HeroSlider from '../../components/user/home/HeroSlider'; 
import BannerSection from '../../components/user/home/BannerSection';
import ProductArea from '../../components/user/home/ProductArea';

export default function Home() {
  return (
    <>
      <HeroSlider />
      <BannerSection />
      <ProductArea />
    </>
  );
}