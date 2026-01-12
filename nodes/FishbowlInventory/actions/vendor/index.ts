/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { fishbowlApiRequest, fishbowlApiRequestAllItems } from '../../transport';
import { buildFilterQuery, buildAddress, cleanObject, simplifyOutputData } from '../../utils';

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const vendorId = this.getNodeParameter('vendorId', index) as string;
  const byName = this.getNodeParameter('byName', index, false) as boolean;

  let endpoint: string;
  if (byName) {
    endpoint = `/vendor?name=${encodeURIComponent(vendorId)}`;
  } else {
    endpoint = `/vendor/${vendorId}`;
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
      '/vendor',
      'vendors',
      {},
      query,
    );
    return simplifyOutputData(items);
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    query.pageSize = limit;
    query.pageNumber = 1;

    const response = await fishbowlApiRequest.call(this, 'GET', '/vendor', {}, query);
    const items = response.results || response.vendors || [];
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

  // Handle default payment terms
  if (additionalFields.defaultPaymentTermsId) {
    body.defaultPaymentTerms = { id: additionalFields.defaultPaymentTermsId };
    delete body.defaultPaymentTermsId;
  }

  // Handle default carrier
  if (additionalFields.defaultCarrierId) {
    body.defaultCarrier = { id: additionalFields.defaultCarrierId };
    delete body.defaultCarrierId;
  }

  // Handle default ship terms
  if (additionalFields.defaultShipTermsId) {
    body.defaultShipTerms = { id: additionalFields.defaultShipTermsId };
    delete body.defaultShipTermsId;
  }

  const response = await fishbowlApiRequest.call(this, 'POST', '/vendor', body);
  return simplifyOutputData([response]);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const vendorId = this.getNodeParameter('vendorId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const body: IDataObject = cleanObject(updateFields);

  // Handle references
  if (updateFields.defaultPaymentTermsId) {
    body.defaultPaymentTerms = { id: updateFields.defaultPaymentTermsId };
    delete body.defaultPaymentTermsId;
  }

  if (updateFields.defaultCarrierId) {
    body.defaultCarrier = { id: updateFields.defaultCarrierId };
    delete body.defaultCarrierId;
  }

  const response = await fishbowlApiRequest.call(this, 'PUT', `/vendor/${vendorId}`, body);
  return simplifyOutputData([response]);
}

export async function deleteVendor(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const vendorId = this.getNodeParameter('vendorId', index) as string;

  await fishbowlApiRequest.call(this, 'DELETE', `/vendor/${vendorId}`);
  return simplifyOutputData([{ success: true, vendorId }]);
}

export async function getAddresses(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const vendorId = this.getNodeParameter('vendorId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'GET', `/vendor/${vendorId}/addresses`);
  const addresses = Array.isArray(response) ? response : response.addresses || [];
  return simplifyOutputData(addresses);
}

export async function addAddress(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const vendorId = this.getNodeParameter('vendorId', index) as string;
  const addressFields = this.getNodeParameter('addressFields', index) as IDataObject;

  const body = buildAddress(addressFields);

  if (addressFields.isDefault !== undefined) {
    body.isDefault = addressFields.isDefault;
  }
  if (addressFields.type) {
    body.type = addressFields.type;
  }

  const response = await fishbowlApiRequest.call(
    this,
    'POST',
    `/vendor/${vendorId}/addresses`,
    body,
  );
  return simplifyOutputData([response]);
}

export async function getContacts(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const vendorId = this.getNodeParameter('vendorId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'GET', `/vendor/${vendorId}/contacts`);
  const contacts = Array.isArray(response) ? response : response.contacts || [];
  return simplifyOutputData(contacts);
}

export async function addContact(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const vendorId = this.getNodeParameter('vendorId', index) as string;
  const contactFields = this.getNodeParameter('contactFields', index) as IDataObject;

  const body: IDataObject = cleanObject(contactFields);

  const response = await fishbowlApiRequest.call(
    this,
    'POST',
    `/vendor/${vendorId}/contacts`,
    body,
  );
  return simplifyOutputData([response]);
}

export async function getPurchaseOrders(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const vendorId = this.getNodeParameter('vendorId', index) as string;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

  const query = buildFilterQuery(filters);
  query.vendorId = vendorId;

  const response = await fishbowlApiRequest.call(this, 'GET', '/purchase-order', {}, query);
  const orders = response.results || response.purchaseOrders || [];
  return simplifyOutputData(orders);
}
