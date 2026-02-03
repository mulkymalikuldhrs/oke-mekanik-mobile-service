
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, MessageSquare, Camera, Star, CheckCircle, AlertCircle, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Progress } from '@/components/ui/progress';

const TrackingPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => api.getBookingById(bookingId!),
    enabled: !!bookingId,
    refetchInterval: 3000,
  });

  const statusSteps = [
    { key: 'pending', label: 'Menunggu', icon: Clock, color: 'bg-gray-500' },
    { key: 'accepted', label: 'Diterima', icon: CheckCircle, color: 'bg-blue-500' },
    { key: 'otw', label: 'Menuju Lokasi', icon: Navigation, color: 'bg-indigo-500' },
    { key: 'arrived', label: 'Sampai', icon: MapPin, color: 'bg-yellow-500' },
    { key: 'working', label: 'Dikerjakan', icon: Clock, color: 'bg-orange-500' },
    { key: 'completed', label: 'Selesai', icon: CheckCircle, color: 'bg-green-500' }
  ];

  const getCurrentStepIndex = () => {
    if (!booking) return 0;
    return statusSteps.findIndex(step => step.key === booking.status);
  };

  const getProgress = () => {
    const index = getCurrentStepIndex();
    return ((index + 1) / statusSteps.length) * 100;
  };

  if (isLoading) return <div className="p-8 text-center">Memuat pelacakan...</div>;
  if (!booking) return <div className="p-8 text-center">Pesanan tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tracking Job #{booking.id}</h1>
            <p className="text-gray-600">Pantau progress pekerjaan secara real-time</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>Kembali</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Live Tracking
              </div>
              <Badge className={`${statusSteps[getCurrentStepIndex()].color} text-white uppercase`}>
                {booking.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Peta Lokasi Real-time</p>
              </div>
              <div className="z-10 text-center">
                <div className="bg-white p-3 rounded-full shadow-lg inline-block mb-2">
                  <Navigation className="h-8 w-8 text-blue-600 animate-bounce" />
                </div>
                <p className="font-semibold text-blue-900">
                  {booking.status === 'otw' ? 'Mekanik sedang dalam perjalanan' : 'Update status real-time'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Pekerjaan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <Progress value={getProgress()} className="h-2" />
             <div className="grid grid-cols-6 gap-1">
                {statusSteps.map((step, index) => {
                  const isActive = index <= getCurrentStepIndex();
                  const StepIcon = step.icon;
                  return (
                    <div key={step.key} className="text-center">
                      <div className={`mx-auto w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 ${
                        isActive ? step.color : 'bg-gray-100 text-gray-400'
                      } ${isActive ? 'text-white' : ''}`}>
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <p className={`text-[8px] md:text-[10px] font-medium ${
                        isActive ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Layanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">👨‍🔧</div>
                <div>
                  <h3 className="font-semibold text-lg">Mekanik ID: {booking.mechanicId}</h3>
                  <Badge variant="outline">Verified Professional</Badge>
                </div>
              </div>
              <div className="space-y-2 border-t pt-4">
                <p><strong>Kendaraan:</strong> {booking.vehicle.brand} {booking.vehicle.model}</p>
                <p><strong>Masalah:</strong> {booking.problem}</p>
                <p><strong>Biaya:</strong> Rp {booking.estimatedCost}</p>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => navigate(`/customer/chat?bookingId=${booking.id}`)}>
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
                  🚨 SOS - Butuh Bantuan
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
