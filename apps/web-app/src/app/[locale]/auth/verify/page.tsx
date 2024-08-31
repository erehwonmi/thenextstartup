'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  LoadingButton,
  useToast,
} from '@ts/uikit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { VerifyCode, VerifyCodeSchema } from '@web-app/core/schemas';

import { useVerifyCode } from '@web-app/core/api/auth/use-verify-code';
import { useRouter } from 'next/navigation';

const Verify = () => {
  const otpForm = useForm<VerifyCode>({
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues: {
      code: '',
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const { mutate: verifyCode, isPending: isVerifyPending } = useVerifyCode();

  const onVerifySubmit = (values: VerifyCode) => {
    verifyCode(values, {
      onSuccess: (_) => {
        router.push('/app');
      },
      onError: (result) => {
        toast({
          variant: 'destructive',
          title: 'Invalid code',
          description: result.response?.data?.message,
        });
      },
    });
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-josefinSans">Verify Code</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <>
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onVerifySubmit)}
              className="space-y-6"
            >
              <FormField
                control={otpForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter email verification code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={8} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSeparator />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                          <InputOTPSlot index={6} />
                          <InputOTPSlot index={7} />
                        </InputOTPGroup>
                      </InputOTP>
                      {/* <Input
                          {...field}
                          className="w-full"
                          placeholder="Verification code"
                          type="number"
                          maxLength={8}
                          defaultValue={''}
                        /> */}
                    </FormControl>
                    <FormDescription>
                      Please enter the verification code sent to your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton
                isLoading={isVerifyPending}
                className="w-full mt-4"
                type="submit"
              >
                Submit
              </LoadingButton>
            </form>
          </Form>
        </>
      </CardContent>
    </Card>
  );
};

export default Verify;
