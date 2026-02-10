import { useState } from 'react';
import { CreditCard, Wallet, Building, QrCode, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  const bookingId = searchParams.get('bookingId') || '1';

  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');

  const booking: BookingData = {
    id: bookingId,
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
    paymentMutation.mutate(selectedMethod);
  };

  if (paymentStatus === 'completed') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-10 text-center space-y-8 bg-white/5 border-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-green-500/5 pointer-events-none" />
          <div className="bg-green-500/20 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <CheckCircle className="h-14 w-14 text-green-400" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">TRANSAKSI SUKSES!</h2>
            <p className="text-gray-400">Pembayaran digital Anda telah dikonfirmasi oleh sistem.</p>
          </div>
          <div className="space-y-4 pt-4">
            <Button
              onClick={() => navigate('/customer/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-500 h-14 text-lg font-black rounded-2xl shadow-lg shadow-blue-500/20"
            >
              KEMBALI KE DASHBOARD
            </Button>
            <Button variant="ghost" className="text-gray-500 hover:text-white hover:bg-white/5 w-full font-bold">
              UNDUH INVOICE DIGITAL
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
      </div>

      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-white/10 text-white rounded-xl h-10 w-10"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">PEMBAYARAN DIGITAL</h1>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">SECURE LAYER ACTIVE</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-600 to-transparent" />
            <CardHeader>
              <CardTitle className="text-white text-xl font-bold flex items-center tracking-tight">
                RINGKASAN LAYANAN
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Pekerjaan</span>
                  <span className="text-white font-medium">{booking.problem}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Unit Kendaraan</span>
                  <span className="text-white font-medium">{booking.vehicle.brand} {booking.vehicle.model}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Identitas Plat</span>
                  <span className="text-white font-medium">{booking.vehicle.licensePlate}</span>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 mt-2 flex justify-between items-center">
                <span className="text-gray-300 font-bold uppercase tracking-widest text-xs">Total Transaksi</span>
                <span className="text-3xl font-black text-blue-400 tracking-tighter">{formatCurrency(booking.estimatedCost)}</span>
              </div>
            </CardContent>
          </Card>
          
          {paymentStatus === 'pending' && (
            <>
              <Card className="bg-white/5 border-white/10 backdrop-blur-2xl rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="text-white text-xl font-bold tracking-tight">METODE PEMBAYARAN</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {paymentMethods.map((method) => {
                    const MethodIcon = method.icon;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                          selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/5'
                          : 'border-white/5 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl transition-colors ${selectedMethod === method.id ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400'}`}>
                              <MethodIcon className="h-6 w-6" />
                            </div>
                            <span className={`font-bold uppercase tracking-tight ${selectedMethod === method.id ? 'text-white' : 'text-gray-400'}`}>
                              {method.name}
                            </span>
                          </div>
                          {method.fee > 0 && (
                            <Badge variant="outline" className="text-[10px] text-gray-500 border-white/10">
                              FEE: {formatCurrency(method.fee)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
              <Button 
                onClick={handlePayment}
                className="w-full bg-blue-600 hover:bg-blue-500 text-xl font-black h-16 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                disabled={!selectedMethod || paymentMutation.isPending}
              >
                {paymentMutation.isPending ? 'MENGOTORISASI...' : 'KONFIRMASI PEMBAYARAN'}
              </Button>
            </>
          )}
          
          {paymentStatus === 'processing' && (
            <Card className="bg-white/5 border-white/10 backdrop-blur-2xl rounded-[2rem] p-16 text-center">
               <div className="relative inline-block">
                 <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
                 <Clock className="h-16 w-16 text-blue-500 mx-auto mb-6 animate-spin relative z-10" />
               </div>
               <h3 className="text-2xl font-black text-white italic tracking-tighter">MENYINKRONKAN DATA...</h3>
               <p className="text-gray-500 mt-2 font-mono text-sm">Please do not refresh this page</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
