import { createAction, Property } from '@activepieces/pieces-framework';
import { axigenAuth } from '../common/auth';
import { makeClient } from '../common/client';
import { FolderDropdown } from '../common/fields';

export const updateMail = createAction({
  auth: axigenAuth,
  name: 'updateMail',
  displayName: 'Update Mail',
  description: 'Update an email read status and flagging',
  props: {
    mailId: Property.ShortText({
      displayName: 'Mail ID',
      description: 'The ID of the mail to update',
      required: true,
    }),
    readStatus: Property.StaticDropdown({
      displayName: 'Set read status',
      description: 'Set the read status of the mail',
      required: true,
      options: {
        options: [
          { label: 'Do not change', value: '' },
          { label: 'Read', value: 'yes' },
          { label: 'Unread', value: 'no' },
        ],
      },
      defaultValue: '',
    }),
    flagged: Property.StaticDropdown({
      displayName: 'Set flagged status',
      description: 'Set the flagged status of the mail',
      required: true,
      options: {
        options: [
          { label: 'Do not change', value: '' },
          { label: 'Flagged', value: 'yes' },
          { label: 'Not flagged', value: 'no' },
        ],
      },
      defaultValue: '',
    }),
  },
  async run({ auth, propsValue }) {
    const client = makeClient(auth);
    const { mailId, readStatus, flagged } = propsValue;

    let isUnread = null;
    if (readStatus === 'yes') {
      isUnread = false;
    } else if (readStatus === 'no') {
      isUnread = true;
    }

    let isFlagged = null;
    if (flagged === 'yes') {
      isFlagged = true;
    } else if (flagged === 'no') {
      isFlagged = false;
    }

    return await client.updateMail(mailId, isUnread, isFlagged);
  },
});
