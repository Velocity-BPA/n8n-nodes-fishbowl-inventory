/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { fishbowlApiRequest } from '../../transport';
import { cleanObject, simplifyOutputData, formatDate } from '../../utils';

export async function importSalesOrder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const data = this.getNodeParameter('data', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  let parsedData: IDataObject[];
  try {
    parsedData = JSON.parse(data);
  } catch (error) {
    throw new Error('Invalid JSON data for import');
  }

  const body: IDataObject = {
    importType: 'salesOrder',
    data: parsedData,
    ...cleanObject(options),
  };

  const response = await fishbowlApiRequest.call(this, 'POST', '/import/sales-order', body);
  return simplifyOutputData([response]);
}

export async function importPurchaseOrder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const data = this.getNodeParameter('data', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  let parsedData: IDataObject[];
  try {
    parsedData = JSON.parse(data);
  } catch (error) {
    throw new Error('Invalid JSON data for import');
  }

  const body: IDataObject = {
    importType: 'purchaseOrder',
    data: parsedData,
    ...cleanObject(options),
  };

  const response = await fishbowlApiRequest.call(this, 'POST', '/import/purchase-order', body);
  return simplifyOutputData([response]);
}

export async function importProducts(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const data = this.getNodeParameter('data', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  let parsedData: IDataObject[];
  try {
    parsedData = JSON.parse(data);
  } catch (error) {
    throw new Error('Invalid JSON data for import');
  }

  const body: IDataObject = {
    importType: 'product',
    data: parsedData,
    ...cleanObject(options),
  };

  const response = await fishbowlApiRequest.call(this, 'POST', '/import/product', body);
  return simplifyOutputData([response]);
}

export async function importCustomers(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const data = this.getNodeParameter('data', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  let parsedData: IDataObject[];
  try {
    parsedData = JSON.parse(data);
  } catch (error) {
    throw new Error('Invalid JSON data for import');
  }

  const body: IDataObject = {
    importType: 'customer',
    data: parsedData,
    ...cleanObject(options),
  };

  const response = await fishbowlApiRequest.call(this, 'POST', '/import/customer', body);
  return simplifyOutputData([response]);
}

export async function exportInventory(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const exportFormat = this.getNodeParameter('exportFormat', index) as string;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

  const query: IDataObject = {
    format: exportFormat,
    ...cleanObject(filters),
  };

  // Handle date filters
  if (filters.dateFrom) {
    query.dateFrom = formatDate(filters.dateFrom as string);
  }
  if (filters.dateTo) {
    query.dateTo = formatDate(filters.dateTo as string);
  }

  const response = await fishbowlApiRequest.call(this, 'GET', '/export/inventory', {}, query);
  return simplifyOutputData([response]);
}

export async function exportSalesReport(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const exportFormat = this.getNodeParameter('exportFormat', index) as string;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

  const query: IDataObject = {
    format: exportFormat,
    ...cleanObject(filters),
  };

  // Handle date filters
  if (filters.dateFrom) {
    query.dateFrom = formatDate(filters.dateFrom as string);
  }
  if (filters.dateTo) {
    query.dateTo = formatDate(filters.dateTo as string);
  }

  const response = await fishbowlApiRequest.call(this, 'GET', '/export/sales', {}, query);
  return simplifyOutputData([response]);
}

export async function runCustomQuery(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const query = this.getNodeParameter('query', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const body: IDataObject = {
    query,
    ...cleanObject(options),
  };

  const response = await fishbowlApiRequest.call(this, 'POST', '/query', body);

  // Handle response which could be array or object with results
  if (Array.isArray(response)) {
    return simplifyOutputData(response);
  }

  const results = response.results || response.data || [response];
  return simplifyOutputData(Array.isArray(results) ? results : [results]);
}
