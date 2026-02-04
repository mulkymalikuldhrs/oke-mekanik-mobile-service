<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

import React from 'react';
import { MapPin, Car, Clock, Star, MessageSquare, Phone, Plus, History, AlertTriangle, LogOut } from 'lucide-react';
=======
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Car, Clock, Star, MessageSquare, Phone, Plus, History, AlertTriangle } from 'lucide-react';
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
import React from 'react';
import { MapPin, Car, Clock, Star, MessageSquare, Phone, Plus, History, AlertTriangle, Loader } from 'lucide-react';
>>>>>>> origin/feature/production-ready-foundation-11256743727145072162
=======
import React from 'react';
import { MapPin, Car, Clock, Star, MessageSquare, Phone, Plus, History, AlertTriangle, LoaderCircle } from 'lucide-react';
>>>>>>> origin/feature/production-ready-refactor-15241725718241106546
=======
import React from 'react';
import { MapPin, Car, Clock, Star, MessageSquare, Phone, Plus, History, AlertTriangle, Loader } from 'lucide-react';
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
=======
import React from 'react';
import { MapPin, Car, Clock, Star, MessageSquare, Phone, Plus, History, AlertTriangle, LogOut } from 'lucide-react';
>>>>>>> origin/jules-9588893365322302084-daabd2d3
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '@/components/LanguageToggle';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
=======
import LoadingSpinner from '@/components/ui/components/LoadingSpinner';
import ErrorDisplay from '@/components/ui/components/ErrorDisplay';
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
import { useQuery } from '@tanstack/react-query';
import { fetchActiveService, fetchRecentServices, fetchNearbyMechanics } from '@/lib/api';
>>>>>>> origin/feature/production-ready-foundation-11256743727145072162
=======
import { useQuery } from '@tanstack/react-query';
=======
import { useQuery } from '@tanstack/react-query';
import { fetchActiveService, fetchRecentServices, fetchNearbyMechanics } from '@/lib/api';
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
=======
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
>>>>>>> origin/jules-9588893365322302084-daabd2d3

const fetchCustomerData = async () => {
  const res = await fetch('http://localhost:3001/customer');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};
>>>>>>> origin/feature/production-ready-refactor-15241725718241106546

/**
 * Fetches the customer dashboard data from the API.
 * @returns {Promise<any>} A promise that resolves to the customer dashboard data.
 */
const fetchCustomerDashboard = async () => {
  const response = await fetch('http://localhost:3001/customers/1'); // Assuming customer ID is 1
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const customer = await response.json();

  const bookingsResponse = await fetch(`http://localhost:3001/bookings?customerId=${customer.id}`);
  if (!bookingsResponse.ok) {
    throw new Error('Network response was not ok');
  }
  const bookings = await bookingsResponse.json();

  return { ...customer, bookings };
};

/**
 * Renders the customer dashboard, displaying the customer's active and past service requests.
 */
const CustomerDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const { user, logout } = useAuth();

  const { data: mechanics, isLoading: isLoadingMechanics } = useQuery({
    queryKey: ['mechanics'],
    queryFn: api.getMechanics,
  });

  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: () => api.getBookings(user?.id || '', 'customer'),
    enabled: !!user?.id,
  });

  const activeBooking = bookings?.find(b => ['accepted', 'otw', 'working'].includes(b.status));
  const recentBookings = bookings?.filter(b => b.status === 'completed') || [];
=======
=======
  const { user, logout } = useAuth();

  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: () => api.getBookings(),
    enabled: !!user,
  });

  const { data: mechanics = [], isLoading: loadingMechanics } = useQuery({
    queryKey: ['mechanics'],
    queryFn: () => api.getMechanics(),
  });

  const activeBooking = bookings.find(b => ['pending', 'accepted', 'otw', 'arrived', 'working'].includes(b.status));
  const recentBookings = bookings.filter(b => b.status === 'completed').slice(0, 5);
  const nearbyMechanics = mechanics.filter(m => m.isOnline).slice(0, 3);
>>>>>>> origin/jules-9588893365322302084-daabd2d3

  const { data: activeService, isLoading: isLoadingActiveService } = useQuery({
    queryKey: ['activeService'],
    queryFn: fetchActiveService
  });

  const { data: recentServices, isLoading: isLoadingRecentServices } = useQuery({
    queryKey: ['recentServices'],
    queryFn: fetchRecentServices
  });

  const { data: nearbyMechanics, isLoading: isLoadingNearbyMechanics } = useQuery({
    queryKey: ['nearbyMechanics'],
    queryFn: fetchNearbyMechanics
  });
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399

  const handleLogout = () => {
    logout();
    navigate('/');
=======
  const { data, isLoading, error } = useQuery({
    queryKey: ['customerDashboard'],
    queryFn: fetchCustomerDashboard,
=======

  const { data: activeService, isLoading: isLoadingActiveService } = useQuery({
    queryKey: ['activeService'],
    queryFn: fetchActiveService
  });

  const { data: recentServices, isLoading: isLoadingRecentServices } = useQuery({
    queryKey: ['recentServices'],
    queryFn: fetchRecentServices
  });

  const { data: nearbyMechanics, isLoading: isLoadingNearbyMechanics } = useQuery({
    queryKey: ['nearbyMechanics'],
    queryFn: fetchNearbyMechanics
>>>>>>> origin/feature/production-ready-foundation-11256743727145072162
  });

=======
  const { data, isLoading, error } = useQuery({
    queryKey: ['customerData'],
    queryFn: fetchCustomerData
  });

>>>>>>> origin/feature/production-ready-refactor-15241725718241106546
  const handleEmergencyCall = () => {
    navigate('/customer/booking');
>>>>>>> origin/feat/project-revamp-10664209957500258455
  };

  if (isLoading) {
<<<<<<< HEAD
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  const { name, bookings } = data;
  const activeService = bookings.find(b => b.status !== 'Completed');
  const recentServices = bookings.filter(b => b.status === 'Completed');
=======
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoaderCircle data-testid="loader" className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Gagal memuat data</h2>
          <p className="text-gray-600">Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.</p>
        </div>
      </div>
    );
  }

  const { activeService, recentServices, nearbyMechanics } = data || {};
>>>>>>> origin/feature/production-ready-refactor-15241725718241106546

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard Pelanggan</h1>
<<<<<<< HEAD
<<<<<<< HEAD
              <p className="text-sm text-gray-600">Halo, {user?.name || 'Pelanggan'}</p>
=======
              <p className="text-sm text-gray-600">Selamat datang kembali, {name}!</p>
>>>>>>> origin/feat/project-revamp-10664209957500258455
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Keluar">
=======
              <p className="text-sm text-gray-600">Selamat datang kembali, {user?.name}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <Button variant="ghost" size="icon" onClick={() => { logout(); navigate('/'); }}>
>>>>>>> origin/jules-9588893365322302084-daabd2d3
              <LogOut className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 space-y-6">
        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Butuh Bantuan Mekanik?</h2>
            <p className="mb-6 opacity-90">Panggil mekanik terdekat dalam hitungan detik untuk perbaikan kendaraan Anda.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold"
                onClick={() => navigate('/customer/booking')}
              >
                <Plus className="h-5 w-5 mr-2" />
                Panggil Mekanik
              </Button>
              <Button 
                size="lg" 
                className="bg-red-500 hover:bg-red-600 text-white font-bold border-none"
                onClick={() => navigate('/customer/booking')}
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                🚨 DARURAT
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Service */}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        {isLoadingBookings ? (
          <Skeleton className="h-32 w-full rounded-xl" />
        ) : activeBooking && (
          <Card className="border-orange-200 bg-orange-50 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-orange-800 text-lg">
=======
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
        {isLoadingActiveService ? (
          <div className="flex items-center justify-center">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        ) : activeService && (
=======
        {activeBooking && (
>>>>>>> origin/jules-9588893365322302084-daabd2d3
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
>>>>>>> origin/feature/production-ready-foundation-11256743727145072162
                <Clock className="h-5 w-5 mr-2" />
                Layanan Aktif - {activeBooking.status.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
<<<<<<< HEAD
<<<<<<< HEAD
                  <p className="font-semibold text-gray-900">Mekanik sedang dalam perjalanan ke lokasi Anda</p>
                  <p className="text-sm text-gray-600">Kendaraan: {activeBooking.vehicleDetails}</p>
                  <p className="text-sm text-gray-600">Lokasi: {activeBooking.location}</p>
=======
                  <p className="font-semibold">{activeService.mechanic} sedang menangani permintaan Anda</p>
                  <p className="text-sm text-gray-600">Layanan: {activeService.service}</p>
                  <p className="text-sm text-gray-600">Status: {activeService.status}</p>
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
                  <p className="font-semibold">Mekanik ID: {activeBooking.mechanicId}</p>
                  <p className="text-sm text-gray-600">Kendaraan: {activeBooking.vehicle.brand} {activeBooking.vehicle.model}</p>
                  <p className="text-sm text-gray-600">Masalah: {activeBooking.problem}</p>
>>>>>>> origin/jules-9588893365322302084-daabd2d3
                </div>
<<<<<<< HEAD
<<<<<<< HEAD
                <div className="flex flex-wrap gap-2">
                  <Button 
=======
                <div className="flex space-x-2">
                  <Button
                    size="sm"
>>>>>>> origin/feature/production-ready-foundation-11256743727145072162
=======
                <div className="flex space-x-2">
                  <Button
                    size="sm"
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
                    variant="outline"
<<<<<<< HEAD
                    className="bg-white"
                    onClick={() => navigate('/customer/chat')}
=======
                    onClick={() => navigate(`/customer/chat?bookingId=${activeBooking.id}`)}
>>>>>>> origin/jules-9588893365322302084-daabd2d3
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
<<<<<<< HEAD
                  <Button variant="outline" className="bg-white">
                    <Phone className="h-4 w-4 mr-2" />
                    Telepon
                  </Button>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/jules-9588893365322302084-daabd2d3
                  <Button 
<<<<<<< HEAD
                    className="bg-orange-600 hover:bg-orange-700"
=======
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
                  <Button
                    size="sm"
<<<<<<< HEAD
>>>>>>> origin/feature/production-ready-foundation-11256743727145072162
                    onClick={() => navigate('/customer/tracking')}
=======
                    size="sm"
                    onClick={() => navigate(`/customer/tracking/${activeService.id}`)}
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
                    onClick={() => navigate(`/customer/tracking?bookingId=${activeBooking.id}`)}
>>>>>>> origin/jules-9588893365322302084-daabd2d3
                  >
                    Lacak Lokasi
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

<<<<<<< HEAD
        {/* Nearby Mechanics */}
        <Card className="shadow-sm">
=======
        {/* Nearby Mechanics (Placeholder) */}
        <Card>
>>>>>>> origin/feat/project-revamp-10664209957500258455
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Mekanik Terdekat
            </CardTitle>
          </CardHeader>
<<<<<<< HEAD
          <CardContent className="space-y-4">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            {isLoadingMechanics ? (
              [1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-lg" />)
            ) : (
              mechanics?.map((mechanic) => (
                <div key={mechanic.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      {mechanic.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{mechanic.name}</h3>
                      <p className="text-sm text-gray-600">{mechanic.speciality}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center text-yellow-600">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-semibold ml-1">{mechanic.rating}</span>
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-bold">
                          {mechanic.distance}
                        </Badge>
=======
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
            {isLoadingNearbyMechanics ? (
              <div className="flex items-center justify-center">
                <Loader className="h-6 w-6 animate-spin" />
              </div>
            ) : nearbyMechanics?.map((mechanic) => (
<<<<<<< HEAD
=======
            {nearbyMechanics && nearbyMechanics.map((mechanic) => (
>>>>>>> origin/feature/production-ready-refactor-15241725718241106546
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
              <div key={mechanic.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{mechanic.avatar}</div>
                  <div>
                    <h3 className="font-semibold">{mechanic.name}</h3>
                    <p className="text-sm text-gray-600">{mechanic.speciality}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm ml-1">{mechanic.rating}</span>
>>>>>>> origin/feature/production-ready-foundation-11256743727145072162
=======
            {loadingMechanics ? (
              <p>Memuat mekanik...</p>
            ) : nearbyMechanics.length > 0 ? (
              nearbyMechanics.map((mechanic) => (
                <div key={mechanic.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{mechanic.avatar || '👨‍🔧'}</div>
                    <div>
                      <h3 className="font-semibold">{mechanic.name}</h3>
                      <p className="text-sm text-gray-600">{mechanic.speciality.join(', ')}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm ml-1">{mechanic.rating}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Online
                        </Badge>
>>>>>>> origin/jules-9588893365322302084-daabd2d3
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
<<<<<<< HEAD
                    <p className="text-sm font-bold text-blue-600">Rp {mechanic.pricePerHour.toLocaleString()}/jam</p>
                    <Button
                      size="sm"
                      className="mt-2 bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate('/customer/booking')}
                    >
                      Pesan
                    </Button>
                  </div>
                </div>
<<<<<<< HEAD
              ))
            )}
=======
          <CardContent>
            {/* This would be populated by a separate API call in a real app */}
            <p className="text-gray-500">Fitur mekanik terdekat akan segera hadir.</p>
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
                <div className="text-right">
                  <p className="text-sm font-semibold text-blue-600">{mechanic.price}</p>
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => navigate('/customer/booking')}
                  >
                    Pilih
                  </Button>
                </div>
              </div>
            ))}
>>>>>>> origin/feature/production-ready-foundation-11256743727145072162
=======
                    <p className="text-sm font-semibold text-blue-600">Rp {mechanic.pricePerHour}/jam</p>
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => navigate(`/customer/booking?mechanicId=${mechanic.id}`)}
                    >
                      Pilih
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Tidak ada mekanik online saat ini</p>
            )}
>>>>>>> origin/jules-9588893365322302084-daabd2d3
          </CardContent>
        </Card>

        {/* Recent Services */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center">
                <History className="h-5 w-5 mr-2 text-green-600" />
                Riwayat Layanan
              </div>
<<<<<<< HEAD
              <Button size="sm" variant="ghost" className="text-blue-600">
                Lihat Semua
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            {isLoadingBookings ? (
              <Skeleton className="h-20 w-full rounded-lg" />
            ) : recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-xl shadow-sm">
                  <div>
                    <h3 className="font-bold text-gray-900">{booking.vehicleDetails}</h3>
                    <p className="text-sm text-gray-600">Layanan: {booking.serviceId}</p>
                    <p className="text-xs text-gray-500">{new Date(booking.scheduledAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">Rp {booking.totalCost?.toLocaleString()}</p>
                    <div className="flex items-center justify-end mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
=======
            {recentServices.map((service) => (
=======
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
            {isLoadingRecentServices ? (
              <div className="flex items-center justify-center">
                <Loader className="h-6 w-6 animate-spin" />
              </div>
            ) : recentServices?.map((service) => (
<<<<<<< HEAD
>>>>>>> origin/feature/production-ready-foundation-11256743727145072162
=======
            {recentServices && recentServices.map((service) => (
>>>>>>> origin/feature/production-ready-refactor-15241725718241106546
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
              <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{service.service}</h3>
                  <p className="text-sm text-gray-600">Mekanik: {service.mechanic}</p>
                  <p className="text-xs text-gray-500">{service.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{service.cost || 'N/A'}</p>
>>>>>>> origin/feat/project-revamp-10664209957500258455
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-gray-500 italic">Belum ada riwayat layanan.</p>
=======
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingBookings ? (
              <p>Memuat riwayat...</p>
            ) : recentBookings.length > 0 ? (
              recentBookings.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{service.problem}</h3>
                    <p className="text-sm text-gray-600">Kendaraan: {service.vehicle.brand} {service.vehicle.model}</p>
                    <p className="text-xs text-gray-500">{new Date(service.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">Rp {service.estimatedCost}</p>
                    <Badge variant="outline" className="mt-1">Selesai</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Belum ada riwayat layanan</p>
>>>>>>> origin/jules-9588893365322302084-daabd2d3
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
