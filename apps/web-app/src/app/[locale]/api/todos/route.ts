import { db } from '@db';
import { CustomerProfiles, todos, TodoStatus } from '@db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { CreateTodoSchema } from '@web-app/core/schemas';
import { pipe } from 'next-route-handler-pipe';
import { requiresCustomerAuth } from '@web-app/core/server/middlewares';
import { eq, and, count, or } from 'drizzle-orm';
import logger from '@web-app/core/server/logger';

async function postHandler(
  request: NextRequest & { customer: Omit<CustomerProfiles, 'password'> }
) {
  const correlationId = request.headers.get('x-correlation-id');

  const requestJson = await request.json();
  const { title, description } = CreateTodoSchema.parse(requestJson);

  logger.info('Creating new todo', {
    app: 'web-app',
    correlationId,
    data: JSON.stringify({
      title,
      description,
      subscriptionTier: request.customer.subscriptionTier,
    }),
  });

  const isFreeTier = request.customer.subscriptionTier === 'free';

  const [allPendingTodos] = await db
    .select({ count: count() })
    .from(todos)
    .where(
      and(
        eq(todos.userId, request.customer.userId as string),
        or(eq(todos.status, 'ongoing'), eq(todos.status, 'pending'))
      )
    );

  if (isFreeTier && allPendingTodos.count >= 10) {
    logger.error('Limit exceeded. Free plan', {
      app: 'web-app',
      correlationId,
      data: JSON.stringify({
        title,
        description,
        subscriptionTier: request.customer.subscriptionTier,
      }),
    });

    return NextResponse.json(
      {
        data: null,
        message: 'Limit exceeded. Consider upgrading your plan to Pro',
        success: false,
      },
      { status: 400 }
    );
  } else if (!isFreeTier && allPendingTodos.count >= 20) {
    logger.error('Limit exceeded. Pro plan', {
      app: 'web-app',
      correlationId,
      data: JSON.stringify({
        title,
        description,
        subscriptionTier: request.customer.subscriptionTier,
      }),
    });

    return NextResponse.json(
      {
        data: null,
        message: 'Limit exceeded.',
        success: false,
      },
      { status: 400 }
    );
  }

  const [newTodo] = await db
    .insert(todos)
    .values({ title, description, userId: request.customer.userId as string })
    .returning();

  return NextResponse.json(
    {
      data: newTodo,
      message: 'Created new todo',
      success: true,
    },
    { status: 200 }
  );
}

export const POST = pipe(requiresCustomerAuth, postHandler);

async function getHandler(
  request: NextRequest & { customer: Omit<CustomerProfiles, 'password'> }
) {
  const correlationId = request.headers.get('x-correlation-id');

  const url = new URL(request.url);
  const status = url.searchParams.get('status') ?? '';

  const userId = request.customer.userId;

  logger.info('Fetching todos list', {
    app: 'web-app',
    correlationId,
    data: JSON.stringify({
      userId,
      status,
    }),
  });

  const todoList = await db
    .select()
    .from(todos)
    .where(
      and(
        eq(todos.userId, userId as string),
        status ? eq(todos.status, status as TodoStatus) : undefined
      )
    );

  return NextResponse.json(
    {
      data: todoList,
      message: 'Todo list',
      success: true,
    },
    { status: 200 }
  );
}

export const GET = pipe(requiresCustomerAuth, getHandler);
