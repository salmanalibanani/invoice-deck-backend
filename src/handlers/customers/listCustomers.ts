import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, CUSTOMERS_TABLE } from '../../lib/dynamo';
import { getUserIdFromEvent } from '../../lib/auth';
import { ok, serverError, unauthorized } from '../../lib/responses';
import type { Customer } from '../../lib/types';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const userId = getUserIdFromEvent(event);
  if (!userId) {
    return unauthorized();
  }

  try {
    const result = await ddb.send(
      new QueryCommand({
        TableName: CUSTOMERS_TABLE,
        KeyConditionExpression: 'userId = :uid',
        ExpressionAttributeValues: {
          ':uid': userId,
        },
      }),
    );

    const items =
      result.Items?.map((item) => {
        const customer = item as Customer;
        return {
          customerId: customer.customerId,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          createdAt: customer.createdAt,
        };
      }) ?? [];

    return ok({ items });
  } catch (err) {
    console.error('Failed to list customers', err);
    return serverError();
  }
};
