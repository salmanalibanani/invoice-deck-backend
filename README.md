# invoice-deck-backend

Serverless AWS backend for the Invoice Deck mobile invoicing app (iOS/Android). Built with Node.js 20, TypeScript, and the Serverless Framework.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the TypeScript sources:
   ```bash
   npm run build
   ```
3. Deploy to AWS:
   ```bash
   npm run deploy
   ```

## Notes

- Update `serverless.yml` to replace `YOUR_USER_POOL_ID` and `YOUR_USER_POOL_CLIENT_ID` with your Cognito User Pool values.
- Deploying will provision two DynamoDB tables: `Invoices` and `Customers`.
