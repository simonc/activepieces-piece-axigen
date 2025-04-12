// l: lookup permission (folder is visible in lists)
// r: read permission (folder can be loaded)
// s: seen permission (items can be marked as seen / unseen)
// w: write flags permission (set or clear flags other than seen and deleted)
// i: insert permission (items can be inserted into this folder)
// k: create sub-folder permission (allows the creation of sub-folders under the current folder)
// x: delete folder permission (allows the deletion of this folder)
// t: mark items as deleted permission (items can be marked as deleted / not deleted)
// e: expunge permission (allow expunge to be performed on this folder)
// a: acl permission (allows the management of permissions for this folder)
export type AxigenFolderPermission = 'l' | 'r' | 's' | 'w' | 'i' | 'k' | 'x' | 't' | 'e' | 'a';

export type AxigenFolder = {
  id: string;
  name: string;
  parentId: string;
  role: '' | 'inbox' | 'drafts' | 'sent' | 'trash' | 'junk' | 'archive' | 'filtered';
  ownerUsername: string;
  ownerFullname: string;
  // The folder size in bytes
  folderSize: number;
  // The type of items contained in this folder
  folderType:
    | 'mails'
    | 'events'
    | 'tasks'
    | 'notes'
    | 'contacts'
    | 'public_container'
    | 'shared_namespace'
    | 'shared_container';
  accessMode: 'local' | 'public' | 'shared';
  totalItems: number;
  unreadItems: number;
  permissions: AxigenFolderPermission[];
};

export type AxigenMail = {
  id: string;
  folderId: string;
  // The mail size in bytes
  size: number;
  from: string;
  to: string;
  cc: string;
  bcc: string;
  // The Reply-To header if present, otherwise the From header value
  replyTo: string;
  // The merged To and Cc headers
  replyToAll: string;
  sender: string;
  messageId: string;
  subject: string;
  // A text snippet of the mail body
  snippet: string;
  // The date the mail was actually received, sent or saved by the server as timestamp (UTC)
  // Note: this is not the "Date" header of the mail but the internal server date which is more accurate
  date: string;
  isUnread: boolean;
  isFlagged: boolean;
  isDraft: boolean;
  // The replied / forwarded mail flag
  refwFlags: '' | 're' | 'fw' | 'refw';
  // Used for Drafts only! Whether the mail is a reply or a forward.
  // The mail cannot be both a reply and a forward (“refw” is an invalid value)
  refwType: '' | 're' | 'fw';
  // Used for Drafts only! Set only if refwType is either "re" or "fw".
  refwMailId: string;
  // The deleted flag value
  // Note: this flag is only set by IMAP clients (in IMAP mails can be marked as deleted
  // but will still be returned until expunged)
  isDeleted: boolean;
  hasAttachments: boolean;
  // The calendar flag value
  isItip: boolean;
  // True if the mail carries a disposition notification header
  returnReceipt: boolean;
  // The "Importance" header value
  importance: 'normal' | 'low' | 'high';
  // The original folder ID when searching
  originalFolderId: string;
  // The original mail ID when searching
  originalMailId: string;
  attachments: AxigenAttachment[];
  labelIds: string[];
  // Available from Axigen X6 (10.6)
  // BIMI Location; if not empty, used by the client to request the BIMI indicator (SVG logotype)
  bimiLocation: string;
};

export type AxigenConversation = {
  id: string;
  subject: string;
  snippet: string;
  date: string;
  isUnread: boolean;
  isFlagged: boolean;
  refwFlags: '' | 're' | 'fw' | 'refw';
  hasAttachments: boolean;
  // The greatest "Importance" header value of the mails in the conversation
  importance: 'normal' | 'low' | 'high';
  labelIds: string[];
  attachments: AxigenAttachment[];
  // All "From" full email addresses, including the name part, in all emails in the conversation,
  // deduped by email address (email address part)
  participants: {
    fullEmailAddress: string;
    isMe: boolean;
    hasUnreadMessages: boolean;
  }[];
  // All the recipients (full email addresses, including the name part) in the emails the current user has sent,
  // deduped by email address (email address part)
  myRecipients: {
    fullEmailAddress: string;
    isMe: boolean;
    isTo: boolean;
    isCc: boolean;
    isBcc: boolean;
  }[];
  hasDrafts: boolean;
  mailCount: string;
  mails: {
    mailId: string;
    normalizedMessageId: string;
    folderId: string;
    isUnread: boolean;
    isFlagged: boolean;
    isDraft: boolean;
    originalFolderId: string;
    originalMailId: string;
  }[];
};

export type AxigenAttachment = {
  id: number;
  mailId: string;
  name: string;
  contentId?: string;
  contentType: string;
  // The attachment size in bytes
  size: number;
  // True if it's an inline attachment;
  // Note: this is not related to the Content-Disposition property;
  // it's set to true only for attachments in multipart/related messages
  // that are referenced in the body using a cid
  isInline: boolean;
};

export type AxigenContact = {
  id: string;
  folderId: string;
  isDistributionList: boolean;
  name: string;
  // The defined email address
  // Note: this field can be either the email, business email or home email (in this order)
  // depending on which one is actually defined
  email: string;
  firstName: string;
  lastName: string;
  nickName: string;
  reversedName: string;
};

export type AxigenLabel = {
  id: string;
  name: string;
};

export type AxigenMessagePart = {
  // The value of the Content-Type header (e.g. "multipart/alternative", "text/html")
  contentType: string;
  id: number;
  // List of nested message parts
  parts: AxigenMessagePart[];
  headers: {
    name: string; // The name of the part header (e.g. "Content-Id", "Content-Disposition", "Content-Type")
    value: string; // The raw value of the part header (e.g. "<cid_b1@cid_b1>\n", "inline;\n\tfilename=\"b1_png.png\"\n", "image/png;\n\tname=\"b1_png.png\"\n")
  }[];
  // Present only if the message part is an attachment.
  // Retrieved from Content-Disposition's "filename" attribute or "name" attributes, in this order
  fileName?: string;
  // The approximate body part size in bytes (the actual size can depend on the encoding overhead)
  estimatedSize: number;
};

export type AxigenMessagePartData = {
  id: number;
  // The base64 encoded body part content
  data: string;
  // HTML parts bigger than 2MB in size are returned truncated.
  // The full decoded body can be retrieved using a separate endpoint.
  isTruncated: boolean;
  hasExternalImages: boolean;
  // The raw offset of the start of the first quoted part identified
  quotedOffset: number;
  quotedPartsOffsets: {
    start: number; // start of quoted part
    end: number; // end of quoted part
  }[];
};

export type AxigenListMailsResponse = {
  // A generated token that can be used for synchronization purposes to check if any
  // changes occurred since the last interogation
  syncToken: string;
  // The total number of items in the provided folder
  totalItems: number;
  sortInfo: {
    // The current sorting field
    field:
      | 'subject'
      | 'from'
      | 'to'
      | 'date'
      | 'size'
      | 'isUnread'
      | 'isFlagged'
      | 'importance'
      | 'hasAttachments'
      | 'folderName';
    // The current sorting direction
    direction: 'ASC' | 'DESC';
    // The row index associated with the provided activeMailId
    activeRowIndex: number;
  };
  items: AxigenMail[];
};

export type AxigenListFoldersResponse = {
  // A generated token that can be used for synchronization purposes to check if any
  // changes occurred since the last interogation
  syncToken: string;
  items: AxigenFolder[];
};

export type AxigenLoginResponse = {
  // new session ID for the current session
  sessid: string;
};
