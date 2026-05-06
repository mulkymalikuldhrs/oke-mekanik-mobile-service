import { useState } from 'react';
<<<<<<< HEAD
import { CreditCard, Wallet, Building, QrCode, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { paymentApi } from '@/lib/api';

interface BookingData {
  id: number;
  problem: string;
  vehicle: {
    brand: string;
    model: string;
    licensePlate: string;
  };
  estimatedCost: number;
}
=======
import { CreditCard, Wallet, Building, QrCode, CheckCircle, Clock, ArrowLeft, ShieldCheck, ReceiptText, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentApi, bookingApi } from '@/lib/api';
>>>>>>> jules-1751083910730374172-8e0c37a0

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  fee: number;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const paymentMethods: PaymentMethod[] = [
  { id: 'qris', name: 'QRIS', icon: QrCode, fee: 0 },
  { id: 'gopay', name: 'GoPay', icon: Wallet, fee: 0 },
  { id: 'bank_transfer', name: 'Transfer Bank', icon: Building, fee: 2500 },
  { id: 'credit_card', name: 'Kartu Kredit', icon: CreditCard, fee: 3000 },
];

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
<<<<<<< HEAD
=======
  const { t } = useLanguage();
>>>>>>> jules-1751083910730374172-8e0c37a0
  const bookingId = searchParams.get('bookingId');

  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');

<<<<<<< HEAD
  const booking: BookingData = {
    id: Number(bookingId) || 1,
    problem: 'Servis Berkala + Ganti Oli',
    vehicle: {
      brand: 'Toyota',
      model: 'Avanza',
      licensePlate: 'B 1234 CD',
    },
    estimatedCost: 150000,
  };

  const paymentMutation = useMutation({
    mutationFn: async (method: string) => {
      return paymentApi.create({
        bookingId: booking.id,
        amount: booking.estimatedCost,
=======
  const { data: booking, isLoading: isLoadingBooking, error: bookingError } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingApi.getById(bookingId || ''),
    enabled: !!bookingId,
  });

  const paymentMutation = useMutation({
    mutationFn: async (method: string) => {
      if (!booking) throw new Error('Booking not found');
      return paymentApi.create({
        bookingId: booking.id,
        amount: booking.estimatedCost || 0,
>>>>>>> jules-1751083910730374172-8e0c37a0
        paymentMethod: method,
        status: 'completed',
      });
    },
    onSuccess: () => {
      setPaymentStatus('completed');
      toast({
        title: 'Pembayaran Berhasil',
        description: 'Terima kasih telah menggunakan Oke Mekanik',
      });
    },
    onError: () => {
<<<<<<< HEAD
=======
      setPaymentStatus('pending');
>>>>>>> jules-1751083910730374172-8e0c37a0
      toast({
        title: 'Pembayaran Gagal',
        description: 'Silakan coba lagi atau gunakan metode lain',
        variant: 'destructive',
      });
    },
  });

  const handlePayment = () => {
    if (!selectedMethod) {
      toast({
        title: 'Pilih Metode',
        description: 'Silakan pilih metode pembayaran terlebih dahulu',
        variant: 'destructive',
      });
      return;
    }
    setPaymentStatus('processing');
    paymentMutation.mutate(selectedMethod);
  };

<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Pembayaran</h1>
=======
  if (isLoadingBooking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoaderCircle className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (bookingError || !booking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <Card className="max-w-md bg-white/5 border-white/10 backdrop-blur-[160px]">
          <CardContent className="p-8 text-center">
            <ReceiptText className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white italic tracking-tighter mb-2 uppercase">{t('payment.error_not_found')}</h2>
            <p className="text-gray-400 mb-6 font-medium">{t('payment.error_desc')}</p>
            <Button className="w-full bg-blue-600 font-bold" onClick={() => navigate(-1)}>{t('booking.back')}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <header className="bg-black/40 backdrop-blur-[160px] border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">{t('payment.title')}</h1>
          </div>
          <div className="flex items-center text-blue-400 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4 mr-2" />
            {t('payment.secure_checkout')}
>>>>>>> jules-1751083910730374172-8e0c37a0
          </div>
        </div>
      </header>

<<<<<<< HEAD
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
              <div className="flex justify-between">
                <span>Plat Nomor</span>
                <span className="font-medium">{booking.vehicle.licensePlate}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Biaya</span>
                <span className="text-blue-600">{formatCurrency(booking.estimatedCost)}</span>
=======
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-[160px] shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-black italic tracking-tight uppercase">
                <ReceiptText className="h-5 w-5 mr-3 text-blue-400" />
                {t('payment.summary_title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">{t('payment.label_problem')}</span>
                <span className="text-right font-bold">{booking.problem}</span>
                <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">{t('payment.label_vehicle')}</span>
                <span className="text-right font-bold text-blue-400">{booking.vehicle?.brand} {booking.vehicle?.model}</span>
                <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">{t('payment.label_order_id')}</span>
                <span className="text-right font-bold">{booking.id}</span>
              </div>
              <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                <span className="text-lg font-black italic tracking-tighter uppercase">{t('payment.total_cost')}</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  {formatCurrency(booking.estimatedCost || 0)}
                </span>
>>>>>>> jules-1751083910730374172-8e0c37a0
              </div>
            </CardContent>
          </Card>
          
          {paymentStatus === 'pending' && (
            <>
<<<<<<< HEAD
              <Card>
                <CardHeader>
                  <CardTitle>Pilih Metode Pembayaran</CardTitle>
=======
              <Card className="bg-white/5 border-white/10 backdrop-blur-[160px] shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-black italic tracking-tight uppercase">{t('payment.methods_title')}</CardTitle>
                  <CardDescription className="text-gray-400 italic font-medium">{t('payment.methods_desc')}</CardDescription>
>>>>>>> jules-1751083910730374172-8e0c37a0
                </CardHeader>
                <CardContent className="space-y-3">
                  {paymentMethods.map((method) => {
                    const MethodIcon = method.icon;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
<<<<<<< HEAD
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
=======
                        className={`p-4 border rounded-2xl cursor-pointer transition-all duration-300 group ${
                          selectedMethod === method.id
                            ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                            : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl transition-colors ${
                              selectedMethod === method.id ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'
                            }`}>
                              <MethodIcon className="h-6 w-6" />
                            </div>
                            <span className={`font-black uppercase tracking-tight ${selectedMethod === method.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                              {method.name}
                            </span>
                          </div>
                          {method.fee > 0 && (
                            <span className="text-[10px] font-black text-gray-500 bg-black/40 px-2 py-1 rounded-lg">
                              +{formatCurrency(method.fee)}
                            </span>
                          )}
>>>>>>> jules-1751083910730374172-8e0c37a0
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
              <Button 
                onClick={handlePayment}
<<<<<<< HEAD
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 rounded-xl shadow-lg"
                disabled={!selectedMethod || paymentMutation.isPending}
              >
                {paymentMutation.isPending ? 'Memproses...' : 'Bayar Sekarang'}
=======
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xl py-8 rounded-2xl shadow-2xl shadow-blue-500/20 transition-all active:scale-[0.98]"
                disabled={!selectedMethod || paymentMutation.isPending}
              >
                {paymentMutation.isPending ? t('payment.processing') : t('payment.btn_pay')}
>>>>>>> jules-1751083910730374172-8e0c37a0
              </Button>
            </>
          )}
          
          {paymentStatus === 'processing' && (
<<<<<<< HEAD
            <Card className="p-12 text-center">
               <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
               <h3 className="text-xl font-bold">Memproses Pembayaran...</h3>
=======
            <Card className="bg-white/5 border-white/10 backdrop-blur-[160px] p-16 text-center shadow-2xl">
               <div className="relative inline-block mb-6">
                 <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                 <LoaderCircle className="h-20 w-20 text-blue-500 relative animate-spin" />
               </div>
               <h3 className="text-3xl font-black italic tracking-tighter uppercase">{t('payment.processing')}</h3>
               <p className="text-gray-400 mt-2 font-medium italic">{t('payment.processing_desc')}</p>
>>>>>>> jules-1751083910730374172-8e0c37a0
            </Card>
          )}

          {paymentStatus === 'completed' && (
<<<<<<< HEAD
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
=======
            <Card className="bg-white/5 border-white/10 backdrop-blur-[160px] p-16 text-center space-y-8 shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />
              <div className="bg-green-500/20 p-8 rounded-full w-fit mx-auto shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <CheckCircle className="h-20 w-20 text-green-500" />
              </div>
              <div>
                <h3 className="text-5xl font-black italic tracking-tighter uppercase text-green-500 mb-2">{t('payment.success_title')}</h3>
                <p className="text-gray-300 font-medium italic">{t('payment.success_desc')}</p>
              </div>
              <div className="pt-8 space-y-3">
                 <Button
                   className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black h-16 rounded-2xl text-xl shadow-xl shadow-blue-500/20"
                   onClick={() => navigate('/customer/dashboard')}
                 >
                   {t('payment.btn_dashboard')}
                 </Button>
                 <Button variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest h-12 text-xs">
                   {t('payment.btn_invoice')}
>>>>>>> jules-1751083910730374172-8e0c37a0
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
