import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Link } from 'react-router-dom';
import { Wrench, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const { t } = useLanguage();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {

    toast.success(t('forgot.success'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/20 blur-[160px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse [animation-delay:2s]" />

      <Card className="w-full max-w-md bg-black/40 border-white/10 backdrop-blur-[160px] shadow-2xl relative z-10 rounded-[2.5rem] overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-blue-400" />
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">{t('forgot.email')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('forgot.email_placeholder')}
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 h-12 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
