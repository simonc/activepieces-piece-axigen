import { createAction, Property } from '@activepieces/pieces-framework';
import { axigenAuth } from '../common/auth';
import { makeClient } from '../common/client';
import { FolderDropdown } from '../common/fields';

export const moveMail = createAction({
  auth: axigenAuth,
  name: 'moveMail',
  displayName: 'Move Mail',
  description: 'Move an email from one folder to another',
  props: {
    mailId: Property.ShortText({
      displayName: 'Mail ID',
      description: 'The ID of the mail to move',
      required: true,
    }),
    destinationFolderId: FolderDropdown({
      displayName: 'Destination Folder ID',
      description: 'The ID of the folder to move the mail to',
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const client = makeClient(auth);
    const { mailId, destinationFolderId } = propsValue;
    return await client.moveMail(mailId, destinationFolderId);
  },
});
