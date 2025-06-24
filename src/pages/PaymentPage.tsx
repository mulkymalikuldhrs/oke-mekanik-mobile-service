
import React, { useState } from 'react';
import { CreditCard, Wallet, Building, QrCode, CheckCircle, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

const PaymentPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, completed

  const jobDetails = {
    id: 'JOB001',
    mechanic: {
      name: 'Ahmad Rizki',
      rating: 4.9,
      photo: '👨‍🔧'
    },
    service: 'Perbaikan Mesin',
    vehicle: 'Toyota Avanza 2019 - B 1234 XYZ',
    duration: '2 jam',
    completedAt: '16:30',
    costs: {
      service: 150000,
      parts: 50000,
      tax: 20000,
      total: 220000
    }
  };

  const paymentMethods = [
    {
      id: 'qris',
      name: 'QRIS',
      icon: QrCode,
      description: 'Scan QR code dengan aplikasi bank/e-wallet',
      fee: 0
    },
    {
      id: 'gopay',
      name: 'GoPay',
      icon: Wallet,
      description: 'Bayar dengan saldo GoPay',
      fee: 0
    },
    {
      id: 'ovo',
      name: 'OVO',
      icon: Wallet,
      description: 'Bayar dengan saldo OVO',
      fee: 0
    },
    {
      id: 'dana',
      name: 'DANA',
      icon: Wallet,
      description: 'Bayar dengan saldo DANA',
      fee: 0
    },
    {
      id: 'bank_transfer',
      name: 'Transfer Bank',
      icon: Building,
      description: 'Transfer melalui ATM/Internet Banking',
      fee: 2500
    },
    {
      id: 'credit_card',
      name: 'Kartu Kredit',
      icon: CreditCard,
      description: 'Visa, Mastercard, JCB',
      fee: 6600 // 3% of total
    }
  ];

  const handlePayment = () => {
    if (!selectedMethod) {
      toast({
        title: "Pilih Metode Pembayaran",
        description: "Silakan pilih metode pembayaran terlebih dahulu.",
        variant: "destructive"
      });
      return;
    }

    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('completed');
      toast({
        title: "Pembayaran Berhasil! 🎉",
        description: "Terima kasih telah menggunakan layanan Oke Mekanik.",
      });
    }, 3000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderJobSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          Pekerjaan Selesai
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{jobDetails.mechanic.photo}</div>
          <div>
            <h3 className="font-semibold">{jobDetails.mechanic.name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm ml-1">{jobDetails.mechanic.rating}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Layanan:</span>
            <span className="font-medium">{jobDetails.service}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Kendaraan:</span>
            <span className="font-medium">{jobDetails.vehicle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Durasi:</span>
            <span className="font-medium">{jobDetails.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Selesai:</span>
            <span className="font-medium">{jobDetails.completedAt}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCostBreakdown = () => (
    <Card>
      <CardHeader>
        <CardTitle>Rincian Biaya</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Biaya Jasa</span>
          <span>{formatCurrency(jobDetails.costs.service)}</span>
        </div>
        <div className="flex justify-between">
          <span>Biaya Suku Cadang</span>
          <span>{formatCurrency(jobDetails.costs.parts)}</span>
        </div>
        <div className="flex justify-between">
          <span>Pajak & Biaya Admin</span>
          <span>{formatCurrency(jobDetails.costs.tax)}</span>
        </div>
        
        {selectedMethod && paymentMethods.find(m => m.id === selectedMethod)?.fee > 0 && (
          <div className="flex justify-between">
            <span>Biaya Pembayaran</span>
            <span>{formatCurrency(paymentMethods.find(m => m.id === selectedMethod)?.fee || 0)}</span>
          </div>
        )}
        
        <hr className="my-2" />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="text-green-600">
            {formatCurrency(jobDetails.costs.total + (paymentMethods.find(m => m.id === selectedMethod)?.fee || 0))}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  const renderPaymentMethods = () => (
    <Card>
      <CardHeader>
        <CardTitle>Pilih Metode Pembayaran</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {paymentMethods.map((method) => {
          const MethodIcon = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <div
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MethodIcon className="h-6 w-6 text-gray-600" />
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
                {method.fee > 0 && (
                  <Badge variant="outline" className="text-xs">
                    +{formatCurrency(method.fee)}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

  const renderPaymentProcessing = () => (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-6 text-center">
        <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Memproses Pembayaran...
        </h3>
        <p className="text-blue-700">
          Mohon tunggu, pembayaran Anda sedang diproses
        </p>
      </CardContent>
    </Card>
  );

  const renderPaymentSuccess = () => (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-6 text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-900 mb-2">
          Pembayaran Berhasil! 🎉
        </h3>
        <p className="text-green-700 mb-4">
          Terima kasih telah menggunakan layanan Oke Mekanik
        </p>
        <div className="space-y-2">
          <Button className="w-full bg-green-600 hover:bg-green-700">
            <Star className="h-4 w-4 mr-2" />
            Beri Rating Mekanik
          </Button>
          <Button variant="outline" className="w-full">
            Unduh Struk Pembayaran
          </Button>
          <Button variant="outline" className="w-full">
            Kembali ke Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Pembayaran</h1>
          <p className="text-gray-600">Job #{jobDetails.id}</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {renderJobSummary()}
          {renderCostBreakdown()}
          
          {paymentStatus === 'pending' && (
            <>
              {renderPaymentMethods()}
              <Button 
                onClick={handlePayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                disabled={!selectedMethod}
              >
                Bayar Sekarang - {formatCurrency(jobDetails.costs.total + (paymentMethods.find(m => m.id === selectedMethod)?.fee || 0))}
              </Button>
            </>
          )}
          
          {paymentStatus === 'processing' && renderPaymentProcessing()}
          {paymentStatus === 'completed' && renderPaymentSuccess()}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
