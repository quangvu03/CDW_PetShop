// src/pages/user/PaymentCallback.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getOrderDetail, cancelOrder, updateOrderStatusByPayOs } from '../../services/orderService';
import { toast } from 'react-toastify';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');
    const code = searchParams.get('code');
    const orderCode = searchParams.get('orderCode');
    const cancel = searchParams.get('cancel');

    console.log('Callback params:', { status, orderId, code, orderCode, cancel }); // Debug

    if (!orderId || !status) {
      toast.error('Thông tin thanh toán không hợp lệ');
      navigate('/user/order-history');
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        setLoading(true);
        let updatedOrder = null;

        // Gọi cancelOrder nếu status là cancelled hoặc cancel là true
        if ((status === 'cancelled' || (cancel && cancel === 'true')) && orderId) {
          try {
            await cancelOrder(orderId);
            toast.info('Đơn hàng đã được hủy.');
          } catch (cancelError) {
            console.error('Lỗi khi hủy đơn hàng:', cancelError);
            toast.error(cancelError.message || 'Không thể hủy đơn hàng');
          }
        }

        // Lấy thông tin đơn hàng để kiểm tra trạng thái
        const response = await getOrderDetail(orderId);
        console.log('Order detail response:', response); // Debug response
        if (response && response.order) {
          updatedOrder = response.order;
          setOrder(updatedOrder);

          // Cập nhật paymentStatus thành 'paid' nếu thanh toán thành công
          if ((status === 'success' || status === 'PAID') && code === '00' && updatedOrder.paymentStatus !== 'paid') {
            try {
              const updateResponse = await updateOrderStatusByPayOs(orderId, updatedOrder.status, 'paid');
              console.log('Update order status response:', updateResponse); // Debug
              toast.success('Thanh toán thành công và trạng thái đã được cập nhật!');
            } catch (updateError) {
              console.error('Lỗi khi cập nhật trạng thái:', updateError.response || updateError);
              toast.error(updateError.response?.data?.message || updateError.message || 'Không thể cập nhật trạng thái thanh toán');
            }
          } else if (status === 'cancelled' || (cancel && cancel === 'true')) {
            toast.info('Thanh toán đã bị hủy. Đơn hàng đã được hủy.');
          } else if (code && code !== '00') {
            toast.warning(`Thanh toán thất bại, mã lỗi: ${code}`);
          } else {
            toast.warning('Thanh toán chưa hoàn tất, vui lòng kiểm tra lại.');
          }
        } else {
          toast.error('Không tìm thấy thông tin đơn hàng');
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái đơn hàng:', error.response || error);
        toast.error(error.message || 'Không thể kiểm tra trạng thái thanh toán');
      } finally {
        setLoading(false);
        setTimeout(() => navigate('/user/order-history'), 3000);
      }
    };

    fetchOrderStatus();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Đang kiểm tra trạng thái thanh toán...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Kết quả thanh toán</h2>
      {order && (
        <div>
          <p><strong>Mã đơn hàng:</strong> #{order.id}</p>
          <p><strong>Trạng thái thanh toán:</strong> {order.paymentStatus === 'unpaid' ? 'Chưa thanh toán' : 'Đã thanh toán'}</p>
          <p>Chuyển hướng đến lịch sử đơn hàng trong giây lát...</p>
        </div>
      )}
    </div>
  );
}