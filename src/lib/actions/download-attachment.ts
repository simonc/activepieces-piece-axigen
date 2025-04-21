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
    outputFormat: Property.StaticDropdown({
      displayName: 'Output Format',
      description: 'The format of the output',
      required: true,
      options: {
        options: [
          { label: 'Original', value: 'original' },
          { label: 'Base64', value: 'base64' },
        ],
      },
      defaultValue: 'original',
    }),
  },
  async run({ auth, propsValue }) {
    const client = makeClient(auth);
    const { mailId, attachmentId, outputFormat } = propsValue;
    const content = await client.downloadAttachment(mailId, attachmentId);

    if (outputFormat === 'original') {
      return content;
    }

    const base64content = Buffer.from(await content.arrayBuffer()).toString('base64');

    return base64content;
  },
});
