
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Car, Wrench, UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<'customer' | 'mechanic'>('customer');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, role);
      toast.success('Pendaftaran berhasil!');
      navigate(role === 'customer' ? '/customer/dashboard' : '/mechanic/registration');
    } catch (error) {
      toast.error('Pendaftaran gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-600 p-3 rounded-xl">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Daftar Akun Baru</CardTitle>
          <CardDescription>Bergabunglah dengan komunitas Oke Mekanik</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Daftar sebagai</Label>
              <RadioGroup
                value={role}
                onValueChange={(v) => setRole(v as 'customer' | 'mechanic')}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="customer" id="customer" className="peer sr-only" />
                  <Label
                    htmlFor="customer"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600"
                  >
                    <Car className="mb-3 h-6 w-6" />
                    Pelanggan
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="mechanic" id="mechanic" className="peer sr-only" />
                  <Label
                    htmlFor="mechanic"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-orange-600 [&:has([data-state=checked])]:border-orange-600"
                  >
                    <Wrench className="mb-3 h-6 w-6" />
                    Mekanik
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
              Daftar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Button variant="link" className="p-0 text-blue-600" onClick={() => navigate('/login')}>
              Masuk
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
