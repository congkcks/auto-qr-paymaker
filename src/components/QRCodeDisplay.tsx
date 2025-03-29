
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Copy, Download, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/qrGenerator';
import { useToast } from '@/components/ui/use-toast';

interface QRCodeDisplayProps {
  qrCodeUrl: string;
  amount: number;
  message: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCodeUrl, amount, message }) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const qrRef = useRef<HTMLImageElement>(null);

  // Function to copy QR code to clipboard
  const copyToClipboard = async () => {
    try {
      if (qrCodeUrl) {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = qrRef.current;

        if (img && ctx) {
          // Set canvas dimensions to match the image
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);
          
          // Convert canvas to blob
          canvas.toBlob(async (blob) => {
            if (blob) {
              // Copy the blob to clipboard
              await navigator.clipboard.write([
                new ClipboardItem({
                  [blob.type]: blob
                })
              ]);
              
              setCopied(true);
              toast({
                title: "Copied!",
                description: "QR code copied to clipboard",
              });
              
              // Reset the copied state after 2 seconds
              setTimeout(() => setCopied(false), 2000);
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Error",
        description: "Failed to copy QR code",
        variant: "destructive",
      });
    }
  };

  // Function to download QR code
  const downloadQRCode = () => {
    try {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `payment-qr-${amount}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Downloaded!",
        description: "QR code saved to your device",
      });
    } catch (error) {
      console.error('Failed to download:', error);
      toast({
        title: "Error",
        description: "Failed to download QR code",
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
              <h3 className="text-lg font-semibold text-gray-800">Payment QR Code</h3>
            </div>
            <div className="text-2xl font-bold text-payment-purple">{formatCurrency(amount)}</div>
            {message && <p className="text-sm text-gray-600 mt-1">"{message}"</p>}
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-gray-100 animate-pulse-scale">
            <img 
              ref={qrRef}
              src={qrCodeUrl} 
              alt="Payment QR Code" 
              className="w-64 h-64"
            />
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button 
              className="flex items-center gap-2 bg-payment-green hover:bg-opacity-90"
              onClick={downloadQRCode}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
