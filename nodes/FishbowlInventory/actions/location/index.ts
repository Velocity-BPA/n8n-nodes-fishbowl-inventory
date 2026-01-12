/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { fishbowlApiRequest, fishbowlApiRequestAllItems } from '../../transport';
import { buildFilterQuery, cleanObject, simplifyOutputData, formatInventoryResponse } from '../../utils';

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const locationId = this.getNodeParameter('locationId', index) as string;
  const byName = this.getNodeParameter('byName', index, false) as boolean;

  let endpoint: string;
  if (byName) {
    endpoint = `/location?name=${encodeURIComponent(locationId)}`;
  } else {
    endpoint = `/location/${locationId}`;
  }

  const response = await fishbowlApiRequest.call(this, 'GET', endpoint);
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
      '/location',
      'locations',
      {},
      query,
    );
    return simplifyOutputData(items);
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    query.pageSize = limit;
    query.pageNumber = 1;

    const response = await fishbowlApiRequest.call(this, 'GET', '/location', {}, query);
    const items = response.results || response.locations || [];
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

  // Handle parent location
  if (additionalFields.parentId) {
    body.parentId = additionalFields.parentId;
  }

  // Handle location group
  if (additionalFields.locationGroupId) {
    body.locationGroup = { id: additionalFields.locationGroupId };
    delete body.locationGroupId;
  }

  // Handle location type
  if (additionalFields.locationTypeId) {
    body.locationType = { id: additionalFields.locationTypeId };
    delete body.locationTypeId;
  }

  const response = await fishbowlApiRequest.call(this, 'POST', '/location', body);
  return simplifyOutputData([response]);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const locationId = this.getNodeParameter('locationId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const body: IDataObject = cleanObject(updateFields);

  // Handle location group
  if (updateFields.locationGroupId) {
    body.locationGroup = { id: updateFields.locationGroupId };
    delete body.locationGroupId;
  }

  // Handle location type
  if (updateFields.locationTypeId) {
    body.locationType = { id: updateFields.locationTypeId };
    delete body.locationTypeId;
  }

  const response = await fishbowlApiRequest.call(this, 'PUT', `/location/${locationId}`, body);
  return simplifyOutputData([response]);
}

export async function deleteLocation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const locationId = this.getNodeParameter('locationId', index) as string;

  await fishbowlApiRequest.call(this, 'DELETE', `/location/${locationId}`);
  return simplifyOutputData([{ success: true, locationId }]);
}

export async function getInventory(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const locationId = this.getNodeParameter('locationId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index, true) as boolean;

  const query: IDataObject = {};

  if (!returnAll) {
    const limit = this.getNodeParameter('limit', index) as number;
    query.pageSize = limit;
    query.pageNumber = 1;
  }

  const response = await fishbowlApiRequest.call(
    this,
    'GET',
    `/location/${locationId}/inventory`,
    {},
    query,
  );

  const inventory = Array.isArray(response) ? response : response.inventory || response.results || [];
  const formatted = formatInventoryResponse(inventory);

  return simplifyOutputData([formatted]);
}

export async function moveAllInventory(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const fromLocationId = this.getNodeParameter('fromLocationId', index) as number;
  const toLocationId = this.getNodeParameter('toLocationId', index) as number;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    toLocation: { id: toLocationId },
    ...cleanObject(additionalFields),
  };

  const response = await fishbowlApiRequest.call(
    this,
    'POST',
    `/location/${fromLocationId}/move-all`,
    body,
  );
  return simplifyOutputData([response]);
}
