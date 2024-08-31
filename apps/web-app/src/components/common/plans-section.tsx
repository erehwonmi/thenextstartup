'use client';

import { SubscriptionPlans, SubscriptionTiers } from '@db/schema';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  LoadingSpinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
} from '@ts/uikit';
import { cn } from '@ts/uikit-utils';
import {
  // useCreateLemonsqueezyPayment,
  useCreateStripePayment,
} from '@web-app/core/api/payments';

import { useFetchPlans } from '@web-app/core/api/plans/use-fetch-plans';
import { useSession } from '@web-app/core/contexts/session';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

type PlanFrequency = 'monthly' | 'yearly';
type SubscriptionPlan = Omit<SubscriptionPlans, 'createdAt' | 'updatedAt'>;

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CheckCircle2 size={18} className="my-auto text-green-400" />
    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">{text}</p>
  </div>
);

const PlanCard = ({
  plan,
  planFrequency,
  customerSubscriptionTier,
  handleCheckout,
}: {
  plan: SubscriptionPlan;
  planFrequency: PlanFrequency;
  customerSubscriptionTier: SubscriptionTiers | null;
  handleCheckout: (params: { productId: string }) => void;
}) => {
  const features = plan.features ?? [];
  const isYearly = planFrequency === 'yearly';
  const isCurrentSubscription = plan.tierCode === customerSubscriptionTier;
  const isPlanFreeTier = plan.tierCode === 'free';

  return (
    <Card
      className={cn('p-5 xl:w-[350px] lg:w-[300px] md:w-[250px]', {
        'border-yellow-500': plan.isFeatured,
      })}
    >
      <CardHeader>
        {isYearly ? (
          <div className="flex justify-between">
            <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
              {plan.title}
            </CardTitle>
            <div
              className={cn(
                'px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white',
                {
                  'bg-gradient-to-r from-yellow-500 to-amber-100 dark:text-black':
                    plan.isFeatured,
                }
              )}
            >
              Save ${plan.monthlyPrice * 12 - plan.yearlyPrice}
            </div>
          </div>
        ) : (
          <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
            {plan.title}
          </CardTitle>
        )}
        <div className="flex gap-0.5">
          <h3 className="text-3xl font-bold">
            {plan.yearlyPrice && isYearly
              ? '$' + plan.yearlyPrice
              : '$' + plan.monthlyPrice}
          </h3>
          <span className="flex flex-col justify-end text-sm mb-1">
            {plan.yearlyPrice && isYearly
              ? '/year'
              : plan.monthlyPrice
              ? '/month'
              : null}
          </span>
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {features.map((feature: string) => (
          <FeatureItem key={feature} text={feature} />
        ))}
      </CardContent>
      {customerSubscriptionTier && (
        <CardFooter>
          <Button
            disabled={isCurrentSubscription || isPlanFreeTier}
            onClick={() => {
              const productId = isYearly
                ? plan.stripeProductIdYearly
                : plan.stripeProductIdMonthly;

              // NOTE: Enable if you're using Lemonsqueezy
              // const productId = isYearly
              //   ? plan.lemonSqueezyProductIdYearly
              //   : plan.lemonSqueezyProductIdMonthly;

              handleCheckout({ productId: productId as string });
            }}
          >
            {isCurrentSubscription ? 'Current plan' : 'Upgrade'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

const PlansSection = () => {
  const session = useSession();
  const [planFrequency, setPlanFrequency] = useState<PlanFrequency>('monthly');

  const { isLoading, data: response } = useFetchPlans();
  const { mutate: createStripePayment, isPending: isStripePaymentPending } =
    useCreateStripePayment();

  // const {
  //   mutate: createLemonsqueezyPayment,
  //   isPending: isLemonsqueezyPaymentPending,
  // } = useCreateLemonsqueezyPayment();

  const { toast } = useToast();

  if (isLoading || isStripePaymentPending) {
    return (
      <div className="w-full flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const plans = response?.data ?? [];
  if (plans && plans.length === 0) {
    return (
      <h5 className="text-center">
        There are no subscription plans available.
      </h5>
    );
  }

  const handleCheckout = ({ productId }: { productId: string }) => {
    createStripePayment(
      { priceId: productId, itemType: 'subscription' },
      {
        onSuccess: (result) => {
          toast({
            title: 'Redirecting you to the Stripe page',
            description: result.message,
          });

          const url = result.data?.url as string;

          window.open(url, '_self');
        },
        onError: (result) => {
          toast({
            variant: 'destructive',
            title: 'Payment attempt failed',
            description: result.response?.data?.message,
          });
        },
      }
    );

    // NOTE: Enable if you're using Lemonsqueezy
    // createLemonsqueezyPayment(
    //   { variantId: productId },
    //   {
    //     onSuccess: (result) => {
    //       toast({
    //         title: 'Redirecting you to the Lemonsqueezy page',
    //         description: result.message,
    //       });

    //       const url = result.data?.url as string;

    //       window.open(url, '_self');
    //     },
    //     onError: (result) => {
    //       toast({
    //         variant: 'destructive',
    //         title: 'Payment attempt failed',
    //         description: result.response?.data?.message,
    //       });
    //     },
    //   }
    // );
  };

  const subscriptionTier =
    session && session.customerProfiles.userId
      ? session.customerProfiles.subscriptionTier
      : null;

  return (
    <Tabs
      defaultValue="monthly"
      className="xl:w-full md:w-full sm:w-full w-screen"
      onValueChange={(value) => {
        setPlanFrequency(value as PlanFrequency);
      }}
    >
      <div className="flex items-center justify-center">
        <TabsList className="w-[300px]">
          <TabsTrigger value="monthly" className="w-full">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" className="w-full">
            Yearly
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value={planFrequency}
        className="flex xl:flex-row lg:flex-row md:flex-row flex-col gap-2 my-10 justify-center px-10 xl:px-0"
      >
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            planFrequency={planFrequency}
            customerSubscriptionTier={subscriptionTier}
            handleCheckout={handleCheckout}
          />
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default PlansSection;
