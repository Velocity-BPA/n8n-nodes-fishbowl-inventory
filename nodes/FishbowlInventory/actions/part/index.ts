/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { fishbowlApiRequest, fishbowlApiRequestAllItems } from '../../transport';
import {
  buildFilterQuery,
  buildPartObject,
  cleanObject,
  simplifyOutputData,
  formatInventoryResponse,
} from '../../utils';

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const partId = this.getNodeParameter('partId', index) as string;
  const byNumber = this.getNodeParameter('byNumber', index, false) as boolean;

  let endpoint: string;
  if (byNumber) {
    endpoint = `/part?number=${encodeURIComponent(partId)}`;
  } else {
    endpoint = `/part/${partId}`;
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
    const items = await fishbowlApiRequestAllItems.call(this, 'GET', '/part', 'parts', {}, query);
    return simplifyOutputData(items);
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    query.pageSize = limit;
    query.pageNumber = 1;

    const response = await fishbowlApiRequest.call(this, 'GET', '/part', {}, query);
    const items = response.results || response.parts || [];
    return simplifyOutputData(items.slice(0, limit));
  }
}

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const partNumber = this.getNodeParameter('partNumber', index) as string;
  const description = this.getNodeParameter('description', index) as string;
  const partType = this.getNodeParameter('partType', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body = buildPartObject({
    partNumber,
    description,
    partType,
    ...additionalFields,
  });

  const response = await fishbowlApiRequest.call(this, 'POST', '/part', body);
  return simplifyOutputData([response]);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const partId = this.getNodeParameter('partId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const body = buildPartObject(updateFields);

  const response = await fishbowlApiRequest.call(this, 'PUT', `/part/${partId}`, body);
  return simplifyOutputData([response]);
}

export async function deletePart(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const partId = this.getNodeParameter('partId', index) as string;

  await fishbowlApiRequest.call(this, 'DELETE', `/part/${partId}`);
  return simplifyOutputData([{ success: true, partId }]);
}

export async function getInventory(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const partId = this.getNodeParameter('partId', index) as string;
  const locationGroupId = this.getNodeParameter('locationGroupId', index, '') as string;

  let endpoint = `/part/${partId}/inventory`;
  if (locationGroupId) {
    endpoint += `?locationGroupId=${locationGroupId}`;
  }

  const response = await fishbowlApiRequest.call(this, 'GET', endpoint);
  const inventory = Array.isArray(response) ? response : response.inventory || [response];
  const formatted = formatInventoryResponse(inventory);

  return simplifyOutputData([formatted]);
}

export async function addInventory(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const partId = this.getNodeParameter('partId', index) as string;
  const locationId = this.getNodeParameter('locationId', index) as number;
  const qty = this.getNodeParameter('qty', index) as number;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    location: { id: locationId },
    qty,
    ...cleanObject(additionalFields),
  };

  if (additionalFields.cost !== undefined) {
    body.cost = additionalFields.cost;
  }

  if (additionalFields.note) {
    body.note = additionalFields.note;
  }

  if (additionalFields.trackingNumber) {
    body.tracking = {
      trackingNumber: additionalFields.trackingNumber,
    };
  }

  const response = await fishbowlApiRequest.call(this, 'POST', `/part/${partId}/inventory`, body);
  return simplifyOutputData([response]);
}

export async function cycleInventory(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const partId = this.getNodeParameter('partId', index) as string;
  const locationId = this.getNodeParameter('locationId', index) as number;
  const qty = this.getNodeParameter('qty', index) as number;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    location: { id: locationId },
    qty,
    ...cleanObject(additionalFields),
  };

  const response = await fishbowlApiRequest.call(this, 'POST', `/part/${partId}/cycle-count`, body);
  return simplifyOutputData([response]);
}

export async function moveInventory(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const partId = this.getNodeParameter('partId', index) as string;
  const fromLocationId = this.getNodeParameter('fromLocationId', index) as number;
  const toLocationId = this.getNodeParameter('toLocationId', index) as number;
  const qty = this.getNodeParameter('qty', index) as number;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    fromLocation: { id: fromLocationId },
    toLocation: { id: toLocationId },
    qty,
    ...cleanObject(additionalFields),
  };

  const response = await fishbowlApiRequest.call(this, 'POST', `/part/${partId}/move`, body);
  return simplifyOutputData([response]);
}

export async function scrapInventory(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const partId = this.getNodeParameter('partId', index) as string;
  const locationId = this.getNodeParameter('locationId', index) as number;
  const qty = this.getNodeParameter('qty', index) as number;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    location: { id: locationId },
    qty,
    ...cleanObject(additionalFields),
  };

  if (additionalFields.reason) {
    body.reason = additionalFields.reason;
  }

  const response = await fishbowlApiRequest.call(this, 'POST', `/part/${partId}/scrap`, body);
  return simplifyOutputData([response]);
}

export async function getTracking(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const partId = this.getNodeParameter('partId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'GET', `/part/${partId}/tracking`);
  const items = Array.isArray(response) ? response : response.tracking || [response];
  return simplifyOutputData(items);
}
