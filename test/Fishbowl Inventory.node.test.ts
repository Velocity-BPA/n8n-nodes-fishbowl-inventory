/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { FishbowlInventory } from '../nodes/Fishbowl Inventory/Fishbowl Inventory.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('FishbowlInventory Node', () => {
  let node: FishbowlInventory;

  beforeAll(() => {
    node = new FishbowlInventory();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Fishbowl Inventory');
      expect(node.description.name).toBe('fishbowlinventory');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 8 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(8);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(8);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Product Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.fishbowlinventory.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should get products successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			switch (param) {
				case 'operation':
					return 'getProducts';
				case 'limit':
					return 50;
				case 'offset':
					return 0;
				case 'sku':
					return '';
				case 'category':
					return '';
				case 'active':
					return true;
				default:
					return undefined;
			}
		});

		const mockResponse = { products: [{ id: '1', name: 'Test Product' }] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.fishbowlinventory.com/v1/products',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			qs: { limit: 50, offset: 0, active: true },
			json: true,
		});
	});

	it('should get a single product successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			switch (param) {
				case 'operation':
					return 'getProduct';
				case 'id':
					return '123';
				default:
					return undefined;
			}
		});

		const mockResponse = { id: '123', name: 'Test Product' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should create a product successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			switch (param) {
				case 'operation':
					return 'createProduct';
				case 'sku':
					return 'TEST-SKU';
				case 'name':
					return 'Test Product';
				case 'description':
					return 'Test Description';
				case 'price':
					return 99.99;
				case 'category':
					return 'Electronics';
				default:
					return undefined;
			}
		});

		const mockResponse = { id: '456', sku: 'TEST-SKU', name: 'Test Product' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should handle errors when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getProducts');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getProducts');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(
			executeProductOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('API Error');
	});
});

describe('Inventory Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key', baseUrl: 'https://api.fishbowlinventory.com/v1' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get inventory levels successfully', async () => {
    const mockResponse = { data: [{ productId: '123', quantity: 100 }] };
    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'getInventoryLevels';
        case 'limit': return 50;
        case 'offset': return 0;
        default: return '';
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.fishbowlinventory.com/v1/inventory',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      qs: { limit: 50, offset: 0 },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle get inventory levels error', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      if (name === 'operation') return 'getInventoryLevels';
      return '';
    });
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should get product inventory successfully', async () => {
    const mockResponse = { productId: '123', locations: [{ locationId: 'loc1', quantity: 50 }] };
    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'getProductInventory';
        case 'productId': return '123';
        case 'locationId': return 'loc1';
        default: return '';
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.fishbowlinventory.com/v1/inventory/123',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      qs: { locationId: 'loc1' },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should create inventory adjustment successfully', async () => {
    const mockResponse = { adjustmentId: 'adj123', status: 'created' };
    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'createInventoryAdjustment';
        case 'productId': return '123';
        case 'locationId': return 'loc1';
        case 'quantity': return -5;
        case 'reason': return 'Damaged goods';
        case 'notes': return 'Found damaged during inspection';
        default: return '';
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.fishbowlinventory.com/v1/inventory/adjustments',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        productId: '123',
        locationId: 'loc1',
        quantity: -5,
        reason: 'Damaged goods',
        notes: 'Found damaged during inspection',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should update inventory level successfully', async () => {
    const mockResponse = { productId: '123', locationId: 'loc1', previousQuantity: 50, newQuantity: 75 };
    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'updateInventoryLevel';
        case 'productId': return '123';
        case 'locationId': return 'loc1';
        case 'newQuantity': return 75;
        case 'reason': return 'Stock replenishment';
        default: return '';
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://api.fishbowlinventory.com/v1/inventory',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        productId: '123',
        locationId: 'loc1',
        newQuantity: 75,
        reason: 'Stock replenishment',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get inventory movements successfully', async () => {
    const mockResponse = { movements: [{ id: 'mov1', productId: '123', quantity: 10, type: 'inbound' }] };
    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'getInventoryMovements';
        case 'limit': return 25;
        case 'productId': return '123';
        default: return '';
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.fishbowlinventory.com/v1/inventory/movements',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      qs: { limit: 25, productId: '123' },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });
});

describe('Location Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.fishbowlinventory.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getLocations operation', () => {
		it('should retrieve all locations successfully', async () => {
			const mockResponse = {
				locations: [
					{ id: '1', name: 'Warehouse A', code: 'WH-A', type: 'warehouse', active: true },
					{ id: '2', name: 'Bin B1', code: 'B1', type: 'bin', active: true },
				],
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getLocations')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce(true)
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeLocationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.fishbowlinventory.com/v1/locations',
				qs: { limit: 50, offset: 0, active: true },
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle errors when retrieving locations', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getLocations')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce(true)
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeLocationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getLocation operation', () => {
		it('should retrieve a specific location successfully', async () => {
			const mockResponse = {
				id: '1',
				name: 'Warehouse A',
				code: 'WH-A',
				type: 'warehouse',
				active: true,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getLocation')
				.mockReturnValueOnce('1');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeLocationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.fishbowlinventory.com/v1/locations/1',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('createLocation operation', () => {
		it('should create a location successfully', async () => {
			const mockResponse = {
				id: '3',
				name: 'New Warehouse',
				code: 'NW-1',
				type: 'warehouse',
				active: true,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createLocation')
				.mockReturnValueOnce('New Warehouse')
				.mockReturnValueOnce('NW-1')
				.mockReturnValueOnce('warehouse')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(true);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeLocationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.fishbowlinventory.com/v1/locations',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					name: 'New Warehouse',
					code: 'NW-1',
					type: 'warehouse',
					active: true,
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('updateLocation operation', () => {
		it('should update a location successfully', async () => {
			const mockResponse = {
				id: '1',
				name: 'Updated Warehouse',
				code: 'UW-1',
				type: 'warehouse',
				active: true,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateLocation')
				.mockReturnValueOnce('1')
				.mockReturnValueOnce('Updated Warehouse')
				.mockReturnValueOnce('UW-1')
				.mockReturnValueOnce('warehouse')
				.mockReturnValueOnce(true);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeLocationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PUT',
				url: 'https://api.fishbowlinventory.com/v1/locations/1',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					name: 'Updated Warehouse',
					code: 'UW-1',
					type: 'warehouse',
					active: true,
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('deleteLocation operation', () => {
		it('should delete a location successfully', async () => {
			const mockResponse = { success: true };

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteLocation')
				.mockReturnValueOnce('1');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeLocationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.fishbowlinventory.com/v1/locations/1',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Purchase Order Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.fishbowlinventory.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getPurchaseOrders', () => {
		it('should get purchase orders successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation':
						return 'getPurchaseOrders';
					case 'limit':
						return 50;
					case 'offset':
						return 0;
					default:
						return '';
				}
			});

			const mockResponse = { data: [{ id: '1', vendorId: 'V1' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executePurchaseOrderOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle errors when getting purchase orders', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getPurchaseOrders');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executePurchaseOrderOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('createPurchaseOrder', () => {
		it('should create purchase order successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation':
						return 'createPurchaseOrder';
					case 'vendorId':
						return 'V1';
					case 'items':
						return '[{"productId": "P1", "quantity": 10}]';
					default:
						return '';
				}
			});

			const mockResponse = { id: '123', vendorId: 'V1' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executePurchaseOrderOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('receivePurchaseOrder', () => {
		it('should receive purchase order successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation':
						return 'receivePurchaseOrder';
					case 'id':
						return '123';
					case 'receivedItems':
						return '[{"productId": "P1", "quantity": 5}]';
					default:
						return '';
				}
			});

			const mockResponse = { id: '123', status: 'received' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executePurchaseOrderOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('SalesOrder Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.fishbowlinventory.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(), 
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  test('should get sales orders successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getSalesOrders')
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');

    const mockResponse = { data: [{ id: '1', customerId: 'cust1', status: 'pending' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSalesOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should get specific sales order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getSalesOrder')
      .mockReturnValueOnce('order123');

    const mockResponse = { id: 'order123', customerId: 'cust1', status: 'pending' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSalesOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should create sales order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createSalesOrder')
      .mockReturnValueOnce('cust123')
      .mockReturnValueOnce('[{"productId":"prod1","quantity":2}]')
      .mockReturnValueOnce('2024-01-01')
      .mockReturnValueOnce('{}')
      .mockReturnValueOnce('{}');

    const mockResponse = { id: 'order123', customerId: 'cust123', status: 'created' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSalesOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should update sales order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateSalesOrder')
      .mockReturnValueOnce('order123')
      .mockReturnValueOnce('processing')
      .mockReturnValueOnce('[{"productId":"prod1","quantity":3}]')
      .mockReturnValueOnce('2024-01-02');

    const mockResponse = { id: 'order123', status: 'processing' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSalesOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should fulfill sales order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('fulfillSalesOrder')
      .mockReturnValueOnce('order123')
      .mockReturnValueOnce('[{"productId":"prod1","quantity":2}]')
      .mockReturnValueOnce('TRACK123');

    const mockResponse = { id: 'order123', status: 'fulfilled', trackingNumber: 'TRACK123' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSalesOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSalesOrders');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeSalesOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('Vendor Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.fishbowlinventory.com/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getVendors operation', () => {
    it('should get all vendors successfully', async () => {
      const mockVendors = { vendors: [{ id: '1', name: 'Test Vendor' }] };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getVendors';
          case 'limit': return 50;
          case 'offset': return 0;
          case 'active': return true;
          case 'name': return '';
          default: return undefined;
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockVendors);

      const result = await executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockVendors, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.fishbowlinventory.com/v1/vendors?limit=50&offset=0&active=true',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle getVendors error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getVendors');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
    });
  });

  describe('createVendor operation', () => {
    it('should create vendor successfully', async () => {
      const mockVendor = { id: '1', name: 'New Vendor' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createVendor';
          case 'vendorName': return 'New Vendor';
          case 'contact': return 'John Doe';
          case 'email': return 'john@vendor.com';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockVendor);

      const result = await executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockVendor, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.fishbowlinventory.com/v1/vendors',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'New Vendor',
          contact: 'John Doe',
          email: 'john@vendor.com',
        },
        json: true,
      });
    });
  });

  describe('deleteVendor operation', () => {
    it('should delete vendor successfully', async () => {
      const mockResponse = { success: true };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'deleteVendor';
          case 'vendorId': return '123';
          default: return undefined;
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.fishbowlinventory.com/v1/vendors/123',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });
});

describe('Customer Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.fishbowlinventory.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get all customers successfully', async () => {
    const mockResponse = { customers: [{ id: '1', name: 'Test Customer' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCustomers')
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');

    const result = await executeCustomerOperations.call(
      mockExecuteFunctions, 
      [{ json: {} }]
    );

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle get customers error', async () => {
    const mockError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getCustomers');

    await expect(executeCustomerOperations.call(
      mockExecuteFunctions, 
      [{ json: {} }]
    )).rejects.toThrow('API Error');
  });

  it('should get specific customer successfully', async () => {
    const mockResponse = { id: '123', name: 'Test Customer' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCustomer')
      .mockReturnValueOnce('123');

    const result = await executeCustomerOperations.call(
      mockExecuteFunctions, 
      [{ json: {} }]
    );

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should create customer successfully', async () => {
    const mockResponse = { id: '123', name: 'New Customer' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createCustomer')
      .mockReturnValueOnce('New Customer')
      .mockReturnValueOnce('test@example.com')
      .mockReturnValueOnce('555-1234')
      .mockReturnValueOnce('123 Main St')
      .mockReturnValueOnce('456 Oak Ave')
      .mockReturnValueOnce('Net 30');

    const result = await executeCustomerOperations.call(
      mockExecuteFunctions, 
      [{ json: {} }]
    );

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should update customer successfully', async () => {
    const mockResponse = { id: '123', name: 'Updated Customer' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateCustomer')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce('Updated Customer')
      .mockReturnValueOnce('updated@example.com')
      .mockReturnValueOnce('555-5678')
      .mockReturnValueOnce('{"billing": "123 Main St"}');

    const result = await executeCustomerOperations.call(
      mockExecuteFunctions, 
      [{ json: {} }]
    );

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should delete customer successfully', async () => {
    const mockResponse = { success: true };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteCustomer')
      .mockReturnValueOnce('123');

    const result = await executeCustomerOperations.call(
      mockExecuteFunctions, 
      [{ json: {} }]
    );

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle unknown operation error', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

    await expect(executeCustomerOperations.call(
      mockExecuteFunctions, 
      [{ json: {} }]
    )).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Report Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.fishbowlinventory.com/v1'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	it('should get inventory report successfully', async () => {
		const mockResponse = {
			reportId: 'inv-001',
			data: [{ product: 'Widget', quantity: 100 }]
		};

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getInventoryReport')
			.mockReturnValueOnce('loc-123')
			.mockReturnValueOnce('2023-01-01')
			.mockReturnValueOnce('2023-01-31')
			.mockReturnValueOnce('json');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeReportOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([{
			json: mockResponse,
			pairedItem: { item: 0 },
		}]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.fishbowlinventory.com/v1/reports/inventory',
			headers: {
				'Authorization': 'Bearer test-key',
				'Accept': 'application/json',
			},
			qs: {
				locationId: 'loc-123',
				dateFrom: '2023-01-01',
				dateTo: '2023-01-31',
				format: 'json'
			},
			json: true,
		});
	});

	it('should get sales report successfully', async () => {
		const mockResponse = {
			reportId: 'sales-001',
			data: [{ customer: 'Acme Corp', total: 5000 }]
		};

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getSalesReport')
			.mockReturnValueOnce('2023-01-01')
			.mockReturnValueOnce('2023-01-31')
			.mockReturnValueOnce('cust-456')
			.mockReturnValueOnce('json');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeReportOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([{
			json: mockResponse,
			pairedItem: { item: 0 },
		}]);
	});

	it('should handle API errors', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getInventoryReport');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(executeReportOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		)).rejects.toThrow('API Error');
	});

	it('should continue on fail when enabled', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getInventoryReport');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeReportOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([{
			json: { error: 'API Error' },
			pairedItem: { item: 0 },
		}]);
	});
});
});
