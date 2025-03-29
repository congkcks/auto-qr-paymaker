
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentData, vietnameseBanks } from '@/utils/qrGenerator';

// Form validation schema
const formSchema = z.object({
  bankId: z.string({ required_error: "Vui lòng chọn ngân hàng" }),
  accountNo: z.string().min(5, { message: "Số tài khoản phải có ít nhất 5 ký tự" }),
  accountName: z.string().optional(),
  amount: z.coerce
    .number()
    .positive({ message: "Số tiền phải lớn hơn 0" })
    .min(1000, { message: "Số tiền tối thiểu là 1.000 VNĐ" }),
  message: z.string().max(100, { message: "Lời nhắn không được quá 100 ký tự" }).optional(),
});

interface PaymentFormProps {
  onGenerate: (data: PaymentData) => void;
  isGenerating: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onGenerate, isGenerating }) => {
  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankId: '',
      accountNo: '',
      accountName: '',
      amount: 10000,
      message: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onGenerate({
      bankId: values.bankId,
      accountNo: values.accountNo,
      accountName: values.accountName,
      amount: values.amount,
      message: values.message || "",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="payment-gradient rounded-t-lg">
        <CardTitle className="text-white text-center">Tạo Mã VietQR</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bankId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngân hàng</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ngân hàng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vietnameseBanks.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accountNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tài khoản</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập số tài khoản"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên tài khoản (không bắt buộc)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên tài khoản"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền (VNĐ)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập số tiền"
                      {...field}
                      className="text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lời nhắn (Không bắt buộc)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Thêm lời nhắn cho người nhận"
                      {...field}
                      className="resize-none h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full payment-gradient hover:opacity-90 transition-opacity"
              disabled={isGenerating}
            >
              {isGenerating ? "Đang tạo..." : "Tạo Mã VietQR"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
