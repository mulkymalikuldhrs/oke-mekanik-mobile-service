
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Building, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';

/**
 * Zod schema for the payment form.
 */
const paymentSchema = z.object({
  paymentMethod: z.enum(['qris', 'gopay', 'bank_transfer', 'credit_card'], {
    required_error: "Anda harus memilih metode pembayaran.",
  }),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

/**
 * Posts the payment data to the API.
 * @param {PaymentFormValues} data The payment form data.
 * @returns {Promise<any>} A promise that resolves to the response from the API.
 */
const postPayment = async (data: PaymentFormValues) => {
  const response = await fetch('/api/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Pembayaran gagal');
  return response.json();
};

/**
 * Renders the payment page, allowing customers to pay for a completed service request.
 */
const PaymentPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  });

  const mutation = useMutation({
    mutationFn: postPayment,
    onSuccess: () => {
      toast({
        title: 'Pembayaran Berhasil! 🎉',
        description: 'Terima kasih! Anda akan dialihkan ke dashboard.',
      });
      setTimeout(() => navigate('/customer/dashboard'), 2000);
    },
    onError: () => {
      toast({
        title: 'Pembayaran Gagal',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: PaymentFormValues) => {
    mutation.mutate(data);
  };

  const paymentMethods = [
    { id: 'qris', name: 'QRIS', icon: Wallet },
    { id: 'gopay', name: 'GoPay', icon: Wallet },
    { id: 'bank_transfer', name: 'Transfer Bank', icon: Building },
    { id: 'credit_card', name: 'Kartu Kredit', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Pembayaran</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Biaya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between"><span>Biaya Jasa</span><span>Rp 150.000</span></div>
                <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>Rp 150.000</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pilih Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          {paymentMethods.map(method => {
                            const Icon = method.icon;
                            return (
                              <FormItem key={method.id} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={method.id} />
                                </FormControl>
                                <FormLabel className="font-normal flex items-center">
                                  <Icon className="h-5 w-5 mr-2" /> {method.name}
                                </FormLabel>
                              </FormItem>
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Memproses...' : 'Bayar Sekarang'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PaymentPage;
