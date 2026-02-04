
<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, MessageSquare, Car, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
=======
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/components/LoadingSpinner';
import ErrorDisplay from '@/components/ui/components/ErrorDisplay';
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
import { MapPin, Clock, Phone, MessageSquare, Camera, Star, CheckCircle, AlertCircle, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Progress } from '@/components/ui/progress';
>>>>>>> origin/jules-9588893365322302084-daabd2d3

/**
 * Fetches the tracking data for a specific job from the API.
 * @param {string | undefined} id The ID of the job to track.
 * @returns {Promise<any>} A promise that resolves to the tracking data.
 */
const fetchTrackingData = async (id: string | undefined) => {
  if (!id) throw new Error("No tracking ID provided");
  const response = await fetch(`http://localhost:3001/bookings/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

/**
 * Renders the tracking page, displaying the real-time status of a service request.
 */
const TrackingPage = () => {
<<<<<<< HEAD
<<<<<<< HEAD
  const navigate = useNavigate();
  const [progress, setProgress] = useState(35);
  const [eta, setEta] = useState(12);
  const [distance, setDistance] = useState(2.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
      setEta((prev) => (prev > 1 ? prev - 0.1 : 1));
      setDistance((prev) => (prev > 0.1 ? prev - 0.02 : 0.1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white p-4 border-b flex items-center shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Lacak Mekanik</h1>
      </header>

      {/* Map Area (Simulated) */}
      <div className="flex-1 bg-blue-50 relative overflow-hidden">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full border-[20px] border-blue-200 grid grid-cols-12 grid-rows-12">
            {[...Array(144)].map((_, i) => (
              <div key={i} className="border border-blue-100" />
            ))}
          </div>
        </div>

        {/* Animated Path */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
           <div className="w-full max-w-lg relative h-64 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center">
              {/* Destination */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 p-2 rounded-full shadow-lg z-10">
                <MapPin className="h-6 w-6 text-white" />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded text-[10px] font-bold shadow whitespace-nowrap">Lokasi Anda</div>
              </div>

              {/* Mechanic Icon moving on path */}
              <div
                className="absolute bg-blue-600 p-3 rounded-full shadow-xl transition-all duration-1000 ease-linear z-20"
                style={{
                  left: `${50 + 45 * Math.cos((progress * 2 * Math.PI) / 100)}%`,
                  top: `${50 + 45 * Math.sin((progress * 2 * Math.PI) / 100)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <Car className="h-6 w-6 text-white" />
              </div>
           </div>
        </div>

        {/* Floating Info */}
        <div className="absolute bottom-6 left-6 right-6">
          <Card className="shadow-2xl border-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl">👨‍🔧</div>
                  <div>
                    <h3 className="font-bold">Ahmad Rizki</h3>
                    <p className="text-xs text-gray-500">Mekanik Terverifikasi</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="icon" variant="outline" className="rounded-full h-10 w-10 border-blue-200 text-blue-600">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full h-10 w-10 border-blue-200 text-blue-600">
                    <Phone className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Estimasi Tiba</span>
                  <span className="font-bold text-blue-600">{Math.ceil(eta)} Menit</span>
                </div>
                <Progress value={progress} className="h-2 bg-blue-100" />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Mekanik berangkat</span>
                  <span>{distance.toFixed(1)} km lagi</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
=======
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ['tracking', id],
    queryFn: () => fetchTrackingData(id),
    refetchInterval: 5000, // Refetch every 5 seconds for live tracking feel
  });

  const statusSteps = [
    { key: 'Scheduled', label: 'Dijadwalkan', icon: Clock, color: 'bg-gray-500' },
    { key: 'In Progress', label: 'Sedang Dikerjakan', icon: Clock, color: 'bg-orange-500' },
    { key: 'Completed', label: 'Selesai', icon: CheckCircle, color: 'bg-green-500' }
  ];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error.message} />;

  const { status, estimatedCompletion } = data;
  const currentStatusIndex = statusSteps.findIndex(step => step.key === status);
=======
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
>>>>>>> origin/jules-9588893365322302084-daabd2d3

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
<<<<<<< HEAD
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Tracking Job #{id}</h1>
          <p className="text-gray-600">Pantau progress pekerjaan secara real-time</p>
=======
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tracking Job #{booking.id}</h1>
            <p className="text-gray-600">Pantau progress pekerjaan secara real-time</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>Kembali</Button>
>>>>>>> origin/jules-9588893365322302084-daabd2d3
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
<<<<<<< HEAD
                Status Saat Ini
              </div>
              <Badge className={`${statusSteps[currentStatusIndex]?.color || 'bg-gray-500'} text-white`}>
                {status}
=======
                Live Tracking
              </div>
              <Badge className={`${statusSteps[getCurrentStepIndex()].color} text-white uppercase`}>
                {booking.status}
>>>>>>> origin/jules-9588893365322302084-daabd2d3
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Live map coming soon</p>
              </div>
            </div>

            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const isActive = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const StepIcon = step.icon;

                return (
                  <div key={step.key} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? step.color : 'bg-gray-300'
                    } text-white`}>
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-700'}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {estimatedCompletion && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-blue-800 font-semibold">
                  Estimasi Selesai
                </p>
                <p className="text-blue-600 text-lg">
                  {new Date(estimatedCompletion).toLocaleTimeString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
            <p className="text-sm text-red-800">
              Butuh bantuan darurat? Hubungi customer service kami.
            </p>
          </CardContent>
        </Card>
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
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
>>>>>>> origin/jules-9588893365322302084-daabd2d3
      </div>

      {/* Footer Details */}
      <Card className="rounded-none border-t border-none shadow-none">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium">Layanan Aman & Terjamin</span>
            </div>
            <Badge variant="outline" className="text-orange-600 border-orange-200">Toyota Avanza • B 1234 ABC</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingPage;
