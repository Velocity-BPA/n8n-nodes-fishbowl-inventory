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
  const userId = this.getNodeParameter('userId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'GET', `/user/${userId}`);
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
    const items = await fishbowlApiRequestAllItems.call(this, 'GET', '/user', 'users', {}, query);
    return simplifyOutputData(items);
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    query.pageSize = limit;
    query.pageNumber = 1;

    const response = await fishbowlApiRequest.call(this, 'GET', '/user', {}, query);
    const items = response.results || response.users || [];
    return simplifyOutputData(items.slice(0, limit));
  }
}

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userName = this.getNodeParameter('userName', index) as string;
  const firstName = this.getNodeParameter('firstName', index) as string;
  const lastName = this.getNodeParameter('lastName', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    userName,
    firstName,
    lastName,
    ...cleanObject(additionalFields),
  };

  // Handle user group
  if (additionalFields.userGroupId) {
    body.userGroup = { id: additionalFields.userGroupId };
    delete body.userGroupId;
  }

  const response = await fishbowlApiRequest.call(this, 'POST', '/user', body);
  return simplifyOutputData([response]);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userId = this.getNodeParameter('userId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const body: IDataObject = cleanObject(updateFields);

  // Handle user group
  if (updateFields.userGroupId) {
    body.userGroup = { id: updateFields.userGroupId };
    delete body.userGroupId;
  }

  const response = await fishbowlApiRequest.call(this, 'PUT', `/user/${userId}`, body);
  return simplifyOutputData([response]);
}

export async function deleteUser(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userId = this.getNodeParameter('userId', index) as string;

  await fishbowlApiRequest.call(this, 'DELETE', `/user/${userId}`);
  return simplifyOutputData([{ success: true, userId }]);
}

export async function getPermissions(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userId = this.getNodeParameter('userId', index) as string;

  const response = await fishbowlApiRequest.call(this, 'GET', `/user/${userId}/permissions`);
  const permissions = Array.isArray(response) ? response : response.permissions || [];
  return simplifyOutputData(permissions);
}
