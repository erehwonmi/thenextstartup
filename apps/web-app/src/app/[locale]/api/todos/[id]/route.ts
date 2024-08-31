import { db } from '@db';
import { CustomerProfiles, todos } from '@db/schema';
import { DeleteTodoSchema, EditTodoSchema } from '@web-app/core/schemas';
import logger from '@web-app/core/server/logger';
import { requiresCustomerAuth } from '@web-app/core/server/middlewares';
import { eq, and } from 'drizzle-orm';
import { pipe } from 'next-route-handler-pipe';
import { NextRequest, NextResponse } from 'next/server';

async function putHandler(
  request: NextRequest & { customer: Omit<CustomerProfiles, 'password'> },
  { params }: { params: { id: string } }
) {
  const correlationId = request.headers.get('x-correlation-id');

  const requestJson = await request.json();
  const { title, description, id, status } = EditTodoSchema.parse({
    ...requestJson,
    ...params,
  });

  logger.info('Edit Todo', {
    app: 'web-app',
    correlationId,
    data: JSON.stringify({ title, description, id, status }),
  });

  const userId = request.customer.userId;

  const [modifiedTodo] = await db
    .update(todos)
    .set({ title, description, status })
    .where(and(eq(todos.userId, userId as string), eq(todos.id, id)))
    .returning();

  return NextResponse.json(
    {
      data: modifiedTodo,
      message: `Modified todo ${modifiedTodo.id}`,
      success: true,
    },
    { status: 200 }
  );
}

export const PUT = pipe(requiresCustomerAuth, putHandler);

async function deleteHandler(
  request: NextRequest & { customer: Omit<CustomerProfiles, 'password'> },
  { params }: { params: { id: string } }
) {
  const correlationId = request.headers.get('x-correlation-id');

  const { id } = DeleteTodoSchema.parse(params);

  logger.info('Delete Todo', {
    app: 'web-app',
    correlationId,
    data: JSON.stringify({ id }),
  });

  const userId = request.customer.userId;

  await db
    .delete(todos)
    .where(and(eq(todos.userId, userId as string), eq(todos.id, id)))
    .returning();

  return NextResponse.json(
    {
      data: null,
      message: `Deleted todo ${id}`,
      success: true,
    },
    { status: 200 }
  );
}

export const DELETE = pipe(requiresCustomerAuth, deleteHandler);
