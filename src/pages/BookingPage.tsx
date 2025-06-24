
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Car, Phone, MessageSquare, Star, Camera, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

const BookingPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState({ lat: 0, lng: 0, address: '' });
  const [vehicleData, setVehicleData] = useState({
    brand: '',
    model: '',
    year: '',
    color: '',
    licensePlate: '',
    problem: ''
  });
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [isEmergency, setIsEmergency] = useState(false);

  const availableMechanics = [
    {
      id: 1,
      name: 'Ahmad Rizki',
      rating: 4.9,
      distance: '0.8 km',
      eta: '12 menit',
      speciality: 'Mesin & Transmisi',
      price: 'Rp 75.000',
      photo: '👨‍🔧',
      verified: true,
      completedJobs: 245
    },
    {
      id: 2,
      name: 'Budi Santoso',
      rating: 4.8,
      distance: '1.2 km',
      eta: '15 menit',
      speciality: 'Sistem Kelistrikan',
      price: 'Rp 80.000',
      photo: '🔧',
      verified: true,
      completedJobs: 189
    },
    {
      id: 3,
      name: 'Sari Mekanik',
      rating: 4.9,
      distance: '1.5 km',
      eta: '18 menit',
      speciality: 'AC & Radiator',
      price: 'Rp 70.000',
      photo: '👩‍🔧',
      verified: true,
      completedJobs: 167
    }
  ];

  const vehicleBrands = ['Toyota', 'Honda', 'Suzuki', 'Daihatsu', 'Mitsubishi', 'Nissan', 'Hyundai', 'Yamaha', 'Kawasaki'];
  const problemTypes = [
    'Mesin mati mendadak',
    'Tidak bisa starter',
    'Overheat',
    'Ban kempes',
    'Aki soak',
    'Rem bermasalah',
    'AC tidak dingin',
    'Lampu mati',
    'Lainnya'
  ];

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Lokasi saat ini' // In real app, use reverse geocoding
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleEmergencyBooking = () => {
    setIsEmergency(true);
    toast({
      title: "🚨 Mode Darurat Aktif",
      description: "Mencari mekanik terdekat untuk Anda...",
    });
    
    // Auto-select closest mechanic
    setSelectedMechanic(availableMechanics[0]);
    setStep(3);
  };

  const handleBooking = () => {
    toast({
      title: "Booking Berhasil!",
      description: `${selectedMechanic?.name} sedang menuju lokasi Anda.`,
    });
  };

  const renderLocationStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Lokasi & Masalah Kendaraan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="address">Alamat Lengkap</Label>
          <div className="flex space-x-2">
            <Input
              id="address"
              value={location.address}
              onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Masukkan alamat lengkap"
            />
            <Button size="sm" variant="outline">
              <Navigation className="h-4 w-4 mr-1" />
              GPS
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brand">Merk Kendaraan</Label>
            <select
              id="brand"
              className="w-full p-2 border rounded-md"
              value={vehicleData.brand}
              onChange={(e) => setVehicleData(prev => ({ ...prev, brand: e.target.value }))}
            >
              <option value="">Pilih merk</option>
              {vehicleBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="model">Model/Tipe</Label>
            <Input
              id="model"
              value={vehicleData.model}
              onChange={(e) => setVehicleData(prev => ({ ...prev, model: e.target.value }))}
              placeholder="Avanza, Vario, dll"
            />
          </div>
          <div>
            <Label htmlFor="year">Tahun</Label>
            <Input
              id="year"
              value={vehicleData.year}
              onChange={(e) => setVehicleData(prev => ({ ...prev, year: e.target.value }))}
              placeholder="2019"
            />
          </div>
          <div>
            <Label htmlFor="licensePlate">Plat Nomor</Label>
            <Input
              id="licensePlate"
              value={vehicleData.licensePlate}
              onChange={(e) => setVehicleData(prev => ({ ...prev, licensePlate: e.target.value }))}
              placeholder="B 1234 XYZ"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="problem">Masalah Kendaraan</Label>
          <select
            id="problem"
            className="w-full p-2 border rounded-md mb-2"
            value={vehicleData.problem}
            onChange={(e) => setVehicleData(prev => ({ ...prev, problem: e.target.value }))}
          >
            <option value="">Pilih masalah</option>
            {problemTypes.map(problem => (
              <option key={problem} value={problem}>{problem}</option>
            ))}
          </select>
          <Input
            placeholder="Deskripsi detail masalah (opsional)"
            className="mt-2"
          />
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <Button 
            onClick={handleEmergencyBooking}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            🚨 DARURAT - Panggil Sekarang
          </Button>
          <p className="text-xs text-red-600 mt-2 text-center">
            Untuk situasi darurat yang membutuhkan bantuan segera
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderMechanicSelection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Car className="h-5 w-5 mr-2" />
          Pilih Mekanik {isEmergency && <Badge className="ml-2 bg-red-600">DARURAT</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableMechanics.map((mechanic) => (
          <div
            key={mechanic.id}
            onClick={() => setSelectedMechanic(mechanic)}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedMechanic?.id === mechanic.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{mechanic.photo}</div>
                <div>
                  <h3 className="font-semibold flex items-center">
                    {mechanic.name}
                    {mechanic.verified && <Badge className="ml-2 bg-green-600">Verified</Badge>}
                  </h3>
                  <p className="text-sm text-gray-600">{mechanic.speciality}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm ml-1">{mechanic.rating}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {mechanic.distance}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {mechanic.completedJobs} jobs
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">ETA: {mechanic.eta}</p>
                <p className="text-lg font-semibold text-blue-600">{mechanic.price}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderBookingConfirmation = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Konfirmasi Booking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900">Detail Booking</h3>
          <div className="mt-2 space-y-2">
            <p><strong>Mekanik:</strong> {selectedMechanic?.name}</p>
            <p><strong>Lokasi:</strong> {location.address}</p>
            <p><strong>Kendaraan:</strong> {vehicleData.brand} {vehicleData.model} ({vehicleData.licensePlate})</p>
            <p><strong>Masalah:</strong> {vehicleData.problem}</p>
            <p><strong>Estimasi Biaya:</strong> {selectedMechanic?.price}</p>
            <p><strong>ETA:</strong> {selectedMechanic?.eta}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Button>
          <Button variant="outline" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Telepon
          </Button>
        </div>

        <Button onClick={handleBooking} className="w-full bg-green-600 hover:bg-green-700">
          Konfirmasi Booking
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Panggil Mekanik</h1>
          <p className="text-gray-600">Bantuan profesional untuk kendaraan Anda</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {step === 1 && renderLocationStep()}
          {step === 2 && renderMechanicSelection()}
          {step === 3 && renderBookingConfirmation()}
          
          {!isEmergency && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Sebelumnya
              </Button>
              
              {step < 3 && (
                <Button onClick={() => setStep(step + 1)}>
                  Selanjutnya
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
