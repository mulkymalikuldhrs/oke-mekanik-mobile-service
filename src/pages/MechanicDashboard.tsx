
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import LoadingSpinner from '@/components/ui/components/LoadingSpinner';
import ErrorDisplay from '@/components/ui/components/ErrorDisplay';

/**
 * Fetches the mechanic dashboard data from the API.
 * @returns {Promise<any>} A promise that resolves to the mechanic dashboard data.
 */
const fetchMechanicDashboard = async () => {
  const response = await fetch('/api/mechanic/dashboard');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

/**
 * Renders the mechanic dashboard, displaying the mechanic's active and pending job requests.
 */
const MechanicDashboard = () => {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(true);
  const { data, isLoading, error } = useQuery({
    queryKey: ['mechanicDashboard'],
    queryFn: fetchMechanicDashboard,
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'In Progress': { label: 'Sedang Dikerjakan', color: 'bg-orange-500' },
      Completed: { label: 'Selesai', color: 'bg-green-500' }
    };
    return statusMap[status as keyof typeof statusMap] || { label: 'Unknown', color: 'bg-gray-500' };
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error.message} />;

  const { name, jobs } = data;
  const currentJob = jobs.find(job => job.status === 'In Progress');
  const pendingOrders = jobs.filter(job => job.status !== 'In Progress' && job.status !== 'Completed');
  const completedJobsCount = jobs.filter(job => job.status === 'Completed').length;

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
              <p className="text-sm text-gray-600">Selamat datang, {name}!</p>
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
        {/* Today's Stats (partially placeholder) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{completedJobsCount}</p>
              <p className="text-sm text-gray-600">Pekerjaan Selesai</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">Rp 0</p>
              <p className="text-sm text-gray-600">Pendapatan Hari Ini</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">N/A</p>
              <p className="text-sm text-gray-600">Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">N/A</p>
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
                <Badge className={`${getStatusBadge(currentJob.status).color} text-white`}>
                  {getStatusBadge(currentJob.status).label}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{currentJob.customer}</h3>
                  <p className="text-sm mt-2"><strong>Layanan:</strong> {currentJob.service}</p>
                </div>
                <div className="flex flex-col justify-between items-end">
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
              <div className="flex justify-center">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Selesai Pekerjaan
                </Button>
              </div>
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
            {pendingOrders.length > 0 ? pendingOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{order.customer}</h3>
                    <p className="text-sm mt-2"><strong>Layanan:</strong> {order.service}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Tolak
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Terima
                    </Button>
                  </div>
                </div>
              </div>
            )) : <p className="text-gray-500">Tidak ada pesanan masuk saat ini.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MechanicDashboard;
