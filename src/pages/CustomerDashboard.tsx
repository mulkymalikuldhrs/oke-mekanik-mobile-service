import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Car, Clock, Star, MessageSquare, Phone, Plus, History, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '@/components/LanguageToggle';
import LoadingSpinner from '@/components/ui/components/LoadingSpinner';
import ErrorDisplay from '@/components/ui/components/ErrorDisplay';

/**
 * Fetches the customer dashboard data from the API.
 * @returns {Promise<any>} A promise that resolves to the customer dashboard data.
 */
const fetchCustomerDashboard = async () => {
  const response = await fetch('/api/customer/dashboard');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

/**
 * Renders the customer dashboard, displaying the customer's active and past service requests.
 */
const CustomerDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ['customerDashboard'],
    queryFn: fetchCustomerDashboard,
  });

  const handleEmergencyCall = () => {
    navigate('/customer/booking');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  const { name, bookings } = data;
  const activeService = bookings.find(b => b.status !== 'Completed');
  const recentServices = bookings.filter(b => b.status === 'Completed');

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
              <p className="text-sm text-gray-600">Selamat datang kembali, {name}!</p>
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
                  <p className="font-semibold">{activeService.mechanic} sedang menangani permintaan Anda</p>
                  <p className="text-sm text-gray-600">Layanan: {activeService.service}</p>
                  <p className="text-sm text-gray-600">Status: {activeService.status}</p>
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
                    onClick={() => navigate(`/customer/tracking/${activeService.id}`)}
                  >
                    Tracking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nearby Mechanics (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Mekanik Terdekat
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* This would be populated by a separate API call in a real app */}
            <p className="text-gray-500">Fitur mekanik terdekat akan segera hadir.</p>
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
            {recentServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{service.service}</h3>
                  <p className="text-sm text-gray-600">Mekanik: {service.mechanic}</p>
                  <p className="text-xs text-gray-500">{service.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{service.cost || 'N/A'}</p>
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
