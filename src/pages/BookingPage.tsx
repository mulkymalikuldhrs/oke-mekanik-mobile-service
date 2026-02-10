import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Car, MapPin, Navigation, Wrench, ChevronLeft, 
  Star, Phone, MessageSquare, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge as UIBadge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { bookingApi, mechanicApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Mechanic } from '@/types';

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
  const { t } = useLanguage();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: '',
      vehicleDetails: '',
      location: '',
      description: '',
    },
  });

  const { user } = useAuth();

  const { data: availableMechanics = [] } = useQuery({
    queryKey: ['mechanics'],
    queryFn: mechanicApi.getAll,
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: { customerId: string; mechanicId: string; status: string; vehicle: VehicleData; problem: string; location: LocationData; estimatedCost: number; isEmergency: boolean }) => {
      return bookingApi.create({
        userId: data.customerId,
        mechanicId: data.mechanicId,
        serviceId: 'svc-1',
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
      navigate(`/customer/tracking/${data.id}`);
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
      customerId: user?.id || 'cust-1',
      mechanicId: selectedMechanic.id,
      status: 'pending',
      vehicle: vehicleData,
      problem: vehicleData.problem,
      location,
      estimatedCost: selectedMechanic.pricePerHour || 50000,
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
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <MapPin className="h-5 w-5 mr-2 text-blue-400" />
          Lokasi & Masalah Kendaraan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="address" className="text-gray-300">Alamat Lengkap</Label>
          <div className="flex space-x-2 mt-1">
            <Input
              id="address"
              value={location.address}
              onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Masukkan alamat lengkap"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
            />
            <Button size="sm" variant="outline" className="border-white/10 text-gray-300">
              <Navigation className="h-4 w-4 mr-1" />
              GPS
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brand" className="text-gray-300">Merk Kendaraan</Label>
            <select
              id="brand"
              className="w-full p-2 bg-white/5 border border-white/10 rounded-md text-white mt-1"
              value={vehicleData.brand}
              onChange={(e) => setVehicleData(prev => ({ ...prev, brand: e.target.value }))}
            >
              <option value="" className="bg-[#1a1a1a]">Pilih merk</option>
              {vehicleBrands.map(brand => (
                <option key={brand} value={brand} className="bg-[#1a1a1a]">{brand}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="model" className="text-gray-300">Model/Tipe</Label>
            <Input
              id="model"
              value={vehicleData.model}
              onChange={(e) => setVehicleData(prev => ({ ...prev, model: e.target.value }))}
              placeholder="Avanza, Vario, dll"
              className="bg-white/5 border-white/10 text-white mt-1"
            />
          </div>
          <div>
            <Label htmlFor="year" className="text-gray-300">Tahun</Label>
            <Input
              id="year"
              value={vehicleData.year}
              onChange={(e) => setVehicleData(prev => ({ ...prev, year: e.target.value }))}
              placeholder="2019"
              className="bg-white/5 border-white/10 text-white mt-1"
            />
          </div>
          <div>
            <Label htmlFor="licensePlate" className="text-gray-300">Plat Nomor</Label>
            <Input
              id="licensePlate"
              value={vehicleData.licensePlate}
              onChange={(e) => setVehicleData(prev => ({ ...prev, licensePlate: e.target.value }))}
              placeholder="B 1234 XYZ"
              className="bg-white/5 border-white/10 text-white mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="problem" className="text-gray-300">Masalah Kendaraan</Label>
          <select
            id="problem"
            className="w-full p-2 bg-white/5 border border-white/10 rounded-md text-white mt-1 mb-2"
            value={vehicleData.problem}
            onChange={(e) => setVehicleData(prev => ({ ...prev, problem: e.target.value }))}
          >
            <option value="" className="bg-[#1a1a1a]">Pilih masalah</option>
            {problemTypes.map(problem => (
              <option key={problem} value={problem} className="bg-[#1a1a1a]">{problem}</option>
            ))}
          </select>
          <Textarea
            placeholder="Deskripsi detail masalah (opsional)"
            className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
            value={vehicleData.problem}
            onChange={(e) => setVehicleData(prev => ({ ...prev, problem: e.target.value }))}
          />
        </div>

        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl backdrop-blur-sm">
          <Button 
            onClick={handleEmergencyBooking}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black"
          >
            DARURAT - Panggil Sekarang
          </Button>
          <p className="text-xs text-red-400 mt-2 text-center">
            Untuk situasi darurat yang membutuhkan bantuan segera
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderMechanicSelection = () => (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Car className="h-5 w-5 mr-2 text-blue-400" />
          Pilih Mekanik {isEmergency && <UIBadge className="ml-2 bg-red-600">DARURAT</UIBadge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableMechanics.map((mechanic) => (
          <div
            key={mechanic.id}
            onClick={() => setSelectedMechanic(mechanic)}
            className={`p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
              selectedMechanic?.id === mechanic.id
                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                : 'border-white/10 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl bg-white/5 p-2 rounded-xl">{mechanic.avatar || '👨‍🔧'}</div>
                <div>
                  <h3 className="font-bold flex items-center text-white text-lg">
                    {mechanic.name}
                    <UIBadge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px]">Verified</UIBadge>
                  </h3>
                  <p className="text-sm text-gray-400">{mechanic.speciality?.join(', ')}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm ml-1 text-gray-300 font-medium">{mechanic.rating}</span>
                    </div>
                    <UIBadge variant="outline" className="text-[10px] border-green-500/30 text-green-400 bg-green-500/10">
                      Online
                    </UIBadge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1 font-medium">ETA: 15m</p>
                <p className="text-xl font-black text-blue-400">Rp {mechanic.pricePerHour?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderBookingConfirmation = () => (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Clock className="h-5 w-5 mr-2 text-blue-400" />
          Konfirmasi Booking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl backdrop-blur-sm">
          <h3 className="font-bold text-white text-lg mb-4">Ringkasan Pesanan</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Mekanik:</span> <span className="text-white font-medium">{selectedMechanic?.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Lokasi:</span> <span className="text-white font-medium text-right max-w-[200px]">{location.address}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Kendaraan:</span> <span className="text-white font-medium">{vehicleData.brand} {vehicleData.model}</span></div>
            <div className="flex justify-between border-t border-white/10 pt-3 mt-3">
              <span className="text-gray-400 font-bold">Total Estimasi:</span>
              <span className="text-blue-400 font-black text-lg">Rp {selectedMechanic?.pricePerHour?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleBooking}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black h-14 rounded-2xl shadow-lg shadow-blue-500/20 mt-4"
          disabled={bookingMutation.isPending}
        >
          {bookingMutation.isPending ? 'MEMPROSES...' : 'KONFIRMASI SEKARANG'}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-white/5 text-gray-400 hover:text-white"
          onClick={() => navigate('/customer/dashboard')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Dashboard
        </Button>

        <Card className="shadow-2xl border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden rounded-[2rem]">
          <div className="h-2 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl font-black flex items-center italic tracking-tighter">
              <Wrench className="h-8 w-8 mr-3 text-blue-500" />
              PESAN MEKANIK
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              Solusi cepat untuk kendala kendaraan Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
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
