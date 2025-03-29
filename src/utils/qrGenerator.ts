
import QRCode from 'qrcode';

export interface PaymentData {
  amount: number;
  message: string;
}

/**
 * Tạo URL dữ liệu mã QR từ thông tin thanh toán
 */
export const generateQRCode = async (data: PaymentData): Promise<string> => {
  // Định dạng dữ liệu thành chuỗi thanh toán (trong ứng dụng thực tế, sẽ tuân theo định dạng của ngân hàng/nhà cung cấp dịch vụ thanh toán)
  const paymentString = JSON.stringify({
    amount: data.amount,
    message: data.message,
    timestamp: new Date().toISOString()
  });
  
  try {
    return await QRCode.toDataURL(paymentString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.error('Lỗi tạo mã QR:', error);
    throw new Error('Không thể tạo mã QR');
  }
};

/**
 * Định dạng số thành tiền tệ VND
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};
