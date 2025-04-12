import { createAction, Property } from '@activepieces/pieces-framework';
import { axigenAuth } from '../common/auth';
import { makeClient } from '../common/client';

export const deleteMail = createAction({
  auth: axigenAuth,
  name: 'deleteMail',
  displayName: 'Delete Mail',
  description: 'Delete an email',
  props: {
    mailId: Property.ShortText({
      displayName: 'Mail ID',
      description: 'The ID of the mail to delete',
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const client = makeClient(auth);
    const { mailId } = propsValue;
    return await client.deleteMail(mailId);
  },
});
