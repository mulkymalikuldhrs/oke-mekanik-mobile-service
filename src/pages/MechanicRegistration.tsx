
import React, { useState } from 'react';
import { Camera, Upload, CheckCircle, User, Car, Phone, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

const MechanicRegistration = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    
    // Documents
    ktpNumber: '',
    simNumber: '',
    ktpPhoto: null,
    simPhoto: null,
    selfiePhoto: null,
    
    // Experience
    experience: '',
    specialization: [],
    tools: '',
    
    // Payment
    bankName: '',
    accountNumber: '',
    accountName: '',
    
    // Verification
    verificationStatus: 'pending'
  });

  const specializations = [
    'Mesin Mobil', 'Transmisi', 'Rem', 'AC Mobil', 'Sistem Kelistrikan',
    'Mesin Motor', 'CVT', 'Injeksi', 'Karburator', 'Ban & Velg'
  ];

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSpecializationToggle = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec]
    }));
  };

  const handleSubmit = () => {
    toast({
      title: "Pendaftaran Berhasil!",
      description: "Dokumen Anda sedang diverifikasi. Kami akan mengirim notifikasi dalam 1-2 hari kerja.",
    });
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Data Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="nama@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+62 812-3456-7890"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Kota</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Jakarta"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Jl. Sudirman No. 123, Jakarta Pusat"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Verifikasi Dokumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ktpNumber">Nomor KTP</Label>
                  <Input
                    id="ktpNumber"
                    value={formData.ktpNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, ktpNumber: e.target.value }))}
                    placeholder="16 digit nomor KTP"
                  />
                </div>
                <div>
                  <Label htmlFor="simNumber">Nomor SIM</Label>
                  <Input
                    id="simNumber"
                    value={formData.simNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, simNumber: e.target.value }))}
                    placeholder="12 digit nomor SIM"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Label>Foto KTP</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50">
                    <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Upload foto KTP</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload('ktpPhoto', e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <Label>Foto SIM</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50">
                    <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Upload foto SIM</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload('simPhoto', e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <Label>Foto Selfie</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50">
                    <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Foto selfie dengan KTP</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload('selfiePhoto', e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Petunjuk:</strong> Pastikan foto jelas, tidak blur, dan semua informasi dapat terbaca dengan baik.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="h-5 w-5 mr-2" />
                Keahlian & Pengalaman
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="experience">Pengalaman Kerja (tahun)</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="Contoh: 5 tahun"
                />
              </div>
              
              <div>
                <Label>Spesialisasi (pilih yang sesuai)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {specializations.map((spec) => (
                    <div
                      key={spec}
                      onClick={() => handleSpecializationToggle(spec)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.specialization.includes(spec)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <p className="text-sm font-medium">{spec}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="tools">Peralatan yang Dimiliki</Label>
                <Input
                  id="tools"
                  value={formData.tools}
                  onChange={(e) => setFormData(prev => ({ ...prev, tools: e.target.value }))}
                  placeholder="Contoh: Kunci pas, Tang, Multimeter, dll"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Informasi Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Nama Bank</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                    placeholder="BCA, Mandiri, BRI, dll"
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Nomor Rekening</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="1234567890"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="accountName">Nama Pemilik Rekening</Label>
                <Input
                  id="accountName"
                  value={formData.accountName}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                  placeholder="Sesuai dengan nama di rekening bank"
                />
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Biaya Pendaftaran:</strong> Rp 150.000 (sudah termasuk seragam dan ID card)
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Daftar Sebagai Mekanik</h1>
          <p className="text-gray-600">Bergabunglah dengan ribuan mekanik profesional</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > num ? <CheckCircle className="w-4 h-4" /> : num}
                </div>
                {num < 4 && (
                  <div className={`w-16 h-0.5 ${step > num ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Sebelumnya
            </Button>
            
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)}>
                Selanjutnya
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Daftar Sekarang
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicRegistration;
