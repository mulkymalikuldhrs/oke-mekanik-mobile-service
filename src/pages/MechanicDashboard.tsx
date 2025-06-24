
import React, { useState } from 'react';
import { 
  Wrench, 
  Clock, 
  Star, 
  MapPin, 
  Phone, 
  MessageSquare, 
  CheckCircle,
  XCircle,
  Camera,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageToggle from '@/components/LanguageToggle';

const MechanicDashboard = () => {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(true);
  const [currentJob, setCurrentJob] = useState({
    id: 1,
    customer: 'Budi Santoso',
    location: 'Jl. Sudirman No. 45, Jakarta',
    issue: 'Mesin mobil mati mendadak',
    vehicle: 'Toyota Avanza 2019 - B 1234 XYZ',
    status: 'otw', // otw, arrived, working, completed
    estimatedEarning: 'Rp 200.000'
  });

  const pendingOrders = [
    {
      id: 2,
      customer: 'Siti Aminah',
      location: 'Jl. Thamrin No. 12, Jakarta',
      issue: 'Ban mobil kempes',
      vehicle: 'Honda Jazz 2020 - B 5678 ABC',
      estimatedEarning: 'Rp 100.000',
      distance: '2.5 km'
    },
    {
      id: 3,
      customer: 'Ahmad Rahman',
      location: 'Jl. Gatot Subroto No. 88, Jakarta',
      issue: 'Aki soak',
      vehicle: 'Suzuki Ertiga 2021 - B 9012 DEF',
      estimatedEarning: 'Rp 150.000',
      distance: '1.8 km'
    }
  ];

  const todayStats = {
    completedJobs: 3,
    totalEarnings: 'Rp 450.000',
    rating: 4.8,
    onlineHours: '6.5 jam'
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      otw: { label: 'Menuju Lokasi', variant: 'default' as const, color: 'bg-blue-500' },
      arrived: { label: 'Sampai Lokasi', variant: 'secondary' as const, color: 'bg-yellow-500' },
      working: { label: 'Sedang Mengerjakan', variant: 'outline' as const, color: 'bg-orange-500' },
      completed: { label: 'Selesai', variant: 'outline' as const, color: 'bg-green-500' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.otw;
  };

  const handleAcceptOrder = (orderId: number) => {
    console.log('Accepting order:', orderId);
    // Handle order acceptance logic
  };

  const handleRejectOrder = (orderId: number) => {
    console.log('Rejecting order:', orderId);
    // Handle order rejection logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-600 p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard Mekanik</h1>
              <p className="text-sm text-gray-600">Selamat datang, Ahmad Rizki!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
              <Switch checked={isOnline} onCheckedChange={setIsOnline} />
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 space-y-6">
        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{todayStats.completedJobs}</p>
              <p className="text-sm text-gray-600">Pekerjaan Selesai</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{todayStats.totalEarnings}</p>
              <p className="text-sm text-gray-600">Pendapatan Hari Ini</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{todayStats.rating}</p>
              <p className="text-sm text-gray-600">Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{todayStats.onlineHours}</p>
              <p className="text-sm text-gray-600">Jam Online</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Job */}
        {currentJob && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center text-orange-800">
                  <Wrench className="h-5 w-5 mr-2" />
                  Pekerjaan Aktif
                </div>
                <Badge className={getStatusBadge(currentJob.status).color + ' text-white'}>
                  {getStatusBadge(currentJob.status).label}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{currentJob.customer}</h3>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {currentJob.location}
                  </p>
                  <p className="text-sm mt-2"><strong>Masalah:</strong> {currentJob.issue}</p>
                  <p className="text-sm"><strong>Kendaraan:</strong> {currentJob.vehicle}</p>
                </div>
                <div className="flex flex-col justify-between">
                  <p className="text-lg font-semibold text-green-600">{currentJob.estimatedEarning}</p>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Telepon
                    </Button>
                    <Button size="sm">
                      <Camera className="h-4 w-4 mr-1" />
                      Foto
                    </Button>
                  </div>
                </div>
              </div>
              
              {currentJob.status === 'working' && (
                <div className="flex justify-center">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Selesai Pekerjaan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pending Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Pesanan Masuk ({pendingOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{order.customer}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {order.location}
                    </p>
                    <p className="text-sm mt-2"><strong>Masalah:</strong> {order.issue}</p>
                    <p className="text-sm"><strong>Kendaraan:</strong> {order.vehicle}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline">{order.distance}</Badge>
                      <span className="text-lg font-semibold text-green-600">{order.estimatedEarning}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleRejectOrder(order.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Tolak
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleAcceptOrder(order.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Terima
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MechanicDashboard;
