import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FishbowlInventoryApi implements ICredentialType {
	name = 'fishbowlInventoryApi';
	displayName = 'Fishbowl Inventory API';
	documentationUrl = 'https://docs.fishbowlinventory.com/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'API key for Fishbowl Inventory authentication',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.fishbowlinventory.com/v1',
			required: true,
			description: 'Base URL for the Fishbowl Inventory API',
		},
	];
}