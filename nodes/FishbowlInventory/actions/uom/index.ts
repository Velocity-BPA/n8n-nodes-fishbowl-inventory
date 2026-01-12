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
  const uomId = this.getNodeParameter('uomId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'GET', `/uom/${uomId}`);
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
    const items = await fishbowlApiRequestAllItems.call(this, 'GET', '/uom', 'uoms', {}, query);
    return simplifyOutputData(items);
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    query.pageSize = limit;
    query.pageNumber = 1;

    const response = await fishbowlApiRequest.call(this, 'GET', '/uom', {}, query);
    const items = response.results || response.uoms || [];
    return simplifyOutputData(items.slice(0, limit));
  }
}

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const abbreviation = this.getNodeParameter('abbreviation', index) as string;
  const type = this.getNodeParameter('type', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    name,
    abbreviation,
    type,
    ...cleanObject(additionalFields),
  };

  const response = await fishbowlApiRequest.call(this, 'POST', '/uom', body);
  return simplifyOutputData([response]);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const uomId = this.getNodeParameter('uomId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const body: IDataObject = cleanObject(updateFields);

  const response = await fishbowlApiRequest.call(this, 'PUT', `/uom/${uomId}`, body);
  return simplifyOutputData([response]);
}

export async function deleteUom(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const uomId = this.getNodeParameter('uomId', index) as string;

  await fishbowlApiRequest.call(this, 'DELETE', `/uom/${uomId}`);
  return simplifyOutputData([{ success: true, uomId }]);
}

export async function getConversions(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const uomId = this.getNodeParameter('uomId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'GET', `/uom/${uomId}/conversions`);
  const conversions = Array.isArray(response) ? response : response.conversions || [];
  return simplifyOutputData(conversions);
}

export async function addConversion(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const uomId = this.getNodeParameter('uomId', index) as string;
  const toUomId = this.getNodeParameter('toUomId', index) as number;
  const factor = this.getNodeParameter('factor', index) as number;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    toUom: { id: toUomId },
    factor,
    ...cleanObject(additionalFields),
  };

  const response = await fishbowlApiRequest.call(
    this,
    'POST',
    `/uom/${uomId}/conversions`,
    body,
  );
  return simplifyOutputData([response]);
}
