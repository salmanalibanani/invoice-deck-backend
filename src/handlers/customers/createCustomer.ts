import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, CUSTOMERS_TABLE } from '../../lib/dynamo';
import { getUserIdFromEvent } from '../../lib/auth';
import { ok, badRequest, serverError, unauthorized } from '../../lib/responses';
import type { Customer } from '../../lib/types';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const userId = getUserIdFromEvent(event);
  if (!userId) {
    return unauthorized();
  }

  if (!event.body) {
    return badRequest('name is required');
  }

  let payload: Partial<Customer>;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return badRequest('Invalid JSON payload');
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : undefined;
  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : undefined;

  if (!name) {
    return badRequest('name is required');
  }

  const customerId = `cust_${Date.now()}`;
  const createdAt = new Date().toISOString();

  const customer: Customer = {
    userId,
    customerId,
    name,
    createdAt,
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
  };

  try {
    await ddb.send(
      new PutCommand({
        TableName: CUSTOMERS_TABLE,
        Item: customer,
      }),
    );
  } catch (err) {
    console.error('Failed to create customer', err);
    return serverError();
  }

  return ok({ customerId, createdAt });
};
