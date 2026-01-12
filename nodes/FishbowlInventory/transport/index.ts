/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  ILoadOptionsFunctions,
  IPollFunctions,
  NodeApiError,
} from 'n8n-workflow';

interface TokenCache {
  token: string;
  expiry: number;
}

const tokenCacheMap = new Map<string, TokenCache>();

/**
 * Get a unique cache key for the credentials
 */
function getCacheKey(credentials: IDataObject): string {
  return `${credentials.serverUrl}:${credentials.port}:${credentials.username}`;
}

/**
 * Log licensing notice once per session
 */
let licensingNoticeLogged = false;

function logLicensingNotice(): void {
  if (!licensingNoticeLogged) {
    console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
    licensingNoticeLogged = true;
  }
}

/**
 * Get authentication token from Fishbowl API
 */
export async function getAuthToken(
  this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
): Promise<string> {
  logLicensingNotice();

  const credentials = await this.getCredentials('fishbowlInventoryApi');
  const cacheKey = getCacheKey(credentials as IDataObject);

  // Check cache
  const cached = tokenCacheMap.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return cached.token;
  }

  const serverUrl = (credentials.serverUrl as string).replace(/\/$/, '');
  const port = credentials.port ? `:${credentials.port}` : ':443';

  const options: IHttpRequestOptions = {
    method: 'POST',
    url: `${serverUrl}${port}/api/login`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      appName: credentials.appName,
      appDescription: 'n8n workflow automation integration',
      appId: credentials.appId,
      username: credentials.username,
      password: credentials.password,
    },
    json: true,
  };

  try {
    const response = await this.helpers.httpRequest(options);

    if (!response.token) {
      throw new Error('No token received from Fishbowl API');
    }

    // Cache token for 50 minutes (tokens typically expire in 1 hour)
    tokenCacheMap.set(cacheKey, {
      token: response.token,
      expiry: Date.now() + 50 * 60 * 1000,
    });

    return response.token;
  } catch (error: any) {
    throw new NodeApiError(this.getNode(), error, {
      message: 'Failed to authenticate with Fishbowl API',
    });
  }
}

/**
 * Clear cached token (used on authentication errors)
 */
export function clearTokenCache(credentials: IDataObject): void {
  const cacheKey = getCacheKey(credentials);
  tokenCacheMap.delete(cacheKey);
}

/**
 * Make an authenticated request to the Fishbowl API
 */
export async function fishbowlApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
): Promise<any> {
  const credentials = await this.getCredentials('fishbowlInventoryApi');
  const serverUrl = (credentials.serverUrl as string).replace(/\/$/, '');
  const port = credentials.port ? `:${credentials.port}` : ':443';

  const token = await getAuthToken.call(this);

  const options: IHttpRequestOptions = {
    method,
    url: `${serverUrl}${port}/api${endpoint}`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    json: true,
  };

  if (body && Object.keys(body).length > 0) {
    options.body = body;
  }

  if (query && Object.keys(query).length > 0) {
    options.qs = query;
  }

  try {
    return await this.helpers.httpRequest(options);
  } catch (error: any) {
    // Handle token expiration
    if (error.statusCode === 401) {
      clearTokenCache(credentials as IDataObject);

      // Retry with new token
      const newToken = await getAuthToken.call(this);
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      };

      return await this.helpers.httpRequest(options);
    }

    throw new NodeApiError(this.getNode(), error, {
      message: `Fishbowl API Error: ${error.message}`,
    });
  }
}

/**
 * Make paginated requests to get all items
 */
export async function fishbowlApiRequestAllItems(
  this: IExecuteFunctions | IPollFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  propertyName: string,
  body?: IDataObject,
  query?: IDataObject,
): Promise<any[]> {
  const returnData: any[] = [];
  let pageNumber = 1;
  const pageSize = 100;

  query = query || {};
  query.pageNumber = pageNumber;
  query.pageSize = pageSize;

  let responseData;

  do {
    responseData = await fishbowlApiRequest.call(this, method, endpoint, body, query);

    const results = responseData.results || responseData[propertyName] || responseData;

    if (Array.isArray(results)) {
      returnData.push(...results);
    } else if (results) {
      returnData.push(results);
    }

    pageNumber++;
    query.pageNumber = pageNumber;
  } while (responseData.totalPages && pageNumber <= responseData.totalPages);

  return returnData;
}

/**
 * Handle errors and extract meaningful messages
 */
export function handleFishbowlError(error: any): never {
  let message = 'An unknown error occurred';

  if (error.response?.body?.error) {
    const errorBody = error.response.body.error;
    message = errorBody.message || errorBody.details || message;
  } else if (error.message) {
    message = error.message;
  }

  throw new Error(`Fishbowl API Error: ${message}`);
}
