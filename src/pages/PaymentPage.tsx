import { useState } from 'react';
import { CreditCard, Wallet, Building, QrCode, CheckCircle, Clock, ArrowLeft, ShieldCheck, ReceiptText, LoaderCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentApi, bookingApi } from '@/lib/api';

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
  const bookingId = searchParams.get('bookingId');

  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');

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
      setPaymentStatus('pending');
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
        <Card className="max-w-md bg-white/5 border-white/10 backdrop-blur-2xl">
          <CardContent className="p-8 text-center">
            <ReceiptText className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white italic tracking-tighter mb-2 uppercase">DATA TAGIHAN TIDAK DITEMUKAN</h2>
            <p className="text-gray-400 mb-6 font-medium">Gagal memuat rincian pembayaran untuk pesanan ini.</p>
            <Button className="w-full bg-blue-600 font-bold" onClick={() => navigate(-1)}>KEMBALI</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <header className="bg-black/40 backdrop-blur-[40px] border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">PEMBAYARAN</h1>
          </div>
          <div className="flex items-center text-blue-400 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Secure Checkout
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <Card className="glass-card shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-black italic tracking-tight uppercase">
                <ReceiptText className="h-5 w-5 mr-3 text-blue-400" />
                RINGKASAN LAYANAN
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Masalah</span>
                <span className="text-right font-bold">{booking.problem}</span>
                <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Kendaraan</span>
                <span className="text-right font-bold text-blue-400">{booking.vehicle?.brand} {booking.vehicle?.model}</span>
                <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">ID Pesanan</span>
                <span className="text-right font-bold">{booking.id}</span>
              </div>
              <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                <span className="text-lg font-black italic tracking-tighter uppercase">TOTAL BIAYA</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  {formatCurrency(booking.estimatedCost || 0)}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <AnimatePresence mode="wait">
          {paymentStatus === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="glass-card shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-black italic tracking-tight uppercase">PILIH METODE PEMBAYARAN</CardTitle>
                  <CardDescription className="text-gray-400 italic font-medium">Transaksi aman dan terenkripsi menggunakan sistem Oke Mekanik.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {paymentMethods.map((method) => {
                    const MethodIcon = method.icon;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
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
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
              <Button 
                onClick={handlePayment}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xl py-8 rounded-2xl shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] italic tracking-tight"
                disabled={!selectedMethod || paymentMutation.isPending}
              >
                {paymentMutation.isPending ? 'MEMPROSES...' : 'BAYAR SEKARANG'}
              </Button>
            </motion.div>
          )}
          
          {paymentStatus === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
            <Card className="glass-card p-16 text-center shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 animate-shimmer opacity-20" />
               <div className="relative inline-block mb-6">
                 <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                 <LoaderCircle className="h-20 w-20 text-blue-500 relative animate-spin" />
               </div>
               <h3 className="text-3xl font-black italic tracking-tighter uppercase relative z-10">MEMPROSES PEMBAYARAN...</h3>
               <p className="text-gray-400 mt-2 font-medium italic relative z-10">Mohon jangan tutup halaman ini sampai konfirmasi selesai.</p>
            </Card>
            </motion.div>
          )}

          {paymentStatus === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
            <Card className="glass-card p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />
              <div className="bg-green-500/20 p-8 rounded-full w-fit mx-auto shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <CheckCircle className="h-20 w-20 text-green-500" />
              </div>
              <div>
                <h3 className="text-5xl font-black italic tracking-tighter uppercase text-green-500 mb-2">BERHASIL!</h3>
                <p className="text-gray-300 font-medium italic">Terima kasih telah mempercayai Oke Mekanik. Kendaraan Anda masa depan Anda.</p>
              </div>
              <div className="pt-8 space-y-3">
                 <Button
                   className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black h-16 rounded-2xl text-xl shadow-xl shadow-blue-500/20"
                   onClick={() => navigate('/customer/dashboard')}
                 >
                   DASHBOARD
                 </Button>
                 <Button variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest h-12 text-xs">
                   UNDUH INVOICE RESMI (PDF)
                 </Button>
              </div>
            </Card>
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;
