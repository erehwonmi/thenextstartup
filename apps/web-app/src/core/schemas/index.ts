import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(16),
});

export const CreateTodoSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(255),
});

export const DeleteTodoSchema = z.object({
  id: z.string(),
});

export const EditTodoSchema = z.object({
  id: z.string(),
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(255),
  status: z.enum(['pending', 'ongoing', 'completed']),
});

export const SignupFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(16),
});

export const CreateStripePaymentSchema = z.object({
  priceId: z.string(),
  itemType: z.enum(['subscription', 'payment']),
});

export const CreateLemonsqueezyPaymentSchema = z.object({
  variantId: z.string(),
});

export const VerifyCodeSchema = z.object({
  code: z.string().min(8),
});

const AttributesSchema = z.object({
  customer_id: z.number().transform((v) => v.toString()),
});

const DataSchema = z.object({
  attributes: AttributesSchema,
});

export const LemonsqueezyWebhookEventSchema = z.object({
  meta: z.object({
    event_name: z.enum([
      'order_created',
      'order_refunded',
      'subscription_created',
      'subscription_updated',
      'subscription_cancelled',
      'subscription_resumed',
      'subscription_expired',
      'subscription_paused',
      'subscription_unpaused',
      'subscription_payment_failed',
      'subscription_payment_success',
      'subscription_payment_recovered',
      'subscription_payment_refunded',
      'subscription_plan_changed',
      'license_key_created',
      'license_key_updated',
    ]),
    custom_data: z.object({
      user_id: z.string(),
      variant_id: z.string(),
      lemon_squeezy_id: z.string(),
    }),
  }),
  data: DataSchema,
});

export type LoginForm = z.infer<typeof LoginFormSchema>;
export type SignupForm = z.infer<typeof SignupFormSchema>;
export type CreateTodo = z.infer<typeof CreateTodoSchema>;
export type EditTodo = z.infer<typeof EditTodoSchema>;
export type DeleteTodo = z.infer<typeof DeleteTodoSchema>;
export type CreateStripePayment = z.infer<typeof CreateStripePaymentSchema>;
export type CreateLemonsqueezyPayment = z.infer<
  typeof CreateLemonsqueezyPaymentSchema
>;
export type VerifyCode = z.infer<typeof VerifyCodeSchema>;
export type LemonsqueezyWebhookEvent = z.infer<
  typeof LemonsqueezyWebhookEventSchema
>;
