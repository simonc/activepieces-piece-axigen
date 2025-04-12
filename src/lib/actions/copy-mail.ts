import { createAction, Property } from '@activepieces/pieces-framework';
import { axigenAuth } from '../common/auth';
import { makeClient } from '../common/client';
import { FolderDropdown } from '../common/fields';

export const copyMail = createAction({
  auth: axigenAuth,
  name: 'copyMail',
  displayName: 'Copy Mail',
  description: 'Copy an email from one folder to another',
  props: {
    mailId: Property.ShortText({
      displayName: 'Mail ID',
      description: 'The ID of the mail to copy',
      required: true,
    }),
    destinationFolderId: FolderDropdown({
      displayName: 'Destination Folder ID',
      description: 'The ID of the folder to copy the mail to',
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const client = makeClient(auth);
    const { mailId, destinationFolderId } = propsValue;
    return await client.copyMail(mailId, destinationFolderId);
  },
});
