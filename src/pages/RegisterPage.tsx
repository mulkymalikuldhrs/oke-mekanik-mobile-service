<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, email, password }),
        });

        if (response.ok) {
            const { user, token } = await response.json();
            login(user, token);
            navigate('/customer/dashboard');
        } else {
            // Handle registration error
            console.error('Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Register
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
<<<<<<< HEAD
=======

import React from 'react';
import { useNavigate } from 'react-router-dom';
=======

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
>>>>>>> origin/jules-9588893365322302084-daabd2d3
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
<<<<<<< HEAD
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
=======
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import { Wrench } from 'lucide-react';

const RegisterPage = () => {
  const { t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer' as 'customer' | 'mechanic',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData);
      if (formData.role === 'mechanic') {
        navigate('/mechanic/registration');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
>>>>>>> origin/jules-9588893365322302084-daabd2d3
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Daftar Oke Mekanik</CardTitle>
          <CardDescription>Mulai perjalanan Anda bersama kami</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
>>>>>>> origin/jules-9588893365322302084-daabd2d3
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
<<<<<<< HEAD
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
=======
                placeholder="Joko Susilo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
>>>>>>> origin/jules-9588893365322302084-daabd2d3
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
<<<<<<< HEAD
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
=======
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Link } from 'react-router-dom';

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = (data: RegisterFormValues) => {
    console.log('Register data:', data);
    // Handle registration logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Daftar Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@contoh.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Daftar</Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Sudah punya akun? <Link to="/login" className="underline">Login di sini</Link>
          </div>
        </CardContent>
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                placeholder="0812XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Daftar sebagai</Label>
              <Select
                value={formData.role}
                onValueChange={(val: any) => setFormData({ ...formData, role: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Pelanggan</SelectItem>
                  <SelectItem value="mechanic">Mekanik</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Daftar
            </Button>
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Masuk di sini
              </Link>
            </p>
          </CardFooter>
        </form>
>>>>>>> origin/jules-9588893365322302084-daabd2d3
      </Card>
    </div>
  );
};

export default RegisterPage;
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> origin/feat/production-ready-upgrade-13949670600845112772
=======
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
=======
>>>>>>> origin/jules-9588893365322302084-daabd2d3
