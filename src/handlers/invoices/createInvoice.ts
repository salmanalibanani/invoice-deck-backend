import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, INVOICES_TABLE } from '../../lib/dynamo';
import { getUserIdFromEvent } from '../../lib/auth';
import { ok, badRequest, serverError, unauthorized } from '../../lib/responses';
import type { Invoice } from '../../lib/types';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const userId = getUserIdFromEvent(event);
  if (!userId) {
    return unauthorized();
  }

  if (!event.body) {
    return badRequest('amount and customerId are required');
  }

  let payload: Partial<Invoice> & { amount?: unknown; customerId?: unknown; dueDate?: unknown };
  try {
    payload = JSON.parse(event.body);
  } catch {
    return badRequest('Invalid JSON payload');
  }

  const amount = typeof payload.amount === 'number' ? payload.amount : Number(payload.amount);
  const customerId = typeof payload.customerId === 'string' ? payload.customerId : undefined;
  const dueDate = typeof payload.dueDate === 'string' ? payload.dueDate : undefined;

  if (!customerId || !amount || Number.isNaN(amount) || amount <= 0) {
    return badRequest('amount and customerId are required and amount must be a positive number');
  }

  const invoiceId = `inv_${Date.now()}`;
  const createdAt = new Date().toISOString();

  const invoice: Invoice = {
    userId,
    invoiceId,
    customerId,
    amount,
    status: 'Draft',
    createdAt,
    ...(dueDate ? { dueDate } : {}),
  };

  try {
    await ddb.send(
      new PutCommand({
        TableName: INVOICES_TABLE,
        Item: invoice,
      }),
    );
  } catch (err) {
    console.error('Failed to create invoice', err);
    return serverError();
  }

  return ok({ invoiceId, createdAt });
};
