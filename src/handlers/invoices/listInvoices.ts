import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, INVOICES_TABLE } from '../../lib/dynamo';
import { getUserIdFromEvent } from '../../lib/auth';
import { ok, serverError, unauthorized } from '../../lib/responses';
import type { Invoice } from '../../lib/types';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const userId = getUserIdFromEvent(event);
  if (!userId) {
    return unauthorized();
  }

  try {
    const result = await ddb.send(
      new QueryCommand({
        TableName: INVOICES_TABLE,
        KeyConditionExpression: 'userId = :uid',
        ExpressionAttributeValues: {
          ':uid': userId,
        },
      }),
    );

    const items =
      result.Items?.map((item) => {
        const invoice = item as Invoice;
        return {
          invoiceId: invoice.invoiceId,
          customerId: invoice.customerId,
          amount: invoice.amount,
          status: invoice.status,
          createdAt: invoice.createdAt,
          dueDate: invoice.dueDate,
        };
      }) ?? [];

    return ok({ items });
  } catch (err) {
    console.error('Failed to list invoices', err);
    return serverError();
  }
};
