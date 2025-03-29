import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Copy, Download, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/qrGenerator';
import { useToast } from '@/hooks/use-toast';

interface QRCodeDisplayProps {
  qrCodeUrl: string;
  amount: number;
  message: string;
  bankId?: string;
  accountNo?: string;
  accountName?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrCodeUrl,
  amount,
  message,
  bankId,
  accountNo,
  accountName
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const qrRef = useRef<HTMLImageElement>(null);

  // Function to copy QR code to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeUrl);

      setCopied(true);
      toast({
        title: "Đã sao chép!",
        description: "Đường dẫn VietQR đã được sao chép vào bộ nhớ tạm",
      });

      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Lỗi",
        description: "Không thể sao chép đường dẫn VietQR",
        variant: "destructive",
      });
    }
  };

  // Function to download QR code
  const downloadQRCode = () => {
    if (!qrRef.current) return;

    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Set canvas dimensions to match the QR code image
      canvas.width = qrRef.current.naturalWidth || qrRef.current.width;
      canvas.height = qrRef.current.naturalHeight || qrRef.current.height;

      // Draw the image on the canvas
      ctx.drawImage(qrRef.current, 0, 0);

      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png');

      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `vietqr-${bankId || 'bank'}-${accountNo || 'account'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Đã tải xuống!",
        description: "Mã VietQR đã được lưu vào thiết bị của bạn",
      });
    } catch (error) {
      console.error('Failed to download:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải xuống mã VietQR",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto qr-container">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="mb-4 text-center">
            <div className="inline-flex items-center gap-2 mb-1">
              <QrCode className="h-5 w-5 text-payment-purple" />
              <h3 className="text-lg font-semibold text-gray-800">Mã VietQR</h3>
            </div>
            {accountNo && bankId && (
              <p className="text-sm text-gray-700 mb-1">
                {accountName || accountNo} - {bankId.toUpperCase()}
              </p>
            )}
            <div className="text-2xl font-bold text-payment-purple">{formatCurrency(amount)}</div>
            {message && <p className="text-sm text-gray-600 mt-1">"{message}"</p>}
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-gray-100 mb-4">
            <img
              ref={qrRef}
              src={qrCodeUrl}
              alt="Mã VietQR"
              className="w-64 h-64"
              crossOrigin="anonymous"
            />
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Đã sao chép" : "Sao chép"}
            </Button>
            <Button
              className="flex items-center gap-2 bg-payment-green hover:bg-opacity-90"
              onClick={downloadQRCode}
            >
              <Download className="h-4 w-4" />
              Tải xuống
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;