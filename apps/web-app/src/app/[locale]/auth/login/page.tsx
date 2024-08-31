'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  LoadingButton,
  useToast,
} from '@ts/uikit';
import { GoogleIcon } from '@ts/uikit/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { LoginForm, LoginFormSchema } from '@web-app/core/schemas';
import { useLogin } from '@web-app/core/api/auth';

const Login = () => {
  const form = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();
  const { toast } = useToast();
  const { mutate: login, isPending } = useLogin();

  const onSubmit = (values: LoginForm) => {
    login(values, {
      onSuccess: () => {
        router.push('/app');
      },
      onError: (result) => {
        toast({
          variant: 'destructive',
          title: 'Nope. We cannot let you in!',
          description: result.response?.data?.message,
        });
      },
    });
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-josefinSans">Login</CardTitle>
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

        <div className="relative py-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500 dark:bg-black dark:text-gray-400">
              Socials
            </span>
          </div>
        </div>

        <div className="flex justify-center py-4">
          <Button variant="outline" className={'w-full'}>
            <Link
              href="/api/auth/login/google"
              className="flex flex-row gap-2 dark:fill-white fill-black"
            >
              <GoogleIcon className="w-3 h-3 my-1" /> Sign in with Google
            </Link>
          </Button>
        </div>

        <div className="mt-4 text-center text-sm">
          {`Don't have an account yet?`}{' '}
          <Link href="/auth/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Login;
