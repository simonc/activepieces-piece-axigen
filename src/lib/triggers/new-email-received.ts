import dayjs from 'dayjs';
import {
  createTrigger,
  PiecePropValueSchema,
  TriggerStrategy,
} from '@activepieces/pieces-framework';
import { makeClient } from '../common/client';
import { DedupeStrategy, Polling, pollingHelper } from '@activepieces/pieces-common';
import { axigenAuth } from '../common/auth';
import { FolderDropdown } from '../common/fields';
import { AxigenListMailsResponse } from '../common/types';

const polling: Polling<PiecePropValueSchema<typeof axigenAuth>, { folderId: string }> = {
  strategy: DedupeStrategy.TIMEBASED,
  items: async ({ auth, propsValue: { folderId } }) => {
    const axigenClient = makeClient(auth);
    const mailsList: AxigenListMailsResponse = (await axigenClient.listMails(folderId)) ?? [];
    const items = mailsList.items.map((mail) => ({
      epochMilliSeconds: dayjs(mail.date).valueOf(),
      data: mail,
    }));

    return items;
  },
};

export const newEmailReceived = createTrigger({
  auth: axigenAuth,
  name: 'newEmailReceived',
  displayName: 'New Email',
  description: 'Triggers when a new email is received',
  props: {
    folderId: FolderDropdown({
      displayName: 'Folder',
      description: 'The folder to watch for new emails',
      required: true,
    }),
  },
  sampleData: {
    attachments: [
      {
        contentId: 'Z_BqFTQNcXMyvFveQJahSxKvaW7O8gJEWWzGpWr21Bw=',
        contentType: 'image/png',
        id: 0,
        isInline: false,
        mailId: 'ODBfMTE0XzEzNTQ',
        name: 'some_image.png',
        size: 49331,
      },
    ],
    bcc: '',
    bimiLocation: '',
    cc: '',
    date: '1744407421',
    folderId: '80_114',
    from: 'Jane Doe <jane.dow@test.com>',
    hasAttachments: true,
    id: 'ODBfMTE0XzEzNTZ',
    importance: 'normal',
    isDeleted: false,
    isDraft: false,
    isFlagged: false,
    isItip: false,
    isUnread: true,
    labelIds: [],
    messageId: "<20250411213700.1.b'EEB3DB10AB563856'@mailing.test.com>",
    originalFolderId: '80_114',
    originalMailId: 'ODBfMTE0XzEzNTZ',
    refwFlags: '',
    refwMailId: '',
    refwType: '',
    replyTo: 'Jane Doe <jane.dow@test.com>',
    replyToAll: 'john.doe@test.com',
    returnReceipt: false,
    sender: '',
    size: 71607,
    snippet: 'Hi there\r\nHow do you do?',
    subject: 'Some test email',
    to: 'john.doe@test.com',
  },
  type: TriggerStrategy.POLLING,
  onEnable: async ({ auth, propsValue, store }) => {
    await pollingHelper.onEnable(polling, {
      auth: auth,
      store: store,
      propsValue: {
        folderId: propsValue.folderId,
      },
    });
  },
  onDisable: async ({ auth, propsValue, store }) => {
    await pollingHelper.onDisable(polling, {
      auth: auth,
      store: store,
      propsValue: {
        folderId: propsValue.folderId,
      },
    });
  },
  run: async ({ auth, files, propsValue, store }) => {
    return await pollingHelper.poll(polling, {
      auth: auth,
      store: store,
      propsValue: {
        folderId: propsValue.folderId,
      },
      files: files,
    });
  },
  async test({ auth, files, propsValue, store }) {
    return await pollingHelper.test(polling, {
      auth: auth,
      store: store,
      propsValue: {
        folderId: propsValue.folderId,
      },
      files: files,
    });
  },
});
