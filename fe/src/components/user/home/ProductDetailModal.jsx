import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { addToCart } from '../../../services/cartService';

const BACKEND_BASE_URL = 'http://localhost:8080';
const defaultPetImageUrl = "/assets/user/images/default-pet-placeholder.png";
const ZOOM_FACTOR = 2.5;
const LENS_SIZE = 120;

const formatPrice = (price, t) => {
  const numericPrice = Number(price);
  if (price === null || price === undefined || isNaN(numericPrice)) return t('modal_contact_price', { defaultValue: 'Liên hệ' });
  if (numericPrice >= 1000000) return `${(numericPrice / 1000000).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} triệu`;
  return `${numericPrice.toLocaleString('vi-VN')} VNĐ`;
};
const translateGender = (gender, t) => {
  if (gender === 'male') return t('modal_male', { defaultValue: 'Đực' });
  if (gender === 'female') return t('modal_female', { defaultValue: 'Cái' });
  return t('modal_unknown', { defaultValue: 'Không rõ' });
};
const translateSize = (size, t) => {
  if (size === 'small') return t('modal_small', { defaultValue: 'Nhỏ' });
  if (size === 'medium') return t('modal_medium', { defaultValue: 'Vừa' });
  if (size === 'large') return t('modal_large', { defaultValue: 'Lớn' });
  return t('modal_unknown', { defaultValue: 'Không rõ' });
};

const getFullImageUrl = (path) => {
  if (!path || typeof path !== 'string' || path.trim() === '') return defaultPetImageUrl;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
  const separator = path.startsWith('/') ? '' : '/';
  return `${BACKEND_BASE_URL}${separator}${path}`;
};

function ProductDetailModal({ isOpen, onClose, pet }) {
  const { t } = useTranslation();
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const getDisplayableImagePaths = (currentPet) => {
    if (!currentPet) return [];
    let images = [];
    if (currentPet.imageUrl && typeof currentPet.imageUrl === 'string' && currentPet.imageUrl.trim() !== '') {
      images.push(currentPet.imageUrl);
    }
    if (currentPet.imageUrls && Array.isArray(currentPet.imageUrls)) {
      const validImageUrls = currentPet.imageUrls.filter(url => typeof url === 'string' && url.trim() !== '');
      images = [...images, ...validImageUrls];
    }
    return [...new Set(images)];
  };

  const handleAddToCart = async (pet) => {
    try {
      await addToCart(pet.id, selectedQuantity);
      window.dispatchEvent(new Event('cart-updated'));
      toast.success(t('modal_cart_added', { defaultValue: `🛒 Đã thêm ${selectedQuantity} vào giỏ hàng!` }));
    } catch (err) {
      toast.error(t('modal_cart_error', { defaultValue: '🚫 Thêm vào giỏ hàng thất bại!' }));
      console.error(err);
    }
  };

  const handleAddToWishlist = (pet) => {
    console.log(t('modal_wishlist_added', { defaultValue: "Đã yêu thích:" }), pet);
  };

  useEffect(() => {
    let initialFullUrl = defaultPetImageUrl;
    if (isOpen && pet) {
      const imagePaths = getDisplayableImagePaths(pet);
      if (imagePaths.length > 0) {
        initialFullUrl = getFullImageUrl(imagePaths[0]);
      }
    }
    setSelectedImageUrl(initialFullUrl);
    setShowMagnifier(false);
  }, [pet, isOpen]);

  const handleMouseMove = (e) => {
    if (!containerRef.current || !imgRef.current || !imgRef.current.clientWidth || !imgRef.current.clientHeight) {
      setShowMagnifier(false); return;
    }
    if (!showMagnifier) setShowMagnifier(true);

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
  const handleMouseEnter = () => { setShowMagnifier(true); };
  const handleMouseLeave = () => { setShowMagnifier(false); };

  const handleContentClick = (e) => { e.stopPropagation(); };
  const handleThumbnailClick = (originalPath) => {
    const fullUrl = getFullImageUrl(originalPath);
    setSelectedImageUrl(fullUrl);
    setShowMagnifier(false);
  };

  if (!isOpen) return null;

  const displayImagePaths = getDisplayableImagePaths(pet);
  const backgroundSize = imgRef.current ? `${imgRef.current.clientWidth * ZOOM_FACTOR}px ${imgRef.current.clientHeight * ZOOM_FACTOR}px` : 'auto';
  const shouldShowThumbnails = Array.isArray(displayImagePaths) && displayImagePaths.length > 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <button className="modal-close-button" onClick={onClose}>×</button>

        {!pet ? (
          <div style={{ padding: '30px', textAlign: 'center' }}>{t('modal_loading', { defaultValue: 'Đang tải thông tin...' })}</div>
        ) : (
          <div className="modal-body-container">
            {shouldShowThumbnails && (
              <div className="modal-thumbnails-column">
                {displayImagePaths.map((imgPath, index) => {
                  const fullThumbnailUrl = getFullImageUrl(imgPath);
                  const isActive = selectedImageUrl === fullThumbnailUrl;
                  return (
                    <img
                      key={`${pet.id}-thumb-${index}-${imgPath}`}
                      src={fullThumbnailUrl}
                      alt={t('modal_thumbnail_alt', { defaultValue: `Ảnh nhỏ ${index + 1}` })}
                      className={`thumbnail-image ${isActive ? 'active' : ''}`}
                      onClick={() => handleThumbnailClick(imgPath)}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  );
                })}
              </div>
            )}

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
                  key={selectedImageUrl}
                  src={selectedImageUrl}
                  alt={t('modal_main_image_alt', { defaultValue: `Ảnh chính của ${pet.name || 'Thú cưng'}` })}
                  className="modal-main-image"
                  onError={(e) => { if (e.target.src !== defaultPetImageUrl) { e.target.onerror = null; e.target.src = defaultPetImageUrl; } }}
                />
                {showMagnifier && imgRef.current?.clientWidth > 0 && (
                  <div
                    className="magnifier-lens"
                    style={{
                      left: `${magnifierPosition.x}px`,
                      top: `${magnifierPosition.y}px`,
                      backgroundImage: `url(${selectedImageUrl})`,
                      backgroundPosition: backgroundPosition,
                      backgroundSize: backgroundSize,
                    }}
                  ></div>
                )}
              </div>
            </div>

            <div className="modal-pet-details-column">
              <h3 className="d-flex align-items-center gap-2">
                <a href={`/pet/${pet.id}`} className="text-decoration-none">
                  {pet.name || t('modal_unnamed', { defaultValue: 'Chưa có tên' })}
                </a>
                <span
                  className={`pet-status-badge ${pet.status === 'available'
                      ? 'badge-available'
                      : pet.status === 'pending'
                        ? 'badge-pending'
                        : 'badge-sold'
                    }`}
                  title={t('modal_status_title', { defaultValue: `Trạng thái: ${pet.status === 'available' ? 'Có sẵn' : pet.status === 'pending' ? 'Đang nhập' : 'Hết hàng'}` })}
                >
                  {pet.status === 'available'
                    ? t('modal_available', { defaultValue: 'Có sẵn' })
                    : pet.status === 'pending'
                      ? t('modal_pending', { defaultValue: 'Đang nhập' })
                      : t('modal_sold_out', { defaultValue: 'Hết hàng' })}
                </span>
              </h3>
              <p className="pet-price"><strong>{t('modal_price_label', { defaultValue: 'Giá:' })}</strong> {formatPrice(pet.price, t)}</p>
              <hr />
              <div className="detail-grid">
                <p><strong>{t('modal_quantity_label', { defaultValue: 'Số lượng:' })}</strong> {pet.quantity ?? '1'}</p>
                <p><strong>{t('modal_species_label', { defaultValue: 'Loài:' })}</strong> {pet.species || 'N/A'}</p>
                <p><strong>{t('modal_breed_label', { defaultValue: 'Giống:' })}</strong> {pet.breed || 'N/A'}</p>
                <p><strong>{t('modal_gender_label', { defaultValue: 'Giới tính:' })}</strong> {translateGender(pet.gender, t)}</p>
                <p><strong>{t('modal_age_label', { defaultValue: 'Tuổi:' })}</strong> {pet.age ? `${pet.age} tháng` : 'N/A'}</p>
                <p><strong>{t('modal_color_label', { defaultValue: 'Màu sắc:' })}</strong> {pet.color || 'N/A'}</p>
                <p><strong>{t('modal_size_label', { defaultValue: 'Kích thước:' })}</strong> {translateSize(pet.size, t)}</p>
                <p><strong>{t('modal_origin_label', { defaultValue: 'Nguồn gốc:' })}</strong> {pet.origin || 'N/A'}</p>
              </div>
              <hr />
              <p><strong>{t('modal_description_label', { defaultValue: 'Mô tả:' })}</strong></p>
              <div className="pet-description">{pet.description || t('modal_no_description', { defaultValue: 'Chưa có mô tả.' })}</div>
              <div className="quantity-selector">
                <label htmlFor="quantity-input">{t('modal_quantity_label', { defaultValue: 'Số lượng:' })}</label>
                <div className="quantity-control">
                  <button
                    onClick={() => {
                      if (selectedQuantity <= 1) {
                        toast.warning(t('modal_min_quantity_warning', { defaultValue: '⚠️ Số lượng tối thiểu là 1!' }));
                      } else {
                        setSelectedQuantity(q => q - 1);
                      }
                    }}
                  >
                    −
                  </button>
                  <input
                    id="quantity-input"
                    type="number"
                    min="1"
                    max={pet.quantity}
                    value={selectedQuantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (isNaN(value) || value < 1) {
                        toast.warning(t('modal_min_quantity_warning', { defaultValue: '⚠️ Số lượng không được nhỏ hơn 1!' }));
                        setSelectedQuantity(1);
                      } else if (value > pet.quantity) {
                        toast.warning(t('modal_out_of_stock_warning', { defaultValue: '🚫 Vượt quá số lượng tồn kho!' }));
                        setSelectedQuantity(pet.quantity);
                      } else {
                        setSelectedQuantity(value);
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (selectedQuantity >= pet.quantity) {
                        toast.warning(t('modal_max_quantity_warning', { defaultValue: '🚫 Đã đạt số lượng tối đa trong kho!' }));
                      } else {
                        setSelectedQuantity(q => q + 1);
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons-full">
                <button className="custom-btn btn-cart" onClick={() => handleAddToCart(pet)}>
                  {t('modal_add_to_cart', { defaultValue: '🛒 THÊM VÀO GIỎ HÀNG' })}
                </button>
                <button className="custom-btn btn-wishlist" onClick={() => handleAddToWishlist(pet)}>
                  {t('modal_add_to_wishlist', { defaultValue: '❤️ YÊU THÍCH' })}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ProductDetailModal;