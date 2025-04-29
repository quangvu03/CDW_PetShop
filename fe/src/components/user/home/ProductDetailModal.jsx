import React, { useState, useEffect, useRef } from 'react';

// --- Constants ---
const BACKEND_BASE_URL = 'http://localhost:8080'; // Thay đổi nếu cần
const defaultPetImageUrl = "/assets/user/images/default-pet-placeholder.png"; // Đường dẫn ảnh mặc định
const ZOOM_FACTOR = 2.5; // Mức độ phóng to
const LENS_SIZE = 120;   // Kích thước kính lúp (pixel)

// --- Hàm helper (Sao chép hoặc import từ file utils) ---
const formatPrice = (price) => {
    const numericPrice = Number(price);
    if (price === null || price === undefined || isNaN(numericPrice)) return "Liên hệ";
    if (numericPrice >= 1000000) return `${(numericPrice / 1000000).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} triệu`;
    return `${numericPrice.toLocaleString('vi-VN')} VNĐ`;
};
const translateGender = (gender) => {
    if (gender === 'male') return 'Đực'; if (gender === 'female') return 'Cái'; return 'Không rõ';
};
const translateSize = (size) => {
    if (size === 'small') return 'Nhỏ'; if (size === 'medium') return 'Vừa'; if (size === 'large') return 'Lớn'; return 'Không rõ';
};
// Hàm xử lý đường dẫn ảnh (quan trọng)
const getFullImageUrl = (path) => {
    if (!path || typeof path !== 'string' || path.trim() === '') return defaultPetImageUrl;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
    const separator = path.startsWith('/') ? '' : '/';
    return `${BACKEND_BASE_URL}${separator}${path}`;
};
// --- Kết thúc hàm helper ---


function ProductDetailModal({ isOpen, onClose, pet }) {
    // --- State ---
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
    const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
    // --- Refs ---
    const imgRef = useRef(null);
    const containerRef = useRef(null);

    // --- Hàm lấy danh sách path ảnh (luôn trả về array) ---
    const getDisplayableImagePaths = (currentPet) => {
        // Luôn kiểm tra currentPet trước
        if (!currentPet) return [];
        let images = [];
        // Thêm ảnh chính nếu hợp lệ
        if (currentPet.imageUrl && typeof currentPet.imageUrl === 'string' && currentPet.imageUrl.trim() !== '') {
            images.push(currentPet.imageUrl);
        }
        // Thêm ảnh từ mảng imageUrls nếu hợp lệ
        if (currentPet.imageUrls && Array.isArray(currentPet.imageUrls)) {
            const validImageUrls = currentPet.imageUrls.filter(url => typeof url === 'string' && url.trim() !== '');
            images = [...images, ...validImageUrls];
        }
        // Trả về mảng các đường dẫn duy nhất (luôn là array)
        return [...new Set(images)];
    };
    // ------------------------------------------------------

    // --- useEffect để set ảnh ban đầu ---
    useEffect(() => {
        let initialFullUrl = defaultPetImageUrl;
        // Chỉ xử lý nếu modal mở VÀ có dữ liệu pet
        if (isOpen && pet) {
            const imagePaths = getDisplayableImagePaths(pet); // Luôn trả về array
            // Kiểm tra array có phần tử không
            if (imagePaths.length > 0) {
                initialFullUrl = getFullImageUrl(imagePaths[0]);
            }
        }
        setSelectedImageUrl(initialFullUrl);
        setShowMagnifier(false); // Luôn reset magnifier khi ảnh/modal thay đổi
    }, [pet, isOpen]); // Phụ thuộc pet và isOpen
    // -------------------------------------

    // --- Hàm xử lý sự kiện chuột cho kính lúp ---
    const handleMouseMove = (e) => {
        if (!containerRef.current || !imgRef.current || !imgRef.current.clientWidth || !imgRef.current.clientHeight) {
            setShowMagnifier(false); return;
        }
        if (!showMagnifier) setShowMagnifier(true); // Hiển thị nếu chưa

        const container = containerRef.current;
        const img = imgRef.current;
        const { top, left } = container.getBoundingClientRect();
        const displayWidth = img.clientWidth;
        const displayHeight = img.clientHeight;

        const x = e.pageX - left - window.scrollX;
        const y = e.pageY - top - window.scrollY;

        let lensX = x - LENS_SIZE / 2; let lensY = y - LENS_SIZE / 2;
        if (lensX < 0) lensX = 0; if (lensX > displayWidth - LENS_SIZE) lensX = displayWidth - LENS_SIZE;
        if (lensY < 0) lensY = 0; if (lensY > displayHeight - LENS_SIZE) lensY = displayHeight - LENS_SIZE;
        setMagnifierPosition({ x: lensX, y: lensY });

        const ratioX = x / displayWidth; const ratioY = y / displayHeight;
        const bgWidth = displayWidth * ZOOM_FACTOR; const bgHeight = displayHeight * ZOOM_FACTOR;
        const bgX = -(ratioX * bgWidth - LENS_SIZE / 2); const bgY = -(ratioY * bgHeight - LENS_SIZE / 2);
        setBackgroundPosition(`${bgX}px ${bgY}px`);
    };
    const handleMouseEnter = () => { setShowMagnifier(true); }; // Chỉ set true, kiểm tra kích thước trong mouseMove
    const handleMouseLeave = () => { setShowMagnifier(false); };
    // ---------------------------------------------

    // --- Hàm xử lý chung ---
    const handleContentClick = (e) => { e.stopPropagation(); };
    const handleThumbnailClick = (originalPath) => {
        const fullUrl = getFullImageUrl(originalPath);
        setSelectedImageUrl(fullUrl);
        setShowMagnifier(false);
    };
    // ----------------------


    // ==================== RENDER ====================
    if (!isOpen) return null; // Thoát sớm nếu không mở

    // ---- Tính toán trước khi render JSX ----
    // Gọi hàm lấy path ảnh *sau khi* chắc chắn `pet` tồn tại (nếu cần tối ưu)
    // Hoặc cứ gọi ở đây vì hàm đã xử lý pet null/undefined
    const displayImagePaths = getDisplayableImagePaths(pet);
    // Tính toán backgroundSize (cần kiểm tra imgRef.current tồn tại)
    const backgroundSize = imgRef.current ? `${imgRef.current.clientWidth * ZOOM_FACTOR}px ${imgRef.current.clientHeight * ZOOM_FACTOR}px` : 'auto';
    // Biến điều kiện hiển thị thumbnail (an toàn hơn)
    const shouldShowThumbnails = Array.isArray(displayImagePaths) && displayImagePaths.length > 1;
    // ----------------------------------------

    // ---- JSX ----
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={handleContentClick}>
                <button className="modal-close-button" onClick={onClose}>×</button>

                {/* Kiểm tra pet trước khi render nội dung chính */}
                {!pet ? (
                    <div style={{padding: '30px', textAlign: 'center'}}>Đang tải thông tin...</div>
                ) : (
                    <div className="modal-body-container">
                        {/* Cột 1: Thumbnails */}
                        {shouldShowThumbnails && (
                            <div className="modal-thumbnails-column">
                                {displayImagePaths.map((imgPath, index) => {
                                    const fullThumbnailUrl = getFullImageUrl(imgPath);
                                    const isActive = selectedImageUrl === fullThumbnailUrl;
                                    return (
                                        <img
                                            key={`${pet.id}-thumb-${index}-${imgPath}`}
                                            src={fullThumbnailUrl}
                                            alt={`Ảnh nhỏ ${index + 1}`}
                                            className={`thumbnail-image ${isActive ? 'active' : ''}`}
                                            onClick={() => handleThumbnailClick(imgPath)}
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {/* Cột 2: Ảnh chính và Kính lúp */}
                        <div className="modal-main-image-column">
                            <div
                                ref={containerRef}
                                className="zoom-container-relative"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <img
                                    ref={imgRef}
                                    key={selectedImageUrl} // Quan trọng khi ảnh thay đổi
                                    src={selectedImageUrl}
                                    alt={`Ảnh chính của ${pet.name || 'Thú cưng'}`}
                                    className="modal-main-image"
                                    onError={(e) => { if (e.target.src !== defaultPetImageUrl) { e.target.onerror = null; e.target.src = defaultPetImageUrl; } }}
                                />
                                {/* Kính lúp */}
                                {showMagnifier && imgRef.current?.clientWidth > 0 && (
                                    <div
                                        className="magnifier-lens"
                                        style={{
                                            left: `${magnifierPosition.x}px`,
                                            top: `${magnifierPosition.y}px`,
                                            backgroundImage: `url(${selectedImageUrl})`,
                                            backgroundPosition: backgroundPosition,
                                            backgroundSize: backgroundSize, // Sử dụng biến đã tính
                                        }}
                                    ></div>
                                )}
                            </div>
                        </div>

                        {/* Cột 3: Thông tin chi tiết */}
                        <div className="modal-pet-details-column">
                            <h2>{pet.name || 'Chưa có tên'}</h2>
                            <p className="pet-price"><strong>Giá:</strong> {formatPrice(pet.price)}</p>
                            <hr />
                            <div className="detail-grid">
                                <p><strong>Loài:</strong> {pet.species || 'N/A'}</p>
                                <p><strong>Giống:</strong> {pet.breed || 'N/A'}</p>
                                <p><strong>Giới tính:</strong> {translateGender(pet.gender)}</p>
                                <p><strong>Tuổi:</strong> {pet.age ? `${pet.age} tháng` : 'N/A'}</p>
                                <p><strong>Màu sắc:</strong> {pet.color || 'N/A'}</p>
                                <p><strong>Kích thước:</strong> {translateSize(pet.size)}</p>
                                <p><strong>Nguồn gốc:</strong> {pet.origin || 'N/A'}</p>
                            </div>
                             <hr />
                            <p><strong>Mô tả:</strong></p>
                            <div className="pet-description">{pet.description || 'Chưa có mô tả.'}</div>
                        </div>
                    </div>
                )}
                {/* Kết thúc kiểm tra pet */}
            </div>
        </div>
    );
}
export default ProductDetailModal;