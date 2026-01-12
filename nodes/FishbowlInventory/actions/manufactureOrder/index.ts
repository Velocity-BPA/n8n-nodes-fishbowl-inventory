/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { fishbowlApiRequest, fishbowlApiRequestAllItems } from '../../transport';
import { buildFilterQuery, buildLineItem, cleanObject, simplifyOutputData, formatDate } from '../../utils';

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const moId = this.getNodeParameter('moId', index) as string;
  const byNumber = this.getNodeParameter('byNumber', index, false) as boolean;

  let endpoint: string;
  if (byNumber) {
    endpoint = `/manufacture-order?number=${encodeURIComponent(moId)}`;
  } else {
    endpoint = `/manufacture-order/${moId}`;
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
      '/manufacture-order',
      'manufactureOrders',
      {},
      query,
    );
    return simplifyOutputData(items);
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    query.pageSize = limit;
    query.pageNumber = 1;

    const response = await fishbowlApiRequest.call(this, 'GET', '/manufacture-order', {}, query);
    const items = response.results || response.manufactureOrders || [];
    return simplifyOutputData(items.slice(0, limit));
  }
}

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const partId = this.getNodeParameter('partId', index) as number;
  const quantity = this.getNodeParameter('quantity', index) as number;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    part: { id: partId },
    quantity,
    ...cleanObject(additionalFields),
  };

  // Handle location
  if (additionalFields.locationId) {
    body.location = { id: additionalFields.locationId };
    delete body.locationId;
  }

  // Handle BOM
  if (additionalFields.bomId) {
    body.bom = { id: additionalFields.bomId };
    delete body.bomId;
  }

  // Handle dates
  if (additionalFields.dateScheduled) {
    body.dateScheduled = formatDate(additionalFields.dateScheduled as string);
  }

  const response = await fishbowlApiRequest.call(this, 'POST', '/manufacture-order', body);
  return simplifyOutputData([response]);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const moId = this.getNodeParameter('moId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const body: IDataObject = cleanObject(updateFields);

  // Handle location
  if (updateFields.locationId) {
    body.location = { id: updateFields.locationId };
    delete body.locationId;
  }

  // Handle dates
  if (updateFields.dateScheduled) {
    body.dateScheduled = formatDate(updateFields.dateScheduled as string);
  }
  if (updateFields.dateStarted) {
    body.dateStarted = formatDate(updateFields.dateStarted as string);
  }
  if (updateFields.dateFinished) {
    body.dateFinished = formatDate(updateFields.dateFinished as string);
  }

  const response = await fishbowlApiRequest.call(this, 'PUT', `/manufacture-order/${moId}`, body);
  return simplifyOutputData([response]);
}

export async function deleteManufactureOrder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const moId = this.getNodeParameter('moId', index) as string;

  await fishbowlApiRequest.call(this, 'DELETE', `/manufacture-order/${moId}`);
  return simplifyOutputData([{ success: true, moId }]);
}

export async function issue(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const moId = this.getNodeParameter('moId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'POST', `/manufacture-order/${moId}/issue`);
  return simplifyOutputData([response]);
}

export async function build(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const moId = this.getNodeParameter('moId', index) as string;
  const quantity = this.getNodeParameter('quantity', index, 0) as number;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    ...cleanObject(additionalFields),
  };

  if (quantity > 0) {
    body.quantity = quantity;
  }

  // Handle location for built items
  if (additionalFields.locationId) {
    body.location = { id: additionalFields.locationId };
    delete body.locationId;
  }

  // Handle completion date
  if (additionalFields.dateFinished) {
    body.dateFinished = formatDate(additionalFields.dateFinished as string);
  }

  const response = await fishbowlApiRequest.call(
    this,
    'POST',
    `/manufacture-order/${moId}/build`,
    body,
  );
  return simplifyOutputData([response]);
}

export async function close(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const moId = this.getNodeParameter('moId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'POST', `/manufacture-order/${moId}/close`);
  return simplifyOutputData([response]);
}

export async function voidOrder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const moId = this.getNodeParameter('moId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'POST', `/manufacture-order/${moId}/void`);
  return simplifyOutputData([response]);
}

export async function addItem(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const moId = this.getNodeParameter('moId', index) as string;
  const partId = this.getNodeParameter('partId', index) as number;
  const qty = this.getNodeParameter('qty', index) as number;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body = buildLineItem({
    partId,
    qty,
    ...additionalFields,
  });

  const response = await fishbowlApiRequest.call(
    this,
    'POST',
    `/manufacture-order/${moId}/items`,
    body,
  );
  return simplifyOutputData([response]);
}

export async function removeItem(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const moId = this.getNodeParameter('moId', index) as string;
  const itemId = this.getNodeParameter('itemId', index) as number;

  await fishbowlApiRequest.call(this, 'DELETE', `/manufacture-order/${moId}/items/${itemId}`);
  return simplifyOutputData([{ success: true, moId, itemId }]);
}
