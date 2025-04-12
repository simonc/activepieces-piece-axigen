import { createPiece } from '@activepieces/pieces-framework';
import { axigenAuth } from './lib/common/auth';
import { newEmailReceived } from './lib/triggers/new-email-received';
import { PieceCategory } from '@activepieces/shared';
import { copyMail, deleteMail, downloadAttachment, moveMail, updateMail } from './lib/actions';

export const axigen = createPiece({
  displayName: 'Axigen',
  auth: axigenAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://wanda.cubyx.pro/react-login/build/5c350c36157a70cbe4d3.svg',
  categories: [PieceCategory.COMMUNICATION],
  authors: ['simonc'],
  actions: [copyMail, deleteMail, downloadAttachment, moveMail, updateMail],
  triggers: [newEmailReceived],
});
