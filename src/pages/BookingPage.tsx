import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Car, MapPin, Navigation, Wrench, ChevronLeft, 
  Star, Phone, MessageSquare, Clock, Badge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge as UIBadge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { bookingApi } from '@/lib/api';

interface Mechanic {
  id: string;
  name: string;
  photo: string;
  speciality: string;
  rating: number;
  distance: string;
  price: string;
  eta: string;
  completedJobs: number;
  isOnline: boolean;
  verified: boolean;
  pricePerHour: number;
}

interface VehicleData {
  brand: string;
  model: string;
  year: string;
  licensePlate: string;
  problem: string;
}

interface LocationData {
  address: string;
}

const vehicleBrands = ['Toyota', 'Honda', 'Suzuki', 'Mitsubishi', 'Nissan', 'Daihatsu', 'Hyundai', 'Kia'];
const problemTypes = ['Ganti Oli', 'Servis Rutin', 'Masalah Mesin', 'Masalah Ban', 'Masalah Rem', 'Masalah AC', 'Mogok', 'Lainnya'];

const bookingSchema = z.object({
  serviceType: z.string().min(1, 'Jenis layanan diperlukan'),
  vehicleDetails: z.string().min(5, 'Detail kendaraan diperlukan'),
  location: z.string().min(10, 'Alamat lengkap diperlukan'),
  description: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [step, setStep] = useState(1);
  const [isEmergency, setIsEmergency] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    problem: '',
  });
  const [location, setLocation] = useState<LocationData>({ address: '' });

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: '',
      vehicleDetails: '',
      location: '',
      description: '',
    },
  });

  const availableMechanics: Mechanic[] = [
    { id: 'M001', name: 'Budi Santoso', photo: '👨‍🔧', speciality: 'Ahli Mesin', rating: 4.8, distance: '2.5 km', price: 'Rp 75.000/jam', eta: '15 menit', completedJobs: 156, isOnline: true, verified: true, pricePerHour: 75000 },
    { id: 'M002', name: 'Sukma Dewi', photo: '👩‍🔧', speciality: 'Ahli Kelistrikan', rating: 4.9, distance: '3.1 km', price: 'Rp 80.000/jam', eta: '20 menit', completedJobs: 89, isOnline: true, verified: true, pricePerHour: 80000 },
    { id: 'M003', name: 'Joko Prasetyo', photo: '👨‍🔧', speciality: 'Servis Umum', rating: 4.7, distance: '4.0 km', price: 'Rp 70.000/jam', eta: '25 menit', completedJobs: 203, isOnline: false, verified: true, pricePerHour: 70000 },
  ];

  const bookingMutation = useMutation({
    mutationFn: async (data: { customerId: number; mechanicId: string; status: string; vehicle: VehicleData; problem: string; location: LocationData; estimatedCost: number; isEmergency: boolean }) => {
      return bookingApi.create({
        mechanicId: data.mechanicId,
        serviceId: 'S1',
        vehicle: data.vehicle,
        problem: data.problem,
        location: { lat: 0, lng: 0, address: data.location.address },
        scheduledAt: new Date().toISOString(),
        isEmergency: data.isEmergency,
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Booking Berhasil!',
        description: `${selectedMechanic?.name} sedang menuju lokasi Anda.`,
      });
      navigate(`/customer/tracking?bookingId=${data.id || 1}`);
    },
    onError: () => {
      toast({
        title: 'Booking Gagal',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    const mechId = searchParams.get('mechanicId');
    if (mechId && availableMechanics.length > 0) {
      const mech = availableMechanics.find(m => m.id === mechId);
      if (mech) {
        setSelectedMechanic(mech);
        setStep(2);
      }
    }
  }, [searchParams]);

  const handleEmergencyBooking = () => {
    setIsEmergency(true);
    toast({
      title: 'Mode Darurat Aktif',
      description: 'Lengkapi detail di bawah dan panggil sekarang.',
    });
  };

  const handleBooking = () => {
    if (!selectedMechanic) {
      toast({
        title: 'Pilih Mekanik',
        description: 'Silakan pilih mekanik terlebih dahulu',
        variant: 'destructive',
      });
      return;
    }

    bookingMutation.mutate({
      customerId: 1,
      mechanicId: selectedMechanic.id,
      status: 'pending',
      vehicle: vehicleData,
      problem: vehicleData.problem,
      location,
      estimatedCost: selectedMechanic.pricePerHour,
      isEmergency,
    });
  };

  const onSubmit = (data: BookingFormValues) => {
    const details = `${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}, ${vehicleData.licensePlate}`;
    const fullData = {
      ...data,
      vehicleDetails: details,
    };
    console.log('Booking submitted:', fullData);
    toast({
      title: 'Booking Dikirim',
      description: 'Menunggu konfirmasi dari sistem.',
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
          <Textarea
            placeholder="Deskripsi detail masalah (opsional)"
            className="mt-2"
            value={vehicleData.problem}
            onChange={(e) => setVehicleData(prev => ({ ...prev, problem: e.target.value }))}
          />
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <Button 
            onClick={handleEmergencyBooking}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            DARURAT - Panggil Sekarang
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
          Pilih Mekanik {isEmergency && <UIBadge className="ml-2 bg-red-600">DARURAT</UIBadge>}
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
                    {mechanic.verified && <UIBadge className="ml-2 bg-green-600 text-xs">Verified</UIBadge>}
                  </h3>
                  <p className="text-sm text-gray-600">{mechanic.speciality}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm ml-1">{mechanic.rating}</span>
                    </div>
                    <UIBadge variant="outline" className="text-xs">
                      {mechanic.distance}
                    </UIBadge>
                    <UIBadge variant="outline" className="text-xs">
                      {mechanic.completedJobs} jobs
                    </UIBadge>
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

        <Button onClick={handleBooking} className="w-full bg-green-600 hover:bg-green-700" disabled={bookingMutation.isPending}>
          {bookingMutation.isPending ? 'Memproses...' : 'Konfirmasi Booking'}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-white"
          onClick={() => navigate('/customer/dashboard')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Kembali ke Dashboard
        </Button>

        <Card className="shadow-lg border-none">
          <CardHeader className="bg-blue-600 text-white rounded-t-xl">
            <CardTitle className="text-2xl flex items-center">
              <Wrench className="h-6 w-6 mr-3" />
              Pesan Mekanik
            </CardTitle>
            <CardDescription className="text-blue-100">
              Isi formulir di bawah ini untuk memanggil mekanik ke lokasi Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {step === 1 && (
              <div className="space-y-6">
                {renderLocationStep()}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    if (location.address && vehicleData.brand && vehicleData.model) {
                      setStep(2);
                    } else {
                      toast({
                        title: 'Lengkapi Data',
                        description: 'Silakan isi semua data yang diperlukan',
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  Lanjutkan ke Pemilihan Mekanik
                </Button>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <Button variant="outline" className="mb-4" onClick={() => setStep(1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
                {renderMechanicSelection()}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    if (selectedMechanic) {
                      setStep(3);
                    } else {
                      toast({
                        title: 'Pilih Mekanik',
                        description: 'Silakan pilih mekanik terlebih dahulu',
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  Lanjutkan ke Konfirmasi
                </Button>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6">
                <Button variant="outline" className="mb-4" onClick={() => setStep(2)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
                {renderBookingConfirmation()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;
