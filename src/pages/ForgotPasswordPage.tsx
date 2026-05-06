import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Link } from 'react-router-dom';
=======
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Link } from 'react-router-dom';
import { Wrench, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';
>>>>>>> jules-1751083910730374172-8e0c37a0

const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
<<<<<<< HEAD
=======
  const { t } = useLanguage();
>>>>>>> jules-1751083910730374172-8e0c37a0
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
<<<<<<< HEAD
    console.log('Forgot password data:', data);
    // Handle forgot password logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Lupa Password</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-600 mb-6">
            Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
          </p>
=======

    toast.success(t('forgot.success'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />

      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-[160px] shadow-2xl relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-white italic tracking-tighter uppercase">{t('forgot.title')}</CardTitle>
          <CardDescription className="text-gray-400">
            {t('forgot.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
>>>>>>> jules-1751083910730374172-8e0c37a0
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
<<<<<<< HEAD
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@contoh.com" {...field} />
=======
                    <FormLabel className="text-gray-300">{t('forgot.email')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('forgot.email_placeholder')}
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 h-12 rounded-xl"
                      />
>>>>>>> jules-1751083910730374172-8e0c37a0
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
<<<<<<< HEAD
              <Button type="submit" className="w-full">Kirim Link Reset</Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="underline">Kembali ke Login</Link>
          </div>
        </CardContent>
=======
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl h-12 shadow-lg shadow-blue-500/20">
                {t('forgot.btn_send')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-2">
          <Link
            to="/login"
            className="flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors font-bold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('forgot.btn_back')}
          </Link>
        </CardFooter>
>>>>>>> jules-1751083910730374172-8e0c37a0
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
