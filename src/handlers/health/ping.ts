import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async () => ({
  statusCode: 200,
  body: JSON.stringify({
    status: 'ok',
    service: 'invoice-deck-backend',
  }),
});
