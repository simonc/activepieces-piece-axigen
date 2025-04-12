import { PieceAuth, Property, PiecePropValueSchema } from '@activepieces/pieces-framework';
import { makeClient } from './client';

export const axigenAuth = PieceAuth.CustomAuth({
  description: 'Authenticate to Axigen Mail Server',
  required: true,
  props: {
    server: Property.ShortText({
      displayName: 'Server URL',
      description: 'Your Axigen webmail server URL',
      required: true,
    }),
    username: Property.ShortText({
      displayName: 'Email Address',
      description: 'Your email address',
      required: true,
    }),
    password: PieceAuth.SecretText({
      displayName: 'Password',
      description: 'Your password',
      required: true,
    }),
  },
  validate: async ({ auth }) => {
    try {
      const client = makeClient(auth);
      await client.startSession();
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid credentials',
      };
    }
  },
});

export type AxigenAuth = PiecePropValueSchema<typeof axigenAuth>;
