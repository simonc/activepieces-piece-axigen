import { Property } from '@activepieces/pieces-framework';
import { AxigenClient } from './client';

type authProps = {
  username: string;
  password: string;
  server: string;
};

export function FolderDropdown(config = {}) {
  return Property.Dropdown({
    displayName: 'Folder',
    description: 'A folder from your email account',
    required: true,
    refreshers: [],
    options: async ({ auth }) => {
      if (!auth) {
        return {
          disabled: true,
          placeholder: 'Please authenticate first',
          options: [],
        };
      }

      const authValue = auth as authProps;

      try {
        const client = new AxigenClient(authValue.server, authValue.username, authValue.password);

        const foldersList = await client.listFolders();

        return {
          options: foldersList.items.map((folder) => {
            return {
              label: folder.name,
              value: folder.id,
            };
          }),
        };
      } catch (error) {
        console.error('Error listing folders:', error);
        return {
          disabled: true,
          placeholder: 'Error fetching folders. Please check credentials.',
          options: [],
        };
      }
    },
    ...config,
  });
}
