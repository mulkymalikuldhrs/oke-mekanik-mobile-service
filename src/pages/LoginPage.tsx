
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Car, Wrench } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<'customer' | 'mechanic'>('customer');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, role);
      toast.success('Login berhasil!');
      navigate(role === 'customer' ? '/customer/dashboard' : '/mechanic/dashboard');
    } catch (error) {
      toast.error('Login gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Selamat Datang di Oke Mekanik</CardTitle>
          <CardDescription>Masuk ke akun Anda untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label>Masuk sebagai</Label>
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

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Masuk
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <Button variant="link" className="p-0 text-blue-600" onClick={() => navigate('/register')}>
              Daftar Sekarang
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
