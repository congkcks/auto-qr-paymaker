
import QRCode from 'qrcode';

export interface PaymentData {
  amount: number;
  message: string;
}

/**
 * Generates QR code data URL from payment information
 */
export const generateQRCode = async (data: PaymentData): Promise<string> => {
  // Format data into a payment string (in a real app, this would follow bank/payment provider format)
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
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Formats a number as VND currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};
