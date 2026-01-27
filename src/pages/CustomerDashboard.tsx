import React from 'react';
import { MapPin, Car, Clock, Star, MessageSquare, Phone, Plus, History, AlertTriangle, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '@/components/LanguageToggle';
import { useQuery } from '@tanstack/react-query';

const fetchCustomerData = async () => {
  const res = await fetch('http://localhost:3001/customer');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const CustomerDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ['customerData'],
    queryFn: fetchCustomerData
  });

  const handleEmergencyCall = () => {
    navigate('/customer/booking');
  };

  if (isLoading) {
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
              <p className="text-sm text-gray-600">Selamat datang kembali!</p>
            </div>
          </div>
          <LanguageToggle />
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
        {activeService && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <Clock className="h-5 w-5 mr-2" />
                Layanan Aktif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{activeService.mechanic} sedang menuju lokasi Anda</p>
                  <p className="text-sm text-gray-600">Estimasi tiba: {activeService.eta}</p>
                  <p className="text-sm text-gray-600">Kendaraan: {activeService.vehicle}</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate('/customer/chat')}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate('/customer/tracking')}
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
            {nearbyMechanics && nearbyMechanics.map((mechanic) => (
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
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {mechanic.distance}
                      </Badge>
                    </div>
                  </div>
                </div>
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
              <Button size="sm" variant="outline">
                Lihat Semua
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentServices && recentServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{service.service}</h3>
                  <p className="text-sm text-gray-600">Mekanik: {service.mechanic}</p>
                  <p className="text-xs text-gray-500">{service.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{service.cost}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(service.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
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

export default CustomerDashboard;
