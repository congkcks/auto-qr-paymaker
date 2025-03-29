
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
    .positive({ message: "Amount must be greater than 0" })
    .min(1000, { message: "Amount must be at least 1,000 VND" }),
  message: z.string().max(100, { message: "Message must be less than 100 characters" }).optional(),
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
        <CardTitle className="text-white text-center">QR Payment Generator</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
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
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a message for the recipient"
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
              {isGenerating ? "Generating..." : "Generate QR Code"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
