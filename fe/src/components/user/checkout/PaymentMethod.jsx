import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PaymentMethod({ selectedMethod, onMethodChange }) {
  const { t } = useTranslation();

  return (
    <div className="single-widget">
      <h2>{t('payment_method_title', { defaultValue: 'Phương thức thanh toán' })}</h2>
      <div className="content" style={{ margin: '10px 30px' }}>
        <label>
          <input
            type="radio"
            name="payment"
            value="COD"
            checked={selectedMethod === 'COD'}
            onChange={() => onMethodChange('COD')}
          />
          {t('payment_method_cod', { defaultValue: 'Thanh toán khi nhận hàng (COD)' })}
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="payment"
            value="PAYOS"
            checked={selectedMethod === 'PAYOS'}
            onChange={() => onMethodChange('PAYOS')}
          />
          {t('payment_method_payos', { defaultValue: 'Thanh toán qua PayOS' })}
        </label>
      </div>
    </div>
  );
}