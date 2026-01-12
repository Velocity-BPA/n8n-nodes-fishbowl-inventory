/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { fishbowlApiRequest, fishbowlApiRequestAllItems } from '../../transport';
import { buildFilterQuery, cleanObject, simplifyOutputData, formatDate } from '../../utils';

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const paymentId = this.getNodeParameter('paymentId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'GET', `/payment/${paymentId}`);
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
      '/payment',
      'payments',
      {},
      query,
    );
    return simplifyOutputData(items);
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    query.pageSize = limit;
    query.pageNumber = 1;

    const response = await fishbowlApiRequest.call(this, 'GET', '/payment', {}, query);
    const items = response.results || response.payments || [];
    return simplifyOutputData(items.slice(0, limit));
  }
}

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const amount = this.getNodeParameter('amount', index) as number;
  const paymentDate = this.getNodeParameter('paymentDate', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    amount,
    paymentDate: formatDate(paymentDate),
    ...cleanObject(additionalFields),
  };

  // Handle payment type
  if (additionalFields.paymentTypeId) {
    body.paymentType = { id: additionalFields.paymentTypeId };
    delete body.paymentTypeId;
  }

  // Handle sales order
  if (additionalFields.salesOrderId) {
    body.salesOrder = { id: additionalFields.salesOrderId };
    delete body.salesOrderId;
  }

  // Handle purchase order
  if (additionalFields.purchaseOrderId) {
    body.purchaseOrder = { id: additionalFields.purchaseOrderId };
    delete body.purchaseOrderId;
  }

  const response = await fishbowlApiRequest.call(this, 'POST', '/payment', body);
  return simplifyOutputData([response]);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const paymentId = this.getNodeParameter('paymentId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const body: IDataObject = cleanObject(updateFields);

  // Handle dates
  if (updateFields.paymentDate) {
    body.paymentDate = formatDate(updateFields.paymentDate as string);
  }

  // Handle payment type
  if (updateFields.paymentTypeId) {
    body.paymentType = { id: updateFields.paymentTypeId };
    delete body.paymentTypeId;
  }

  const response = await fishbowlApiRequest.call(this, 'PUT', `/payment/${paymentId}`, body);
  return simplifyOutputData([response]);
}

export async function deletePayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const paymentId = this.getNodeParameter('paymentId', index) as string;

  await fishbowlApiRequest.call(this, 'DELETE', `/payment/${paymentId}`);
  return simplifyOutputData([{ success: true, paymentId }]);
}

export async function getByOrder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const orderType = this.getNodeParameter('orderType', index) as string;
  const orderId = this.getNodeParameter('orderId', index) as string;

  const query: IDataObject = {};

  if (orderType === 'salesOrder') {
    query.salesOrderId = orderId;
  } else {
    query.purchaseOrderId = orderId;
  }

  const response = await fishbowlApiRequest.call(this, 'GET', '/payment', {}, query);
  const payments = response.results || response.payments || [];
  return simplifyOutputData(payments);
}
