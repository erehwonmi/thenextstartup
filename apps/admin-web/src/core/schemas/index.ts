import { adminProfilesTypesEnum, customerProfileStatusEnum } from '@db/schema';
import { z } from 'zod';

export const LoginAdminFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(16),
});

export const GetCustomersSchema = z.object({
  limit: z.coerce.number().default(10),
  skip: z.coerce.number().default(0),
  qk: z.enum(['stripeId', 'id', 'email']).optional().nullable(),
  q: z.string().optional().nullable(),
});

export const GetAdminsSchema = z.object({
  limit: z.coerce.number().default(10),
  skip: z.coerce.number().default(0),
  qk: z.enum(['id', 'email']).optional().nullable(),
  q: z.string().optional().nullable(),
});

export const UpdateCustomerSchema = z.object({
  id: z.string(),
  accountStatus: z.enum(customerProfileStatusEnum),
});

export const UpdateAdminSchema = z.object({
  id: z.string(),
  adminType: z.enum(adminProfilesTypesEnum),
});

export const BanCustomersSchema = z.object({
  userIds: z.array(z.string()).min(1),
});

export type LoginAdminForm = z.infer<typeof LoginAdminFormSchema>;
export type GetCustomers = z.infer<typeof GetCustomersSchema>;
export type GetAdmins = z.infer<typeof GetAdminsSchema>;
export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>;
export type UpdateAdmin = z.infer<typeof UpdateAdminSchema>;
export type BanCustomers = z.infer<typeof BanCustomersSchema>;
