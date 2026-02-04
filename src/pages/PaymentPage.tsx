
<<<<<<< HEAD
import React, { useState } from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Wallet, Landmark, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
=======
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
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
import { CreditCard, Wallet, Building, QrCode, CheckCircle, Clock, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
>>>>>>> origin/jules-9588893365322302084-daabd2d3

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
  const response = await fetch('http://localhost:3001/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, bookingId: 1, amount: 150000, status: 'completed' }),
  });
  if (!response.ok) throw new Error('Pembayaran gagal');
  return response.json();
};

/**
 * Renders the payment page, allowing customers to pay for a completed service request.
 */
const PaymentPage = () => {
<<<<<<< HEAD
<<<<<<< HEAD
  const navigate = useNavigate();
  const [method, setMethod] = useState('ewallet');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Pembayaran Berhasil!');
      navigate('/customer/dashboard');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>

        <Card className="shadow-xl border-none overflow-hidden">
          <CardHeader className="bg-green-600 text-white p-8">
            <CardTitle className="text-2xl font-bold flex items-center">
              <CheckCircle className="h-6 w-6 mr-3" />
              Pembayaran
            </CardTitle>
            <p className="text-green-100 mt-2">Pilih metode pembayaran untuk layanan Anda</p>
          </CardHeader>
          
          <CardContent className="p-6 space-y-8">
            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Total Tagihan</p>
              <h2 className="text-4xl font-black text-gray-900">Rp 150.000</h2>
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                <p>Layanan: Ganti Oli Standar</p>
                <p>Mekanik: Ahmad Rizki</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Metode Pembayaran</h3>
              <RadioGroup value={method} onValueChange={setMethod} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ewallet" id="ewallet" className="peer sr-only" />
                  <Label
                    htmlFor="ewallet"
                    className="flex flex-1 items-center justify-between rounded-xl border-2 border-muted p-4 hover:bg-gray-50 peer-data-[state=checked]:border-green-600 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 mr-3 text-green-600" />
                      <span className="font-medium">E-Wallet (OVO, GoPay, Dana)</span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" className="peer sr-only" />
                  <Label
                    htmlFor="card"
                    className="flex flex-1 items-center justify-between rounded-xl border-2 border-muted p-4 hover:bg-gray-50 peer-data-[state=checked]:border-green-600 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-3 text-blue-600" />
                      <span className="font-medium">Kartu Kredit / Debit</span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                  <Label
                    htmlFor="bank"
                    className="flex flex-1 items-center justify-between rounded-xl border-2 border-muted p-4 hover:bg-gray-50 peer-data-[state=checked]:border-green-600 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <Landmark className="h-5 w-5 mr-3 text-orange-600" />
                      <span className="font-medium">Transfer Bank (VA)</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>

          <CardFooter className="p-6 bg-gray-50 flex flex-col gap-4">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg font-bold shadow-lg shadow-green-200"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Bayar Sekarang'
              )}
            </Button>
            <div className="flex items-center justify-center text-[10px] text-gray-400">
              <ShieldCheck className="h-3 w-3 mr-1 text-green-600" />
              Pembayaran Terenkripsi & Aman
            </div>
          </CardFooter>
        </Card>
=======
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
=======
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const queryClient = useQueryClient();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => api.getBookingById(bookingId!),
    enabled: !!bookingId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: any) => api.updateBookingStatus(bookingId!, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['booking', bookingId] }),
  });

  const paymentMethods = [
    { id: 'qris', name: 'QRIS', icon: QrCode, fee: 0 },
    { id: 'gopay', name: 'GoPay', icon: Wallet, fee: 0 },
    { id: 'bank_transfer', name: 'Transfer Bank', icon: Building, fee: 2500 },
    { id: 'credit_card', name: 'Kartu Kredit', icon: CreditCard, fee: 5000 },
  ];

  const handlePayment = () => {
    if (!selectedMethod) return;

    setPaymentStatus('processing');
    
    setTimeout(() => {
      setPaymentStatus('completed');
      updateStatusMutation.mutate('completed');
      toast({
        title: "Pembayaran Berhasil! 🎉",
        description: "Terima kasih telah menggunakan layanan Oke Mekanik.",
      });
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) return <div className="p-8 text-center">Memuat pembayaran...</div>;
  if (!booking) return <div className="p-8 text-center">Pesanan tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pembayaran</h1>
            <p className="text-gray-600">Job #{booking.id}</p>
          </div>
>>>>>>> origin/jules-9588893365322302084-daabd2d3
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
<<<<<<< HEAD
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
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Layanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Masalah</span>
                <span className="font-medium">{booking.problem}</span>
              </div>
              <div className="flex justify-between">
                <span>Kendaraan</span>
                <span className="font-medium">{booking.vehicle.brand} {booking.vehicle.model}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Biaya</span>
                <span className="text-blue-600">{formatCurrency(booking.estimatedCost)}</span>
              </div>
            </CardContent>
          </Card>
          
          {paymentStatus === 'pending' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Pilih Metode Pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {paymentMethods.map((method) => {
                    const MethodIcon = method.icon;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-4 border rounded-xl cursor-pointer transition-all ${
                          selectedMethod === method.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${selectedMethod === method.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                              <MethodIcon className="h-6 w-6" />
                            </div>
                            <span className="font-medium">{method.name}</span>
                          </div>
                          {method.fee > 0 && <span className="text-xs text-gray-500">+{formatCurrency(method.fee)}</span>}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
              <Button 
                onClick={handlePayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 rounded-xl shadow-lg"
                disabled={!selectedMethod}
              >
                Bayar Sekarang
              </Button>
            </>
          )}
          
          {paymentStatus === 'processing' && (
            <Card className="p-12 text-center">
               <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
               <h3 className="text-xl font-bold">Memproses Pembayaran...</h3>
            </Card>
          )}

          {paymentStatus === 'completed' && (
            <Card className="p-12 text-center space-y-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <h3 className="text-2xl font-bold text-green-900">Pembayaran Berhasil!</h3>
              <p className="text-gray-600">Terima kasih telah mempercayai Oke Mekanik.</p>
              <div className="pt-4 space-y-2">
                 <Button className="w-full bg-blue-600" onClick={() => navigate('/customer/dashboard')}>
                   Kembali ke Dashboard
                 </Button>
                 <Button variant="outline" className="w-full">
                   Unduh Invoice
                 </Button>
              </div>
            </Card>
          )}
        </div>
>>>>>>> origin/jules-9588893365322302084-daabd2d3
      </div>
    </div>
  );
};

export default PaymentPage;
