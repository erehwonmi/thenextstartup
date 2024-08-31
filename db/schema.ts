import { relations, sql } from 'drizzle-orm';
import {
  blob,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

export const accountTypeEnum = ['email', 'google'] as const;
export const subscriptionTierEnum = ['free', 'pro'] as const;
export const subscriptionStatusEnum = [
  'active',
  'past_due',
  'cancelled',
  'expired',
] as const;
export const todoStatusEnum = ['pending', 'ongoing', 'completed'] as const;
export const customerProfileStatusEnum = [
  'active',
  'inactive',
  'disabled',
] as const;
export const adminProfilesTypesEnum = ['superadmin', 'admin'] as const;
export const users = sqliteTable(
  'users',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    email: text('email'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }),
  },
  (users) => {
    return {
      emailIdx: uniqueIndex('email_idx').on(users.email),
    };
  }
);

export const sessions = sqliteTable('session', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
});

export const customerProfiles = sqliteTable(
  'customer_profiles',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
    accountType: text('account_type', { enum: accountTypeEnum }).notNull(),
    subscriptionTier: text('subscription_tier', {
      enum: subscriptionTierEnum,
    })
      .notNull()
      .default('free'),
    subscriptionStatus: text('subscription_status', {
      enum: subscriptionStatusEnum,
    }),
    accountStatus: text('account_status', {
      enum: customerProfileStatusEnum,
    })
      .default('inactive')
      .notNull(),
    password: text('password'),
    googleId: text('google_id'),
    stripeId: text('stripe_id'),
    lemonSqueezyId: text('lemonsqueezy_id'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }),
    lastActiveAt: integer('last_active_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (customerProfiles) => {
    return {
      googleIdIdx: uniqueIndex('google_id').on(customerProfiles.googleId),
      stripeIdIdx: uniqueIndex('stripe_id').on(customerProfiles.stripeId),
      lemonSqueezyIdx: uniqueIndex('lemonsqueezy_id').on(
        customerProfiles.lemonSqueezyId
      ),
    };
  }
);

export const adminProfiles = sqliteTable('admin_profiles', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  adminType: text('admin_type', {
    enum: adminProfilesTypesEnum,
  })
    .default('admin')
    .notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  password: text('password').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  lastActiveAt: integer('last_active_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const usersRelations = relations(users, ({ one }) => ({
  customer_profile: one(customerProfiles),
  admin_profile: one(adminProfiles),
}));

export const todos = sqliteTable('todos', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status', {
    enum: todoStatusEnum,
  })
    .default('pending')
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const emailVerificationCodes = sqliteTable('email_verification_codes', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  customerProfileId: text('customer_profile_id')
    .references(() => customerProfiles.id, { onDelete: 'cascade' })
    .notNull(),
  code: text('code').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const subscriptionPlans = sqliteTable('subscription_plans', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  title: text('title').notNull(),
  tierCode: text('tier_code', {
    enum: subscriptionTierEnum,
  })
    .notNull()
    .default('free'),
  description: text('description').notNull(),
  monthlyPrice: real('monthly_price').notNull(),
  yearlyPrice: real('yearly_price').notNull(),
  stripeProductIdMonthly: text('stripe_product_id_monthly'),
  stripeProductIdYearly: text('stripe_product_id_yearly'),
  lemonSqueezyProductIdMonthly: text('lemonsqueezy_product_id_monthly'),
  lemonSqueezyProductIdYearly: text('lemonsqueezy_product_id_yearly'),
  features: blob('features', { mode: 'json' }).$type<string[]>(),
  isFeatured: integer('is_featured', { mode: 'boolean' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export type Users = typeof users.$inferSelect;
export type CustomerProfiles = typeof customerProfiles.$inferSelect;
export type AdminProfiles = typeof adminProfiles.$inferSelect;
export type AdminProfilesAdminTypes = Pick<
  AdminProfiles,
  'adminType'
>['adminType'];
export type EmailVerificationCodes = typeof emailVerificationCodes.$inferSelect;
export type Sessions = typeof sessions.$inferSelect;
export type Todos = typeof todos.$inferSelect;
export type TodoStatus = Pick<Todos, 'status'>['status'];
export type CustomerProfilesAccountStatus = Pick<
  CustomerProfiles,
  'accountStatus'
>['accountStatus'];
export type SubscriptionPlans = typeof subscriptionPlans.$inferSelect;
export type SubscriptionTiers =
  typeof customerProfiles.$inferSelect.subscriptionTier;
