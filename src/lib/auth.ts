import type { APIGatewayProxyEventV2 } from "aws-lambda";

interface CognitoJwtClaims {
  sub: string;
  email?: string;
  [key: string]: any;
}

export const getUserIdFromEvent = (
  event: APIGatewayProxyEventV2
): string | null => {
  const ctx = event.requestContext as any;
  const claims = ctx.authorizer?.jwt?.claims as CognitoJwtClaims | undefined;
  return claims?.sub ?? null;
};
