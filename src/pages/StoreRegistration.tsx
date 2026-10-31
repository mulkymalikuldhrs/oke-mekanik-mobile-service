import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, CreditCard, MapPin, Store, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { storeApi } from '@/lib/api';

const StoreRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    bankName: 'Bank Central Asia (BCA)',
    accountNumber: '',
    accountHolder: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await storeApi.registerStore({
        ...formData,
        paymentInfo: `${formData.bankName}: ${formData.accountNumber} a.n ${formData.accountHolder}`
      });
      toast.success('Pendaftaran Toko / Store Berhasil!');
      navigate('/store/dashboard');
    } catch (error) {
      toast.error('Gagal mendaftarkan toko sparepart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-12 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/20 blur-[160px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="bg-black/60 border-white/10 backdrop-blur-[160px] shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-tr from-emerald-600 to-emerald-400 p-4 rounded-2xl shadow-lg shadow-emerald-500/20">
                <ShoppingBag className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black text-white">Profil Toko Sparepart & Metode Pembayaran</CardTitle>
            <CardDescription className="text-gray-400">
              Lengkapi informasi toko & sertakan rekening pembayaran langsung Anda
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Toko Details */}
              <div className="space-y-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                  <Store className="h-5 w-5" />
                  Informasi Toko Suku Cadang
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Nama Toko / Store</Label>
                    <Input
                      placeholder="Contoh: Toko Sparepart Jaya"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-black/40 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Nomor Telepon / WhatsApp</Label>
                    <Input
                      placeholder="0821xxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="bg-black/40 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Alamat Lengkap Toko</Label>
                  <Input
                    placeholder="Jl. Kebon Jeruk No. 12, Jakarta West"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="bg-black/40 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Deskripsi Toko & Spesialisasi</Label>
                  <Textarea
                    placeholder="Pusat oli, kampas rem, busi, aki gel, dan charger EV..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-black/40 border-white/10 text-white min-h-[80px]"
                  />
                </div>
              </div>

              {/* Custom Payment Details */}
              <div className="space-y-4 bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                  <CreditCard className="h-5 w-5" />
                  Metode Pembayaran Sendiri (Direct Seller Payment)
                </div>
                <p className="text-xs text-gray-400">
                  Pembayaran dari pembeli akan ditransfer langsung ke rekening atau e-wallet toko Anda.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Nama Bank / E-Wallet</Label>
                    <Input
                      placeholder="BCA / Mandiri / QRIS / GoPay"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      required
                      className="bg-black/40 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Nomor Rekening / HP</Label>
                    <Input
                      placeholder="8830123987"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      required
                      className="bg-black/40 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Nama Pemilik Rekening</Label>
                    <Input
                      placeholder="a.n Toko Jaya Utama"
                      value={formData.accountHolder}
                      onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                      required
                      className="bg-black/40 border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black h-12 rounded-xl text-base shadow-lg shadow-emerald-500/20"
              >
                {isLoading ? 'Mendaftarkan Toko...' : 'Selesaikan Pendaftaran Toko & Buka Dashboard'}
              </Button>
            </CardContent>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default StoreRegistration;
