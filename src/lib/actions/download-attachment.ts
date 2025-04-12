import { createAction, Property } from '@activepieces/pieces-framework';
import { axigenAuth } from '../common/auth';
import { makeClient } from '../common/client';

export const downloadAttachment = createAction({
  auth: axigenAuth,
  name: 'downloadAttachment',
  displayName: 'Download Attachment',
  description: 'Download an attachment from an email',
  props: {
    mailId: Property.ShortText({
      displayName: 'Mail ID',
      description: 'The ID of the mail to download the attachment from',
      required: true,
    }),
    attachmentId: Property.Number({
      displayName: 'Attachment ID',
      description: 'The ID of the attachment to download',
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const client = makeClient(auth);
    const { mailId, attachmentId } = propsValue;
    return await client.downloadAttachment(mailId, attachmentId);
  },
});
