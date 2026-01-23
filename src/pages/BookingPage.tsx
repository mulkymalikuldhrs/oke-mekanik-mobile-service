
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MapPin, Car, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';

/**
 * Zod schema for the booking form.
 */
const bookingSchema = z.object({
  address: z.string().min(10, 'Alamat lengkap diperlukan'),
  vehicle: z.string().min(2, 'Model kendaraan diperlukan'),
  licensePlate: z.string().min(3, 'Plat nomor diperlukan'),
  problem: z.string().min(10, 'Deskripsi masalah diperlukan'),
  isEmergency: z.boolean().default(false),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

/**
 * Posts the booking data to the API.
 * @param {BookingFormValues} data The booking form data.
 * @returns {Promise<any>} A promise that resolves to the response from the API.
 */
const postBooking = async (data: BookingFormValues) => {
  const response = await fetch('http://localhost:3001/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, customerId: 1, mechanicId: 1, date: new Date().toISOString(), status: 'Scheduled' }),
  });
  if (!response.ok) {
    throw new Error('Gagal membuat booking');
  }
  return response.json();
};

/**
 * Renders the booking page, allowing customers to create a new service request.
 */
const BookingPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      address: '',
      vehicle: '',
      licensePlate: '',
      problem: '',
      isEmergency: false,
    },
  });

  const mutation = useMutation({
    mutationFn: postBooking,
    onSuccess: () => {
      toast({
        title: 'Booking Berhasil!',
        description: 'Mekanik akan segera dihubungi. Anda akan dialihkan ke dashboard.',
      });
      setTimeout(() => navigate('/customer/dashboard'), 2000);
    },
    onError: () => {
      toast({
        title: 'Booking Gagal',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    mutation.mutate(data);
  };

  const handleEmergencyBooking = () => {
    form.setValue('isEmergency', true);
    // You might want to pre-fill some fields or show a confirmation
    toast({
      title: "🚨 Mode Darurat Aktif",
      description: "Lengkapi detail di bawah dan panggil sekarang.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Panggil Mekanik</h1>
          <p className="text-gray-600">Bantuan profesional untuk kendaraan Anda</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="h-5 w-5 mr-2" />
              Detail Permintaan Bantuan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Jl. Sudirman No. 123, Jakarta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vehicle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model Kendaraan</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Toyota Avanza 2019" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="licensePlate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plat Nomor</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: B 1234 XYZ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="problem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi Masalah</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Jelaskan masalah yang Anda alami secara detail."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <Button
                    type="button"
                    onClick={handleEmergencyBooking}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Klik Jika Darurat
                  </Button>
                  <p className="text-xs text-red-700 mt-2 text-center">
                    Gunakan tombol ini untuk situasi darurat yang butuh penanganan super cepat.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Mengirim...' : 'Panggil Mekanik Sekarang'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;
