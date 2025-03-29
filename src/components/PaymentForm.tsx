
import React, { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentData } from '@/utils/qrGenerator';

// Form validation schema
const formSchema = z.object({
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
      amount: 10000,
      message: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onGenerate({
      amount: values.amount,
      message: values.message || "",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="payment-gradient rounded-t-lg">
        <CardTitle className="text-white text-center">Tạo Mã QR Thanh Toán</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              {isGenerating ? "Đang tạo..." : "Tạo Mã QR"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
