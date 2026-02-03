
import React, { useState } from 'react';
import { CreditCard, Wallet, Building, QrCode, CheckCircle, Clock, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

const PaymentPage = () => {
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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
      </div>
    </div>
  );
};

export default PaymentPage;
