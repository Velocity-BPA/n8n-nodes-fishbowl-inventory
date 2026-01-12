/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class FishbowlInventoryApi implements ICredentialType {
  name = 'fishbowlInventoryApi';
  displayName = 'Fishbowl Inventory API';
  documentationUrl = 'https://www.fishbowlinventory.com/wiki/Fishbowl_API';
  properties: INodeProperties[] = [
    {
      displayName: 'Server URL',
      name: 'serverUrl',
      type: 'string',
      default: '',
      required: true,
      placeholder: 'https://fishbowl.yourcompany.com',
      description: 'Your Fishbowl server URL (without trailing slash)',
    },
    {
      displayName: 'Port',
      name: 'port',
      type: 'number',
      default: 443,
      required: false,
      description: 'Server port (default: 443 for HTTPS)',
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
      required: true,
      description: 'Fishbowl username with API access',
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'User password',
    },
    {
      displayName: 'Application Name',
      name: 'appName',
      type: 'string',
      default: 'n8n Integration',
      required: true,
      description: 'Application name for identification in Fishbowl',
    },
    {
      displayName: 'Application ID',
      name: 'appId',
      type: 'number',
      default: 1234,
      required: true,
      description: 'Unique application ID (any unique number)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.serverUrl}}:{{$credentials.port || 443}}',
      url: '/api/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        appName: '={{$credentials.appName}}',
        appDescription: 'n8n workflow automation integration - credential test',
        appId: '={{$credentials.appId}}',
        username: '={{$credentials.username}}',
        password: '={{$credentials.password}}',
      },
    },
  };
}
