export const ok = (body: unknown) => ({
  statusCode: 200,
  body: JSON.stringify(body),
});

export const badRequest = (message: string) => ({
  statusCode: 400,
  body: JSON.stringify({ error: message }),
});

export const unauthorized = () => ({
  statusCode: 401,
  body: JSON.stringify({ error: 'Unauthorized' }),
});

export const serverError = () => ({
  statusCode: 500,
  body: JSON.stringify({ error: 'Internal server error' }),
});
