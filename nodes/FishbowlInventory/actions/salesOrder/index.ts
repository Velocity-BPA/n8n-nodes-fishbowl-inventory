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
  buildOrderObject,
  buildLineItem,
  cleanObject,
  simplifyOutputData,
  formatDate,
} from '../../utils';

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const soId = this.getNodeParameter('soId', index) as string;
  const byNumber = this.getNodeParameter('byNumber', index, false) as boolean;

  let endpoint: string;
  if (byNumber) {
    endpoint = `/sales-order?number=${encodeURIComponent(soId)}`;
  } else {
    endpoint = `/sales-order/${soId}`;
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
      '/sales-order',
      'salesOrders',
      {},
      query,
    );
    return simplifyOutputData(items);
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    query.pageSize = limit;
    query.pageNumber = 1;

    const response = await fishbowlApiRequest.call(this, 'GET', '/sales-order', {}, query);
    const items = response.results || response.salesOrders || [];
    return simplifyOutputData(items.slice(0, limit));
  }
}

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as number;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body = buildOrderObject(
    {
      customerId,
      ...additionalFields,
    },
    'so',
  );

  // Handle addresses
  if (additionalFields.billToAddress) {
    body.billToAddress = additionalFields.billToAddress;
  }
  if (additionalFields.shipToAddress) {
    body.shipToAddress = additionalFields.shipToAddress;
  }

  // Handle salesman
  if (additionalFields.salesmanId) {
    body.salesman = { id: additionalFields.salesmanId };
  }

  const response = await fishbowlApiRequest.call(this, 'POST', '/sales-order', body);
  return simplifyOutputData([response]);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const soId = this.getNodeParameter('soId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const body = buildOrderObject(updateFields, 'so');

  const response = await fishbowlApiRequest.call(this, 'PUT', `/sales-order/${soId}`, body);
  return simplifyOutputData([response]);
}

export async function deleteSalesOrder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const soId = this.getNodeParameter('soId', index) as string;

  await fishbowlApiRequest.call(this, 'DELETE', `/sales-order/${soId}`);
  return simplifyOutputData([{ success: true, soId }]);
}

export async function issue(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const soId = this.getNodeParameter('soId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'POST', `/sales-order/${soId}/issue`);
  return simplifyOutputData([response]);
}

export async function ship(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const soId = this.getNodeParameter('soId', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {};

  if (additionalFields.carrierId) {
    body.carrier = { id: additionalFields.carrierId };
  }
  if (additionalFields.trackingNumber) {
    body.trackingNumber = additionalFields.trackingNumber;
  }
  if (additionalFields.shipDate) {
    body.shipDate = formatDate(additionalFields.shipDate as string);
  }
  if (additionalFields.note) {
    body.note = additionalFields.note;
  }

  const response = await fishbowlApiRequest.call(
    this,
    'POST',
    `/sales-order/${soId}/ship`,
    cleanObject(body),
  );
  return simplifyOutputData([response]);
}

export async function voidOrder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const soId = this.getNodeParameter('soId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'POST', `/sales-order/${soId}/void`);
  return simplifyOutputData([response]);
}

export async function addItem(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const soId = this.getNodeParameter('soId', index) as string;
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
    `/sales-order/${soId}/items`,
    body,
  );
  return simplifyOutputData([response]);
}

export async function removeItem(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const soId = this.getNodeParameter('soId', index) as string;
  const itemId = this.getNodeParameter('itemId', index) as number;

  await fishbowlApiRequest.call(this, 'DELETE', `/sales-order/${soId}/items/${itemId}`);
  return simplifyOutputData([{ success: true, soId, itemId }]);
}

export async function quickShip(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const soId = this.getNodeParameter('soId', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    autoPick: true,
    ...cleanObject(additionalFields),
  };

  const response = await fishbowlApiRequest.call(
    this,
    'POST',
    `/sales-order/${soId}/quick-ship`,
    body,
  );
  return simplifyOutputData([response]);
}
