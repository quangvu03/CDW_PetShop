import React from 'react';
import '../common/PreLoader.css'; // Tạo file css cho hiệu ứng

export default function Preloader() {
  return (
    <div className="preloader">
      <div className="preloader-inner">
        <div className="preloader-icon">
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
