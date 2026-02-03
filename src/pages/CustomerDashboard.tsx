import React from 'react';
import { MapPin, Car, Clock, Star, MessageSquare, Phone, Plus, History, AlertTriangle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '@/components/LanguageToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

const CustomerDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
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

  const handleEmergencyCall = () => {
    navigate('/customer/booking');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard Pelanggan</h1>
              <p className="text-sm text-gray-600">Selamat datang kembali, {user?.name}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <Button variant="ghost" size="icon" onClick={() => { logout(); navigate('/'); }}>
              <LogOut className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 space-y-6">
        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Butuh Bantuan Mekanik?</h2>
            <p className="mb-6 opacity-90">Panggil mekanik terdekat dalam hitungan detik</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                onClick={() => navigate('/customer/booking')}
              >
                <Plus className="h-5 w-5 mr-2" />
                Panggil Mekanik Sekarang
              </Button>
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 font-semibold"
                onClick={handleEmergencyCall}
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                🚨 DARURAT
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Service */}
        {activeBooking && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <Clock className="h-5 w-5 mr-2" />
                Layanan Aktif - {activeBooking.status.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Mekanik ID: {activeBooking.mechanicId}</p>
                  <p className="text-sm text-gray-600">Kendaraan: {activeBooking.vehicle.brand} {activeBooking.vehicle.model}</p>
                  <p className="text-sm text-gray-600">Masalah: {activeBooking.problem}</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/customer/chat?bookingId=${activeBooking.id}`)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/customer/tracking?bookingId=${activeBooking.id}`)}
                  >
                    Tracking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nearby Mechanics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Mekanik Terdekat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
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
          </CardContent>
        </Card>

        {/* Recent Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <History className="h-5 w-5 mr-2 text-green-600" />
                Riwayat Layanan
              </div>
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
