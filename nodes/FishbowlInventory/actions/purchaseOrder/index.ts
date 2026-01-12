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
  const poId = this.getNodeParameter('poId', index) as string;
  const byNumber = this.getNodeParameter('byNumber', index, false) as boolean;

  let endpoint: string;
  if (byNumber) {
    endpoint = `/purchase-order?number=${encodeURIComponent(poId)}`;
  } else {
    endpoint = `/purchase-order/${poId}`;
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
      '/purchase-order',
      'purchaseOrders',
      {},
      query,
    );
    return simplifyOutputData(items);
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    query.pageSize = limit;
    query.pageNumber = 1;

    const response = await fishbowlApiRequest.call(this, 'GET', '/purchase-order', {}, query);
    const items = response.results || response.purchaseOrders || [];
    return simplifyOutputData(items.slice(0, limit));
  }
}

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const vendorId = this.getNodeParameter('vendorId', index) as number;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body = buildOrderObject(
    {
      vendorId,
      ...additionalFields,
    },
    'po',
  );

  // Handle addresses
  if (additionalFields.remitToAddress) {
    body.remitToAddress = additionalFields.remitToAddress;
  }
  if (additionalFields.shipToAddress) {
    body.shipToAddress = additionalFields.shipToAddress;
  }

  // Handle buyer
  if (additionalFields.buyerId) {
    body.buyer = { id: additionalFields.buyerId };
  }

  const response = await fishbowlApiRequest.call(this, 'POST', '/purchase-order', body);
  return simplifyOutputData([response]);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const poId = this.getNodeParameter('poId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const body = buildOrderObject(updateFields, 'po');

  const response = await fishbowlApiRequest.call(this, 'PUT', `/purchase-order/${poId}`, body);
  return simplifyOutputData([response]);
}

export async function deletePurchaseOrder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const poId = this.getNodeParameter('poId', index) as string;

  await fishbowlApiRequest.call(this, 'DELETE', `/purchase-order/${poId}`);
  return simplifyOutputData([{ success: true, poId }]);
}

export async function issue(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const poId = this.getNodeParameter('poId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'POST', `/purchase-order/${poId}/issue`);
  return simplifyOutputData([response]);
}

export async function receive(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const poId = this.getNodeParameter('poId', index) as string;
  const items = this.getNodeParameter('items', index, []) as IDataObject[];
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    items: items.map((item) => ({
      itemId: item.itemId,
      qty: item.qty,
      locationId: item.locationId,
    })),
    ...cleanObject(additionalFields),
  };

  if (additionalFields.receiveDate) {
    body.receiveDate = formatDate(additionalFields.receiveDate as string);
  }

  const response = await fishbowlApiRequest.call(
    this,
    'POST',
    `/purchase-order/${poId}/receive`,
    body,
  );
  return simplifyOutputData([response]);
}

export async function close(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const poId = this.getNodeParameter('poId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'POST', `/purchase-order/${poId}/close`);
  return simplifyOutputData([response]);
}

export async function voidOrder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const poId = this.getNodeParameter('poId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'POST', `/purchase-order/${poId}/void`);
  return simplifyOutputData([response]);
}

export async function addItem(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const poId = this.getNodeParameter('poId', index) as string;
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
    `/purchase-order/${poId}/items`,
    body,
  );
  return simplifyOutputData([response]);
}

export async function quickReceive(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const poId = this.getNodeParameter('poId', index) as string;
  const locationId = this.getNodeParameter('locationId', index) as number;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    locationId,
    receiveAll: true,
    ...cleanObject(additionalFields),
  };

  const response = await fishbowlApiRequest.call(
    this,
    'POST',
    `/purchase-order/${poId}/quick-receive`,
    body,
  );
  return simplifyOutputData([response]);
}
