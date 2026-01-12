/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { fishbowlApiRequest, fishbowlApiRequestAllItems } from '../../transport';
import { buildFilterQuery, cleanObject, simplifyOutputData } from '../../utils';

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const locationGroupId = this.getNodeParameter('locationGroupId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'GET', `/location-group/${locationGroupId}`);
  return simplifyOutputData([response]);
}

export async function getAll(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

  const query = buildFilterQuery(filters);

  if (returnAll) {
    const items = await fishbowlApiRequestAllItems.call(
      this,
      'GET',
      '/location-group',
      'locationGroups',
      {},
      query,
    );
    return simplifyOutputData(items);
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    query.pageSize = limit;
    query.pageNumber = 1;

    const response = await fishbowlApiRequest.call(this, 'GET', '/location-group', {}, query);
    const items = response.results || response.locationGroups || [];
    return simplifyOutputData(items.slice(0, limit));
  }
}

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    name,
    ...cleanObject(additionalFields),
  };

  const response = await fishbowlApiRequest.call(this, 'POST', '/location-group', body);
  return simplifyOutputData([response]);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const locationGroupId = this.getNodeParameter('locationGroupId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const body: IDataObject = cleanObject(updateFields);

  const response = await fishbowlApiRequest.call(
    this,
    'PUT',
    `/location-group/${locationGroupId}`,
    body,
  );
  return simplifyOutputData([response]);
}

export async function deleteLocationGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const locationGroupId = this.getNodeParameter('locationGroupId', index) as string;

  await fishbowlApiRequest.call(this, 'DELETE', `/location-group/${locationGroupId}`);
  return simplifyOutputData([{ success: true, locationGroupId }]);
}

export async function getLocations(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const locationGroupId = this.getNodeParameter('locationGroupId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index, true) as boolean;

  const query: IDataObject = {
    locationGroupId,
  };

  if (!returnAll) {
    const limit = this.getNodeParameter('limit', index) as number;
    query.pageSize = limit;
    query.pageNumber = 1;
  }

  const response = await fishbowlApiRequest.call(this, 'GET', '/location', {}, query);
  const items = response.results || response.locations || [];
  return simplifyOutputData(items);
}
