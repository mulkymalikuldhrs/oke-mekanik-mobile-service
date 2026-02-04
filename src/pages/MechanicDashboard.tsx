
<<<<<<< HEAD
import React from 'react';
import { Wrench, MapPin, Clock, Star, MessageSquare, Phone, CheckCircle, XCircle, LogOut, Settings } from 'lucide-react';
=======
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
>>>>>>> origin/feat/project-revamp-10664209957500258455
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '@/components/LanguageToggle';
<<<<<<< HEAD
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
=======
import LoadingSpinner from '@/components/ui/components/LoadingSpinner';
import ErrorDisplay from '@/components/ui/components/ErrorDisplay';
>>>>>>> origin/feat/project-revamp-10664209957500258455

/**
 * Fetches the mechanic dashboard data from the API.
 * @returns {Promise<any>} A promise that resolves to the mechanic dashboard data.
 */
const fetchMechanicDashboard = async () => {
  const response = await fetch('http://localhost:3001/mechanics/1'); // Assuming mechanic ID is 1
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const mechanic = await response.json();

  const jobsResponse = await fetch(`http://localhost:3001/bookings?mechanicId=${mechanic.id}`);
  if (!jobsResponse.ok) {
    throw new Error('Network response was not ok');
  }
  const jobs = await jobsResponse.json();

  return { ...mechanic, jobs };
};

/**
 * Renders the mechanic dashboard, displaying the mechanic's active and pending job requests.
 */
const MechanicDashboard = () => {
  const { t } = useLanguage();
<<<<<<< HEAD
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = React.useState(true);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', user?.id],
    queryFn: () => api.getBookings(user?.id || '', 'mechanic'),
    enabled: !!user?.id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: any }) => api.updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', user?.id] });
      toast.success('Status pekerjaan diperbarui');
    },
  });

  const activeJobs = jobs?.filter(j => ['accepted', 'otw', 'working'].includes(j.status)) || [];
  const pendingJobs = jobs?.filter(j => j.status === 'pending') || [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };
=======
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
>>>>>>> origin/feat/project-revamp-10664209957500258455

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-600 p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard Mekanik</h1>
<<<<<<< HEAD
              <p className="text-sm text-gray-600">Selamat bekerja, {user?.name}</p>
=======
              <p className="text-sm text-gray-600">Selamat datang, {name}!</p>
>>>>>>> origin/feat/project-revamp-10664209957500258455
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 mr-4">
              <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
              <Switch checked={isOnline} onCheckedChange={setIsOnline} />
            </div>
            <LanguageToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

<<<<<<< HEAD
      <main className="container mx-auto p-4 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600">Pekerjaan Hari Ini</p>
              <p className="text-2xl font-bold text-blue-600">5</p>
=======
      <div className="container mx-auto p-4 space-y-6">
        {/* Today's Stats (partially placeholder) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{completedJobsCount}</p>
              <p className="text-sm text-gray-600">Pekerjaan Selesai</p>
>>>>>>> origin/feat/project-revamp-10664209957500258455
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
<<<<<<< HEAD
              <p className="text-sm text-gray-600">Total Pendapatan</p>
              <p className="text-2xl font-bold text-green-600">Rp 750rb</p>
=======
              <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">Rp 0</p>
              <p className="text-sm text-gray-600">Pendapatan Hari Ini</p>
>>>>>>> origin/feat/project-revamp-10664209957500258455
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
<<<<<<< HEAD
=======
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">N/A</p>
>>>>>>> origin/feat/project-revamp-10664209957500258455
              <p className="text-sm text-gray-600">Rating</p>
              <div className="flex justify-center items-center">
                <p className="text-2xl font-bold text-yellow-600 mr-1">4.9</p>
                <Star className="h-4 w-4 fill-yellow-600 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
<<<<<<< HEAD
              <p className="text-sm text-gray-600">Jam Kerja</p>
              <p className="text-2xl font-bold text-orange-600">6.5h</p>
=======
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">N/A</p>
              <p className="text-sm text-gray-600">Jam Online</p>
>>>>>>> origin/feat/project-revamp-10664209957500258455
            </CardContent>
          </Card>
        </div>

<<<<<<< HEAD
        {/* Active Jobs */}
        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Pekerjaan Sedang Berlangsung
          </h2>
          {isLoading ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : activeJobs.length > 0 ? (
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <Card key={job.id} className="border-l-4 border-l-blue-600 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">
                            {job.status.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">ID: {job.id}</span>
                        </div>
                        <h3 className="text-xl font-bold">{job.vehicleDetails}</h3>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <p className="text-sm font-medium text-blue-600">Layanan: {job.serviceId}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => navigate('/mechanic/chat')}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        {job.status === 'accepted' && (
                          <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => updateStatusMutation.mutate({ id: job.id, status: 'otw' })}
                          >
                            Mulai Perjalanan
                          </Button>
                        )}
                        {job.status === 'otw' && (
                          <Button
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={() => updateStatusMutation.mutate({ id: job.id, status: 'working' })}
                          >
                            Sampai di Lokasi
                          </Button>
                        )}
                        {job.status === 'working' && (
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => updateStatusMutation.mutate({ id: job.id, status: 'completed' })}
                          >
                            Selesai Pekerjaan
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="p-8 text-center text-gray-500 italic">
                Tidak ada pekerjaan aktif saat ini.
              </CardContent>
            </Card>
          )}
        </section>

        {/* Incoming/Pending Requests */}
        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-orange-600" />
            Permintaan Masuk
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              <Skeleton className="h-32 w-full rounded-xl" />
            ) : pendingJobs.length > 0 ? (
              pendingJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{job.vehicleDetails}</CardTitle>
                    <CardDescription>{job.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-semibold text-blue-600 mb-4">Layanan: {job.serviceId}</p>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => updateStatusMutation.mutate({ id: job.id, status: 'accepted' })}
                      >
                        Terima
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => updateStatusMutation.mutate({ id: job.id, status: 'cancelled' })}
                      >
                        Tolak
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm">Menunggu pesanan baru...</p>
            )}
          </div>
        </section>
      </main>
=======
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
>>>>>>> origin/feat/project-revamp-10664209957500258455
    </div>
  );
};

export default MechanicDashboard;
