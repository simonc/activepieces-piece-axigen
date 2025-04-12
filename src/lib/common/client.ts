import { PiecePropValueSchema } from '@activepieces/pieces-framework';
import { axigenAuth } from './auth';
import { HttpMessageBody, HttpMethod, QueryParams, httpClient } from '@activepieces/pieces-common';
import {
  AxigenListFoldersResponse,
  AxigenListMailsResponse,
  AxigenLoginResponse,
  AxigenMail,
} from './types';

export class AxigenClient {
  private sessionId: string | null;

  constructor(private server: string, private email: string, private password: string) {
    this.sessionId = null;
  }

  async makeRequest<T extends HttpMessageBody>(
    method: HttpMethod,
    url: string,
    query?: QueryParams,
    body?: object
  ): Promise<T> {
    const headers = { ...this.authHeaders };

    if (this.sessionId) {
      headers['X-Axigen-Session'] = this.sessionId;
    }

    const res = await httpClient.sendRequest<T>({
      method,
      url: `${this.baseUrl}${url}`,
      headers,
      queryParams: query,
      body,
    });
    return res.body;
  }

  private async useOrStartSession() {
    if (this.sessionId) {
      return;
    }

    const response = await this.startSession();
    this.sessionId = response.sessid;
  }

  get authHeaders(): Record<string, string> {
    const usernameAndPassword = Buffer.from(`${this.email}:${this.password}`).toString('base64');
    return { Authorization: `Basic ${usernameAndPassword}` };
  }

  get baseUrl(): string {
    return `${this.server}/api/v1`;
  }

  async copyMail(mailId: string, destinationFolderId: string): Promise<AxigenMail> {
    await this.useOrStartSession();
    return await this.makeRequest<AxigenMail>(HttpMethod.POST, `/mails/${mailId}/copy`, undefined, {
      folderId: destinationFolderId,
    });
  }

  async deleteMail(mailId: string): Promise<AxigenMail> {
    await this.useOrStartSession();
    return await this.makeRequest<AxigenMail>(HttpMethod.DELETE, `/mails/${mailId}`);
  }

  async downloadAttachment(mailId: string, attachmentId: number): Promise<Blob> {
    await this.useOrStartSession();
    return await this.makeRequest<Blob>(HttpMethod.GET, `/mails/${mailId}/attachments/${attachmentId}`);
  }

  async listFolders(): Promise<AxigenListFoldersResponse> {
    await this.useOrStartSession();
    return await this.makeRequest<AxigenListFoldersResponse>(HttpMethod.GET, '/folders');
  }

  async listMails(folderId: string): Promise<AxigenListMailsResponse> {
    await this.useOrStartSession();
    return await this.makeRequest<AxigenListMailsResponse>(HttpMethod.GET, '/mails', { folderId });
  }

  async startSession(): Promise<AxigenLoginResponse> {
    return await this.makeRequest<AxigenLoginResponse>(HttpMethod.POST, '/login');
  }

  async moveMail(mailId: string, destinationFolderId: string): Promise<AxigenMail> {
    await this.useOrStartSession();
    return await this.makeRequest<AxigenMail>(HttpMethod.POST, `/mails/${mailId}/move`, undefined, {
      folderId: destinationFolderId,
    });
  }

  async updateMail(
    mailId: string,
    isUnread: boolean | null,
    isFlagged: boolean | null
  ): Promise<AxigenMail> {
    await this.useOrStartSession();

    const body: Record<string, boolean> = {};

    if (isUnread !== null) {
      body['isUnread'] = isUnread;
    }

    if (isFlagged !== null) {
      body['isFlagged'] = isFlagged;
    }

    return await this.makeRequest<AxigenMail>(
      HttpMethod.PATCH,
      `/mails/${mailId}`,
      undefined,
      body
    );
  }
}

export function makeClient(auth: PiecePropValueSchema<typeof axigenAuth>): AxigenClient {
  const client = new AxigenClient(auth.server, auth.username, auth.password);
  return client;
}
