import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, INVOICES_TABLE } from '../../lib/dynamo';
import { getUserIdFromEvent } from '../../lib/auth';
import { ok, badRequest, serverError, unauthorized } from '../../lib/responses';
import type { Invoice } from '../../lib/types';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const userId = getUserIdFromEvent(event);
  if (!userId) {
    return unauthorized();
  }

  const invoiceId = event.pathParameters?.invoiceId;
  if (!invoiceId) {
    return badRequest('invoiceId is required');
  }

  try {
    const result = await ddb.send(
      new GetCommand({
        TableName: INVOICES_TABLE,
        Key: { userId, invoiceId },
      }),
    );

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Invoice not found' }),
      };
    }

    const invoice = result.Item as Invoice;
    return ok(invoice);
  } catch (err) {
    console.error('Failed to get invoice', err);
    return serverError();
  }
};
