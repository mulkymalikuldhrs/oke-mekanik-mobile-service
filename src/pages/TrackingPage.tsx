
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, MessageSquare, Camera, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const TrackingPage = () => {
  const { t } = useLanguage();
  const [jobStatus, setJobStatus] = useState('otw'); // otw, arrived, working, completed
  const [mechanicLocation, setMechanicLocation] = useState({ lat: -6.2, lng: 106.8 });
  const [estimatedTime, setEstimatedTime] = useState(12);

  const currentJob = {
    id: 'JOB001',
    mechanic: {
      name: 'Ahmad Rizki',
      rating: 4.9,
      phone: '+62 812-3456-7890',
      photo: '👨‍🔧'
    },
    customer: {
      name: 'Budi Santoso',
      location: 'Jl. Sudirman No. 45, Jakarta',
      vehicle: 'Toyota Avanza 2019 - B 1234 XYZ',
      problem: 'Mesin mobil mati mendadak'
    },
    booking: {
      time: '14:30',
      estimatedCost: 'Rp 200.000',
      actualCost: 'Rp 180.000'
    }
  };

  const statusSteps = [
    { key: 'otw', label: 'Menuju Lokasi', icon: MapPin, color: 'bg-blue-500' },
    { key: 'arrived', label: 'Sampai Lokasi', icon: CheckCircle, color: 'bg-yellow-500' },
    { key: 'working', label: 'Sedang Mengerjakan', icon: Clock, color: 'bg-orange-500' },
    { key: 'completed', label: 'Selesai', icon: CheckCircle, color: 'bg-green-500' }
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === jobStatus);
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (jobStatus === 'otw' && estimatedTime > 0) {
        setEstimatedTime(prev => Math.max(0, prev - 1));
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [jobStatus, estimatedTime]);

  const renderTrackingMap = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Live Tracking
          </div>
          <Badge className={`${statusSteps[getCurrentStepIndex()].color} text-white`}>
            {statusSteps[getCurrentStepIndex()].label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Map placeholder - in real app, integrate with Google Maps or similar */}
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Peta Real-time</p>
            <p className="text-sm text-gray-500">Lokasi mekanik akan tampil di sini</p>
          </div>
        </div>
        
        {jobStatus === 'otw' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-semibold">
              📍 {currentJob.mechanic.name} sedang menuju lokasi Anda
            </p>
            <p className="text-blue-600 text-sm">
              Estimasi tiba: {estimatedTime} menit
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderProgressSteps = () => (
    <Card>
      <CardHeader>
        <CardTitle>Status Pekerjaan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const isActive = index <= getCurrentStepIndex();
            const isCurrent = step.key === jobStatus;
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
                  {isCurrent && (
                    <p className="text-sm text-gray-600">
                      {step.key === 'otw' && `ETA: ${estimatedTime} menit`}
                      {step.key === 'arrived' && 'Mekanik telah sampai di lokasi'}
                      {step.key === 'working' && 'Sedang memperbaiki kendaraan'}
                      {step.key === 'completed' && 'Pekerjaan telah selesai'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const renderMechanicInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Mekanik</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-4xl">{currentJob.mechanic.photo}</div>
          <div>
            <h3 className="font-semibold text-lg">{currentJob.mechanic.name}</h3>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm">{currentJob.mechanic.rating}</span>
              <Badge variant="outline">Verified</Badge>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Kendaraan</p>
            <p className="font-medium">{currentJob.customer.vehicle}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Masalah</p>
            <p className="font-medium">{currentJob.customer.problem}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Estimasi Biaya</p>
            <p className="font-medium text-green-600">{currentJob.booking.estimatedCost}</p>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-6">
          <Button variant="outline" className="flex-1">
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
  );

  const renderEmergencyButton = () => (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-4">
        <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
          <AlertCircle className="h-4 w-4 mr-2" />
          🚨 SOS - Kirim Lokasi Darurat
        </Button>
        <p className="text-xs text-red-600 mt-2 text-center">
          Kirim lokasi & pesan darurat ke kontak emergency
        </p>
      </CardContent>
    </Card>
  );

  const renderJobCompletion = () => (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-800">Pekerjaan Selesai! 🎉</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <p className="text-green-800 font-semibold">
            Kendaraan Anda telah diperbaiki!
          </p>
          <p className="text-green-600">
            Total biaya: {currentJob.booking.actualCost}
          </p>
        </div>
        
        <div className="space-y-2">
          <Button className="w-full bg-green-600 hover:bg-green-700">
            <Star className="h-4 w-4 mr-2" />
            Beri Rating & Ulasan
          </Button>
          <Button variant="outline" className="w-full">
            <Camera className="h-4 w-4 mr-2" />
            Lihat Foto Sebelum/Sesudah
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Tracking Job #{currentJob.id}</h1>
          <p className="text-gray-600">Pantau progress pekerjaan secara real-time</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {renderTrackingMap()}
        
        <div className="grid md:grid-cols-2 gap-6">
          {renderProgressSteps()}
          {renderMechanicInfo()}
        </div>
        
        {jobStatus !== 'completed' && renderEmergencyButton()}
        
        {jobStatus === 'completed' && renderJobCompletion()}
      </div>
    </div>
  );
};

export default TrackingPage;
