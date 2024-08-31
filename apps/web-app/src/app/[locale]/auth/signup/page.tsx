'use client';

import {
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSignup } from '@web-app/core/api/auth';
import Link from 'next/link';
import { SignupForm, SignupFormSchema } from '@web-app/core/schemas';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const form = useForm<SignupForm>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const { mutate: signup, isPending } = useSignup();

  const onSubmit = (values: SignupForm) => {
    signup(values, {
      onSuccess: (_) => {
        toast({
          title: 'Email verification',
          description:
            'We sent a verification link to your registered email address.',
        });
        router.push('/auth/verify');
      },
      onError: (result) => {
        toast({
          variant: 'destructive',
          title: 'Nope. We cannot sign you up!',
          description: result.response?.data?.message,
        });
      },
    });
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-josefinSans">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to signup for an account today.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <>
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
                Sign up
              </LoadingButton>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="underline">
              Log in
            </Link>
          </div>
        </>
      </CardContent>
    </Card>
  );
};

export default Signup;
