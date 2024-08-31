'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  LoadingButton,
  Form,
  useToast,
} from '@ts/uikit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LoginAdminForm, LoginAdminFormSchema } from '@admin-web/core/schemas';
import { useRouter } from 'next/navigation';
import { useAdminLogin } from '@admin-web/core/api/auth';

export default function Index() {
  const form = useForm<LoginAdminForm>({
    resolver: zodResolver(LoginAdminFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();
  const { toast } = useToast();
  const { mutate: login, isPending } = useAdminLogin();

  const onSubmit = (values: LoginAdminForm) => {
    login(values, {
      onSuccess: () => {
        router.push('/app');
      },
      onError: (result) => {
        toast({
          variant: 'destructive',
          title: 'Invalid admin credentials!',
          description: result.response?.data?.message,
        });
      },
    });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen xs:h-full">
      <h1 className="p-10 text-black dark:text-white font-bungeeShade font-semibold text-5xl">
        The Next Startup
      </h1>
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-josefinSans">
            Admin Login
          </CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="hello@thenextstartup.app"
                        type="email"
                      />
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
                      <Input
                        {...field}
                        className="w-full"
                        placeholder=""
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton
                isLoading={isPending}
                className="w-full mt-4"
                type="submit"
              >
                Log in
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
