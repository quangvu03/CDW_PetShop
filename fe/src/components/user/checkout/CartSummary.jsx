import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function CartSummary({
  onShippingChange,
  selectedShipping,
  total,
  setTotal,
  shippingMethods = [],
  items = [],
}) {
  const { t } = useTranslation();
  const [shippingFee, setShippingFee] = useState(30000);

  useEffect(() => {
    const subtotal = items.reduce(
      (sum, item) =>
        sum + ((item.pet?.price || item.product?.price || 0) * (item.quantity || 1)),
      0
    );
    setTotal(subtotal + shippingFee);
  }, [items, shippingFee, setTotal]);

  const handleShippingChange = (e) => {
    const methodId = parseInt(e.target.value);
    const method = shippingMethods.find((m) => m.id === methodId);
    if (method) {
      setShippingFee(method.price || 0);
      onShippingChange(method);
    }
  };

  const getFullImageUrl = (path) => {
    if (!path || typeof path !== 'string') return '/assets/user/images/default-pet-placeholder.png';
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const subtotal = items.reduce(
    (sum, item) =>
      sum + ((item.pet?.price || item.product?.price || 0) * (item.quantity || 1)),
    0
  );

  return (
    <>
      <div className="order-details">
        <div className="single-widget">
          <h2>{t('cart_summary_cart_total', { defaultValue: 'Tổng giỏ hàng' })}</h2>
          <div className="content">
            <ul>
              {items.map((item) => {
                const name = item.pet?.name || item.product?.name || t('cart_summary_unknown', { defaultValue: 'Không rõ' });
                const image = getFullImageUrl(item.pet?.imageUrl || item.product?.imageUrl);
                const price = item.pet?.price || item.product?.price || 0;

                return (
                  <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <img
                      src={image}
                      alt={name}
                      style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div style={{ marginLeft: '30px' }}>
                      <div>{name}</div>
                      <div style={{ fontSize: '14px', color: '#888' }}>
                        {item.quantity} x {price.toLocaleString('vi-VN')} {t('cart_summary_vnd', { defaultValue: 'VND' })}
                      </div>
                    </div>
                  </li>
                );
              })}
              <li>
                {t('cart_summary_subtotal', { defaultValue: 'Tổng hàng' })} <span>{subtotal.toLocaleString('vi-VN')} {t('cart_summary_vnd', { defaultValue: 'VND' })}</span>
              </li>
              <li>
                (+) {t('cart_summary_shipping', { defaultValue: 'Giao hàng' })} <span>{(shippingFee || 0).toLocaleString('vi-VN')} {t('cart_summary_vnd', { defaultValue: 'VND' })}</span>
              </li>
              <li className="last">
                {t('cart_summary_total', { defaultValue: 'Tổng' })} <span>{(subtotal + shippingFee).toLocaleString('vi-VN')} {t('cart_summary_vnd', { defaultValue: 'VND' })}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="order-shipping" style={{ marginTop: '20px' }}>
        <div className="single-widget">
          <h2>{t('cart_summary_shipping_methods', { defaultValue: 'Phương thức vận chuyển' })}</h2>
          <div className="content">
            <select className="form-control" value={selectedShipping?.id || ''} onChange={handleShippingChange}>
              <option value="">{t('cart_summary_select_shipping', { defaultValue: '-- Chọn phương thức --' })}</option>
              {shippingMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name} - {(method.price || 0).toLocaleString('vi-VN')} {t('cart_summary_vnd', { defaultValue: 'VND' })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}