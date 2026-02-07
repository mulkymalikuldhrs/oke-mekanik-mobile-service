import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '@/types';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer' as UserRole,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(formData);
      toast.success('Pendaftaran berhasil!');
      
      if (formData.role === 'mechanic') {
        navigate('/mechanic/registration');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (error) {
      toast.error('Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full" />

      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-white italic tracking-tighter">DAFTAR OKE MEKANIK</CardTitle>
          <CardDescription className="text-gray-400">Mulai perjalanan masa depan Anda bersama kami</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Nama Lengkap</Label>
              <Input
                id="name"
                placeholder="Joko Susilo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">Nomor Telepon</Label>
              <Input
                id="phone"
                placeholder="0812XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-300">Daftar sebagai</Label>
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val as UserRole })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-blue-500/50">
                  <SelectValue placeholder="Pilih peran" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                  <SelectItem value="customer">Pelanggan</SelectItem>
                  <SelectItem value="mechanic">Mekanik</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-6">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl h-12 shadow-lg shadow-blue-500/20" disabled={isLoading}>
              {isLoading ? 'Memuat...' : 'DAFTAR SEKARANG'}
            </Button>
            <p className="text-sm text-gray-400">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                Masuk di sini
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
