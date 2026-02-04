
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Shield, Check, ChevronRight, ChevronLeft, Upload, Loader2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const MechanicRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Pendaftaran Berhasil! Akun Anda sedang diverifikasi.');
      navigate('/mechanic/dashboard');
    }, 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold">Informasi Keahlian</h3>
            <div className="space-y-2">
              <Label htmlFor="speciality">Spesialisasi Utama</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Spesialisasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Mobil Penumpang</SelectItem>
                  <SelectItem value="motorcycle">Sepeda Motor</SelectItem>
                  <SelectItem value="truck">Kendaraan Berat / Truk</SelectItem>
                  <SelectItem value="electric">Kendaraan Listrik</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Pengalaman Kerja (Tahun)</Label>
              <Input id="experience" type="number" placeholder="Contoh: 5" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold">Dokumen Pendukung</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium">Unggah KTP</p>
                <p className="text-xs text-gray-500">Format JPG, PNG (Maks 5MB)</p>
              </div>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer">
                <Award className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium">Unggah Sertifikat Keahlian (Opsional)</p>
                <p className="text-xs text-gray-500">Meningkatkan peluang diterima</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold">Konfirmasi & Persetujuan</h3>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                Dengan mendaftar, Anda setuju untuk mengikuti standar pelayanan Oke Mekanik dan mematuhi kode etik mitra.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" className="rounded border-gray-300 text-orange-600 focus:ring-orange-600" />
                <Label htmlFor="terms" className="text-sm">Saya menyetujui syarat dan ketentuan</Label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-lg shadow-xl border-none">
        <CardHeader className="bg-orange-600 text-white rounded-t-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 w-8 rounded-full ${i <= step ? 'bg-white' : 'bg-white/30'}`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Pendaftaran Mitra Mekanik</CardTitle>
          <CardDescription className="text-orange-100">Lengkapi data untuk mulai menerima pesanan</CardDescription>
        </CardHeader>

        <CardContent className="pt-8">
          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={nextStep}
                >
                  Lanjut
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 min-w-[120px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Mendaftar...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Selesaikan
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="bg-gray-50 text-center py-4 rounded-b-xl border-t flex justify-center">
          <div className="flex items-center text-xs text-gray-500">
            <Shield className="h-3 w-3 mr-1 text-green-600" />
            Keamanan data terjamin dengan enkripsi SSL
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MechanicRegistration;
