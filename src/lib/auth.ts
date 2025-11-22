import type { APIGatewayProxyEventV2 } from 'aws-lambda';

interface CognitoJwtClaims {
  sub: string;
  email?: string;
  [key: string]: any;
}

export const getUserIdFromEvent = (event: APIGatewayProxyEventV2): string | null => {
  const claims = event.requestContext?.authorizer?.jwt?.claims as CognitoJwtClaims | undefined;
  return claims?.sub ?? null;
};
