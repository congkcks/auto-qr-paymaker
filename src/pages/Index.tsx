
import React, { useState } from 'react';
import PaymentForm from '@/components/PaymentForm';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { generateQRCode, PaymentData } from '@/utils/qrGenerator';
import { Toaster } from "@/components/ui/toaster";
import { QrCode } from 'lucide-react';

const Index = () => {
  const [qrData, setQrData] = useState<{
    url: string;
    amount: number;
    message: string;
    bankId?: string;
    accountNo?: string;
    accountName?: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateQR = async (data: PaymentData) => {
    setIsGenerating(true);
    try {
      const qrCodeUrl = await generateQRCode(data);
      setQrData({
        url: qrCodeUrl,
        amount: data.amount,
        message: data.message,
        bankId: data.bankId,
        accountNo: data.accountNo,
        accountName: data.accountName
      });
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <QrCode size={32} className="text-payment-purple" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-payment">
            Tạo Mã VietQR Thanh Toán
          </h1>
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          Tạo nhanh mã VietQR với ngân hàng, số tài khoản, số tiền và lời nhắn tùy chỉnh
        </p>
      </header>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
        <div className="w-full md:w-1/2">
          <PaymentForm 
            onGenerate={handleGenerateQR} 
            isGenerating={isGenerating} 
          />
        </div>
        
        {qrData ? (
          <div className="w-full md:w-1/2">
            <QRCodeDisplay 
              qrCodeUrl={qrData.url} 
              amount={qrData.amount} 
              message={qrData.message}
              bankId={qrData.bankId}
              accountNo={qrData.accountNo}
              accountName={qrData.accountName}
            />
          </div>
        ) : (
          <div className="w-full md:w-1/2 flex items-center justify-center p-10">
            <div className="text-center text-gray-400">
              <QrCode size={80} className="mx-auto mb-4 opacity-30" />
              <p>Mã VietQR sẽ xuất hiện tại đây sau khi tạo</p>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>Sử dụng API chính thức của VietQR để tạo mã QR thanh toán.</p>
        <p className="mt-2">Quét mã bằng ứng dụng ngân hàng hỗ trợ VietQR.</p>
      </footer>
    </div>
  );
};

export default Index;
