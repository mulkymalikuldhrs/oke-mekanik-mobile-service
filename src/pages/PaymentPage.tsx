import { useState } from 'react';
import { CreditCard, Wallet, Building, QrCode, CheckCircle, Clock, ArrowLeft, ShieldCheck, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { paymentApi } from '@/lib/api';

interface BookingData {
  id: string;
  problem: string;
  vehicle: {
    brand: string;
    model: string;
    licensePlate: string;
  };
  estimatedCost: number;
}

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

  const booking: BookingData = {
    id: bookingId || '1',
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
    // Simulate processing time
    setTimeout(() => {
      paymentMutation.mutate(selectedMethod);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
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
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-2xl shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-black italic tracking-tight uppercase">
                <ReceiptText className="h-5 w-5 mr-3 text-blue-400" />
                RINGKASAN LAYANAN
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-gray-400">Masalah</span>
                <span className="text-right font-bold">{booking.problem}</span>
                <span className="text-gray-400">Kendaraan</span>
                <span className="text-right font-bold text-blue-400">{booking.vehicle.brand} {booking.vehicle.model}</span>
                <span className="text-gray-400">Plat Nomor</span>
                <span className="text-right font-bold">{booking.vehicle.licensePlate}</span>
              </div>
              <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                <span className="text-lg font-black italic tracking-tighter uppercase">TOTAL BIAYA</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  {formatCurrency(booking.estimatedCost)}
                </span>
              </div>
            </CardContent>
          </Card>
          
          {paymentStatus === 'pending' && (
            <>
              <Card className="bg-white/5 border-white/10 backdrop-blur-2xl shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-black italic tracking-tight uppercase">PILIH METODE PEMBAYARAN</CardTitle>
                  <CardDescription className="text-gray-400 italic">Transaksi aman dan terenkripsi</CardDescription>
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
                            <span className={`font-bold uppercase tracking-tight ${selectedMethod === method.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                              {method.name}
                            </span>
                          </div>
                          {method.fee > 0 && (
                            <span className="text-xs font-bold text-gray-500 bg-black/40 px-2 py-1 rounded-lg">
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
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xl py-8 rounded-2xl shadow-2xl shadow-blue-500/20 transition-all active:scale-[0.98]"
                disabled={!selectedMethod || paymentMutation.isPending}
              >
                {paymentMutation.isPending ? 'MEMPROSES...' : 'BAYAR SEKARANG'}
              </Button>
            </>
          )}
          
          {paymentStatus === 'processing' && (
            <Card className="bg-white/5 border-white/10 backdrop-blur-2xl p-16 text-center shadow-2xl">
               <Clock className="h-16 w-16 text-blue-500 mx-auto mb-6 animate-spin" />
               <h3 className="text-2xl font-black italic tracking-tighter uppercase">MEMPROSES PEMBAYARAN...</h3>
               <p className="text-gray-400 mt-2">Mohon jangan tutup halaman ini</p>
            </Card>
          )}

          {paymentStatus === 'completed' && (
            <Card className="bg-white/5 border-white/10 backdrop-blur-2xl p-16 text-center space-y-8 shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
              <div className="bg-green-500/20 p-6 rounded-full w-fit mx-auto">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <div>
                <h3 className="text-4xl font-black italic tracking-tighter uppercase text-green-500">BERHASIL!</h3>
                <p className="text-gray-300 mt-2 font-medium italic">Terima kasih telah mempercayai Oke Mekanik masa depan.</p>
              </div>
              <div className="pt-8 space-y-3">
                 <Button
                   className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black h-14 rounded-xl text-lg shadow-xl shadow-blue-500/20"
                   onClick={() => navigate('/customer/dashboard')}
                 >
                   DASHBOARD
                 </Button>
                 <Button variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-white/5 font-bold h-12">
                   UNDUH INVOICE (PDF)
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
