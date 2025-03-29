
export interface PaymentData {
  bankId: string;
  accountNo: string;
  amount: number;
  message: string;
  template?: string;
  accountName?: string;
}

/**
 * Tạo URL mã VietQR từ thông tin thanh toán
 */
export const generateQRCode = async (data: PaymentData): Promise<string> => {
  try {
    // Sử dụng cú pháp Quick Link của VietQR
    let baseUrl = `https://img.vietqr.io/image/${data.bankId}-${data.accountNo}`;

    // Sử dụng template mặc định nếu không có
    const template = data.template || 'compact';
    baseUrl += `-${template}.png`;

    // Thêm tham số amount, addInfo và accountName
    const params = new URLSearchParams();
    
    if (data.amount > 0) {
      params.append('amount', data.amount.toString());
    }
    
    if (data.message) {
      params.append('addInfo', data.message);
    }
    
    if (data.accountName) {
      params.append('accountName', data.accountName);
    }
    
    const paramsString = params.toString();
    const finalUrl = paramsString ? `${baseUrl}?${paramsString}` : baseUrl;
    
    return finalUrl;
  } catch (error) {
    console.error('Lỗi tạo mã VietQR:', error);
    throw new Error('Không thể tạo mã VietQR');
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

/**
 * Danh sách các ngân hàng Việt Nam hỗ trợ VietQR
 */
export const vietnameseBanks = [
  { id: 'vietinbank', name: 'VietinBank' },
  { id: 'vietcombank', name: 'Vietcombank' },
  { id: 'bidv', name: 'BIDV' },
  { id: 'agribank', name: 'Agribank' },
  { id: 'tpbank', name: 'TPBank' },
  { id: 'vpbank', name: 'VPBank' },
  { id: 'mbbank', name: 'MB Bank' },
  { id: 'techcombank', name: 'Techcombank' },
  { id: 'acb', name: 'ACB' },
  { id: 'ocb', name: 'OCB' },
  { id: 'hdbank', name: 'HDBank' },
  { id: 'sacombank', name: 'Sacombank' },
  { id: 'scb', name: 'SCB' },
  { id: 'vib', name: 'VIB' },
  { id: 'seabank', name: 'SeABank' },
  { id: 'msb', name: 'MSB' },
  { id: 'shb', name: 'SHB' },
  { id: 'eximbank', name: 'Eximbank' },
  { id: 'baovietbank', name: 'BAOVIET Bank' },
  { id: 'vietcapitalbank', name: 'Viet Capital Bank' },
  { id: 'pvcombank', name: 'PVcomBank' },
  { id: 'kienlongbank', name: 'Kienlongbank' }
];
