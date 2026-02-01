
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Car, MapPin, Calendar, Wrench, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const bookingSchema = z.object({
  serviceType: z.string().min(1, 'Pilih jenis layanan'),
  vehicleDetails: z.string().min(3, 'Detail kendaraan minimal 3 karakter'),
  location: z.string().min(5, 'Alamat lengkap diperlukan'),
  description: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const BookingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: '',
      vehicleDetails: '',
      location: '',
      description: '',
    },
  });

  const onSubmit = async (values: BookingFormValues) => {
    if (!user) {
      toast.error('Anda harus masuk terlebih dahulu');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createBooking({
        customerId: user.id,
        serviceId: values.serviceType,
        vehicleDetails: values.vehicleDetails,
        location: values.location,
        scheduledAt: new Date().toISOString(),
      });
      toast.success('Pemesanan berhasil dikirim!');
      navigate('/customer/dashboard');
    } catch (error) {
      toast.error('Gagal mengirim pemesanan. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="serviceType">Jenis Layanan</Label>
                <Select onValueChange={(v) => form.setValue('serviceType', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Layanan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S1">Ganti Oli</SelectItem>
                    <SelectItem value="S2">Servis Rutin</SelectItem>
                    <SelectItem value="S3">Darurat (Mogok)</SelectItem>
                    <SelectItem value="S4">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.serviceType && (
                  <p className="text-sm text-red-500">{form.formState.errors.serviceType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleDetails">Detail Kendaraan</Label>
                <div className="relative">
                  <Car className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="vehicleDetails"
                    placeholder="Contoh: Toyota Avanza 2019, Putih (B 1234 ABC)"
                    className="pl-10"
                    {...form.register('vehicleDetails')}
                  />
                </div>
                {form.formState.errors.vehicleDetails && (
                  <p className="text-sm text-red-500">{form.formState.errors.vehicleDetails.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Lokasi Penjemputan / Servis</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="Alamat lengkap atau titik patokan"
                    className="pl-10"
                    {...form.register('location')}
                  />
                </div>
                {form.formState.errors.location && (
                  <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Masalah (Opsional)</Label>
                <Textarea
                  id="description"
                  placeholder="Ceritakan kendala pada kendaraan Anda..."
                  className="min-h-[100px]"
                  {...form.register('description')}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Konfirmasi Pemesanan'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-gray-50 text-center py-4 rounded-b-xl border-t">
            <p className="text-sm text-gray-500 w-full">
              Estimasi mekanik tiba dalam 15-30 menit setelah dikonfirmasi.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;
