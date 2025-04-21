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

  async makeRequest(method: HttpMethod, url: string, query?: QueryParams, body?: object) {
    const headers = { ...this.authHeaders };

    if (this.sessionId) {
      headers['X-Axigen-Session'] = this.sessionId;
    }

    return await httpClient.sendRequest({
      method,
      url: `${this.baseUrl}${url}`,
      headers,
      queryParams: query,
      body,
    });
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
    const { body } = await this.makeRequest(HttpMethod.POST, `/mails/${mailId}/copy`, undefined, {
      destinationFolderId,
    });
    return body;
  }

  async deleteMail(mailId: string): Promise<AxigenMail> {
    await this.useOrStartSession();
    const { body } = await this.makeRequest(HttpMethod.DELETE, `/mails/${mailId}`);
    return body;
  }

  async downloadAttachment(
    mailId: string,
    attachmentId: number,
    outputFormat: 'original' | 'base64'
  ): Promise<Blob | string> {
    await this.useOrStartSession();
    const response = await this.makeRequest(
      HttpMethod.GET,
      `/mails/${mailId}/attachments/${attachmentId}`
    );

    if (outputFormat === 'original') {
      return response.body;
    }

    return Buffer.from(response.body).toString('base64');
  }

  async listFolders(): Promise<AxigenListFoldersResponse> {
    await this.useOrStartSession();
    const { body } = await this.makeRequest(HttpMethod.GET, '/folders');
    return body;
  }

  async listMails(folderId: string): Promise<AxigenListMailsResponse> {
    await this.useOrStartSession();
    const { body } = await this.makeRequest(HttpMethod.GET, '/mails', { folderId });
    return body;
  }

  async startSession(): Promise<AxigenLoginResponse> {
    const { body } = await this.makeRequest(HttpMethod.POST, '/login');
    return body;
  }

  async moveMail(mailId: string, destinationFolderId: string): Promise<AxigenMail> {
    await this.useOrStartSession();
    const { body } = await this.makeRequest(HttpMethod.POST, `/mails/${mailId}/move`, undefined, {
      destinationFolderId,
    });
    return body;
  }

  async updateMail(
    mailId: string,
    isUnread: boolean | null,
    isFlagged: boolean | null
  ): Promise<AxigenMail> {
    await this.useOrStartSession();

    const reqBody: Record<string, boolean> = {};

    if (isUnread !== null) {
      reqBody['isUnread'] = isUnread;
    }

    if (isFlagged !== null) {
      reqBody['isFlagged'] = isFlagged;
    }

    const { body } = await this.makeRequest(
      HttpMethod.PATCH,
      `/mails/${mailId}`,
      undefined,
      reqBody
    );

    return body;
  }
}

export function makeClient(auth: PiecePropValueSchema<typeof axigenAuth>): AxigenClient {
  const client = new AxigenClient(auth.server, auth.username, auth.password);
  return client;
}
