/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IExecuteFunctions } from 'n8n-workflow';

// Mock the transport module
jest.mock('../../nodes/FishbowlInventory/transport', () => ({
  fishbowlApiRequest: jest.fn(),
  fishbowlApiRequestAllItems: jest.fn(),
}));

import { fishbowlApiRequest, fishbowlApiRequestAllItems } from '../../nodes/FishbowlInventory/transport';

describe('Transport Layer', () => {
  let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecuteFunctions = {
      getCredentials: jest.fn(),
      helpers: {
        request: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    } as unknown as jest.Mocked<IExecuteFunctions>;
  });

  describe('fishbowlApiRequest', () => {
    it('should make a successful GET request', async () => {
      const mockResponse = { id: 1, partNumber: 'TEST-001' };
      (fishbowlApiRequest as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fishbowlApiRequest.call(
        mockExecuteFunctions,
        'GET',
        '/parts/1',
      );

      expect(result).toEqual(mockResponse);
    });

    it('should make a successful POST request with body', async () => {
      const mockBody = { partNumber: 'NEW-001', description: 'New Part' };
      const mockResponse = { id: 2, ...mockBody };
      (fishbowlApiRequest as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fishbowlApiRequest.call(
        mockExecuteFunctions,
        'POST',
        '/parts',
        mockBody,
      );

      expect(result).toEqual(mockResponse);
    });

    it('should include query parameters', async () => {
      const mockResponse = { results: [], totalCount: 0 };
      (fishbowlApiRequest as jest.Mock).mockResolvedValue(mockResponse);

      const query = { active: true, pageSize: 50 };
      const result = await fishbowlApiRequest.call(
        mockExecuteFunctions,
        'GET',
        '/parts',
        undefined,
        query,
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('fishbowlApiRequestAllItems', () => {
    it('should paginate through all results', async () => {
      const mockResults = [
        { id: 1, partNumber: 'PART-001' },
        { id: 2, partNumber: 'PART-002' },
        { id: 3, partNumber: 'PART-003' },
      ];
      (fishbowlApiRequestAllItems as jest.Mock).mockResolvedValue(mockResults);

      const result = await fishbowlApiRequestAllItems.call(
        mockExecuteFunctions,
        'GET',
        '/parts',
        'results',
      );

      expect(result).toEqual(mockResults);
      expect(result.length).toBe(3);
    });

    it('should return empty array when no results', async () => {
      (fishbowlApiRequestAllItems as jest.Mock).mockResolvedValue([]);

      const result = await fishbowlApiRequestAllItems.call(
        mockExecuteFunctions,
        'GET',
        '/parts',
        'results',
      );

      expect(result).toEqual([]);
    });
  });
});
