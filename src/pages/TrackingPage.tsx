import { useState, useEffect } from 'react';
import { MapPin, Phone, MessageSquare, CheckCircle, AlertCircle, Navigation, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '@/lib/api';

const statusSteps = [
  { key: 'pending', label: 'Pending', icon: AlertCircle, color: 'bg-gray-500' },
  { key: 'accepted', label: 'Diterima', icon: CheckCircle, color: 'bg-blue-500' },
  { key: 'otw', label: 'Perjalanan', icon: Navigation, color: 'bg-orange-500' },
  { key: 'working', label: 'Pengerjaan', icon: MapPin, color: 'bg-yellow-500' },
  { key: 'completed', label: 'Selesai', icon: CheckCircle, color: 'bg-green-500' },
];

const TrackingPage = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingApi.getById(id || ''),
    enabled: !!id,
    refetchInterval: 3000,
  });

  const getCurrentStepIndex = () => {
    if (!booking) return 0;
    const statusIndex = statusSteps.findIndex(s => s.key === booking.status);
    return statusIndex >= 0 ? statusIndex : 0;
  };

  const getProgress = () => {
    const currentIndex = getCurrentStepIndex();
    return ((currentIndex + 1) / statusSteps.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Memuat data...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Gagal memuat data booking</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b p-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Lacak Pesanan</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Map Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Lokasi Mekanik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Peta Lokasi</p>
              </div>
              <div className="z-10 text-center">
                <div className="bg-white p-3 rounded-full shadow-lg inline-block mb-2">
                  <Navigation className="h-8 w-8 text-blue-600 animate-bounce" />
                </div>
                <p className="font-semibold text-blue-900">
                  {booking.status === 'otw' ? 'Mekanik sedang dalam perjalanan' : 'Menunggu update'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Status Pekerjaan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={getProgress()} className="h-2" />
            <div className="grid grid-cols-5 gap-1">
              {statusSteps.map((step, index) => {
                const isActive = index <= getCurrentStepIndex();
                const StepIcon = step.icon;
                return (
                  <div key={step.key} className="text-center">
                    <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-2 ${isActive ? step.color : 'bg-gray-100'} ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium">{step.label}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Info and Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Layanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">👨‍🔧</div>
                <div>
                  <h3 className="font-semibold text-lg">Mekanik</h3>
                  <Badge variant="outline">Professional</Badge>
                </div>
              </div>
              <div className="space-y-2 border-t pt-4">
                <p><strong>Kendaraan:</strong> {booking.vehicle?.brand} {booking.vehicle?.model}</p>
                <p><strong>Masalah:</strong> {booking.problem}</p>
                <p><strong>Biaya:</strong> Rp {booking.estimatedCost?.toLocaleString()}</p>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => navigate(`/customer/chat/${booking.id}`)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Telepon
                </Button>
              </div>
            </CardContent>
          </Card>

          {booking.status === 'completed' ? (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Selesai! 🎉</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <p className="text-green-800 font-semibold">Perbaikan Selesai</p>
                </div>
                <Button className="w-full bg-green-600" onClick={() => navigate(`/customer/payment?bookingId=${booking.id}`)}>
                  Lanjut ke Pembayaran
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Butuh Bantuan
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <Card className="rounded-none border-t">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium">Layanan Aman & Terjamin</span>
            </div>
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              {booking.vehicle?.brand} • {booking.vehicle?.licensePlate}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingPage;
