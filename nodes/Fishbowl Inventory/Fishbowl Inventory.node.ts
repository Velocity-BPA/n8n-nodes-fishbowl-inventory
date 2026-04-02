/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-fishbowlinventory/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class FishbowlInventory implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Fishbowl Inventory',
    name: 'fishbowlinventory',
    icon: 'file:fishbowlinventory.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Fishbowl Inventory API',
    defaults: {
      name: 'Fishbowl Inventory',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'fishbowlinventoryApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Product',
            value: 'product',
          },
          {
            name: 'Inventory',
            value: 'inventory',
          },
          {
            name: 'Location',
            value: 'location',
          },
          {
            name: 'Purchase Order',
            value: 'purchaseOrder',
          },
          {
            name: 'SalesOrder',
            value: 'salesOrder',
          },
          {
            name: 'Vendor',
            value: 'vendor',
          },
          {
            name: 'Customer',
            value: 'customer',
          },
          {
            name: 'Report',
            value: 'report',
          }
        ],
        default: 'product',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['product'],
		},
	},
	options: [
		{
			name: 'Get Products',
			value: 'getProducts',
			description: 'Retrieve all products with filtering options',
			action: 'Get all products',
		},
		{
			name: 'Get Product',
			value: 'getProduct',
			description: 'Get specific product by ID',
			action: 'Get a product',
		},
		{
			name: 'Create Product',
			value: 'createProduct',
			description: 'Create new product',
			action: 'Create a product',
		},
		{
			name: 'Update Product',
			value: 'updateProduct',
			description: 'Update existing product',
			action: 'Update a product',
		},
		{
			name: 'Delete Product',
			value: 'deleteProduct',
			description: 'Delete product by ID',
			action: 'Delete a product',
		},
	],
	default: 'getProducts',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['inventory'] } },
  options: [
    { name: 'Get Inventory Levels', value: 'getInventoryLevels', description: 'Get inventory levels across all locations', action: 'Get inventory levels' },
    { name: 'Get Product Inventory', value: 'getProductInventory', description: 'Get inventory for specific product', action: 'Get product inventory' },
    { name: 'Create Inventory Adjustment', value: 'createInventoryAdjustment', description: 'Create inventory adjustment', action: 'Create inventory adjustment' },
    { name: 'Update Inventory Level', value: 'updateInventoryLevel', description: 'Update inventory quantity', action: 'Update inventory level' },
    { name: 'Get Inventory Movements', value: 'getInventoryMovements', description: 'Get inventory movement history', action: 'Get inventory movements' }
  ],
  default: 'getInventoryLevels',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['location'],
		},
	},
	options: [
		{
			name: 'Get All Locations',
			value: 'getLocations',
			description: 'Retrieve all warehouse locations',
			action: 'Get all locations',
		},
		{
			name: 'Get Location',
			value: 'getLocation',
			description: 'Get specific location details',
			action: 'Get a location',
		},
		{
			name: 'Create Location',
			value: 'createLocation',
			description: 'Create new location',
			action: 'Create a location',
		},
		{
			name: 'Update Location',
			value: 'updateLocation',
			description: 'Update location details',
			action: 'Update a location',
		},
		{
			name: 'Delete Location',
			value: 'deleteLocation',
			description: 'Delete location',
			action: 'Delete a location',
		},
	],
	default: 'getLocations',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['purchaseOrder'],
		},
	},
	options: [
		{
			name: 'Get Purchase Orders',
			value: 'getPurchaseOrders',
			description: 'Get all purchase orders',
			action: 'Get all purchase orders',
		},
		{
			name: 'Get Purchase Order',
			value: 'getPurchaseOrder',
			description: 'Get a specific purchase order',
			action: 'Get a purchase order',
		},
		{
			name: 'Create Purchase Order',
			value: 'createPurchaseOrder',
			description: 'Create a new purchase order',
			action: 'Create a purchase order',
		},
		{
			name: 'Update Purchase Order',
			value: 'updatePurchaseOrder',
			description: 'Update an existing purchase order',
			action: 'Update a purchase order',
		},
		{
			name: 'Receive Purchase Order',
			value: 'receivePurchaseOrder',
			description: 'Mark items as received for a purchase order',
			action: 'Receive a purchase order',
		},
	],
	default: 'getPurchaseOrders',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['salesOrder'] } },
  options: [
    { name: 'Get Sales Orders', value: 'getSalesOrders', description: 'Get all sales orders', action: 'Get sales orders' },
    { name: 'Get Sales Order', value: 'getSalesOrder', description: 'Get specific sales order', action: 'Get sales order' },
    { name: 'Create Sales Order', value: 'createSalesOrder', description: 'Create new sales order', action: 'Create sales order' },
    { name: 'Update Sales Order', value: 'updateSalesOrder', description: 'Update sales order', action: 'Update sales order' },
    { name: 'Fulfill Sales Order', value: 'fulfillSalesOrder', description: 'Mark order as fulfilled', action: 'Fulfill sales order' }
  ],
  default: 'getSalesOrders',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['vendor'] } },
  options: [
    { name: 'Get All Vendors', value: 'getVendors', description: 'Get all vendors', action: 'Get all vendors' },
    { name: 'Get Vendor', value: 'getVendor', description: 'Get specific vendor details', action: 'Get vendor' },
    { name: 'Create Vendor', value: 'createVendor', description: 'Create new vendor', action: 'Create vendor' },
    { name: 'Update Vendor', value: 'updateVendor', description: 'Update vendor information', action: 'Update vendor' },
    { name: 'Delete Vendor', value: 'deleteVendor', description: 'Delete vendor', action: 'Delete vendor' }
  ],
  default: 'getVendors',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['customer'] } },
  options: [
    { name: 'Get All Customers', value: 'getCustomers', description: 'Get all customers', action: 'Get all customers' },
    { name: 'Get Customer', value: 'getCustomer', description: 'Get specific customer details', action: 'Get a customer' },
    { name: 'Create Customer', value: 'createCustomer', description: 'Create new customer', action: 'Create a customer' },
    { name: 'Update Customer', value: 'updateCustomer', description: 'Update customer information', action: 'Update a customer' },
    { name: 'Delete Customer', value: 'deleteCustomer', description: 'Delete customer', action: 'Delete a customer' }
  ],
  default: 'getCustomers',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['report'] } },
	options: [
		{
			name: 'Get Inventory Report',
			value: 'getInventoryReport',
			description: 'Generate inventory level report',
			action: 'Get inventory report',
		},
		{
			name: 'Get Sales Report',
			value: 'getSalesReport',
			description: 'Generate sales performance report',
			action: 'Get sales report',
		},
		{
			name: 'Get Purchasing Report',
			value: 'getPurchasingReport',
			description: 'Generate purchasing activity report',
			action: 'Get purchasing report',
		},
		{
			name: 'Get Inventory Valuation',
			value: 'getInventoryValuation',
			description: 'Get inventory valuation report',
			action: 'Get inventory valuation',
		},
		{
			name: 'Get Movement Report',
			value: 'getMovementReport',
			description: 'Generate inventory movement report',
			action: 'Get movement report',
		},
	],
	default: 'getInventoryReport',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['product'],
			operation: ['getProducts'],
		},
	},
	default: 50,
	description: 'Maximum number of products to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['product'],
			operation: ['getProducts'],
		},
	},
	default: 0,
	description: 'Number of products to skip',
},
{
	displayName: 'SKU',
	name: 'sku',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['product'],
			operation: ['getProducts'],
		},
	},
	default: '',
	description: 'Filter products by SKU',
},
{
	displayName: 'Category',
	name: 'category',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['product'],
			operation: ['getProducts'],
		},
	},
	default: '',
	description: 'Filter products by category',
},
{
	displayName: 'Active',
	name: 'active',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['product'],
			operation: ['getProducts'],
		},
	},
	default: true,
	description: 'Filter by active products only',
},
{
	displayName: 'Product ID',
	name: 'id',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['product'],
			operation: ['getProduct', 'updateProduct', 'deleteProduct'],
		},
	},
	default: '',
	description: 'The ID of the product',
},
{
	displayName: 'SKU',
	name: 'sku',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['product'],
			operation: ['createProduct', 'updateProduct'],
		},
	},
	default: '',
	description: 'Product SKU (Stock Keeping Unit)',
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['product'],
			operation: ['createProduct', 'updateProduct'],
		},
	},
	default: '',
	description: 'Product name',
},
{
	displayName: 'Description',
	name: 'description',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['product'],
			operation: ['createProduct', 'updateProduct'],
		},
	},
	default: '',
	description: 'Product description',
},
{
	displayName: 'Price',
	name: 'price',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['product'],
			operation: ['createProduct', 'updateProduct'],
		},
	},
	default: 0,
	description: 'Product price',
},
{
	displayName: 'Category',
	name: 'category',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['product'],
			operation: ['createProduct', 'updateProduct'],
		},
	},
	default: '',
	description: 'Product category',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 50,
  description: 'Maximum number of records to return',
  displayOptions: {
    show: {
      resource: ['inventory'],
      operation: ['getInventoryLevels']
    }
  }
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  default: 0,
  description: 'Number of records to skip',
  displayOptions: {
    show: {
      resource: ['inventory'],
      operation: ['getInventoryLevels']
    }
  }
},
{
  displayName: 'Location ID',
  name: 'locationId',
  type: 'string',
  default: '',
  description: 'Filter by location ID',
  displayOptions: {
    show: {
      resource: ['inventory'],
      operation: ['getInventoryLevels', 'getProductInventory', 'createInventoryAdjustment', 'updateInventoryLevel']
    }
  }
},
{
  displayName: 'Product ID',
  name: 'productId',
  type: 'string',
  default: '',
  description: 'Filter by product ID',
  displayOptions: {
    show: {
      resource: ['inventory'],
      operation: ['getInventoryLevels']
    }
  }
},
{
  displayName: 'SKU',
  name: 'sku',
  type: 'string',
  default: '',
  description: 'Filter by product SKU',
  displayOptions: {
    show: {
      resource: ['inventory'],
      operation: ['getInventoryLevels']
    }
  }
},
{
  displayName: 'Product ID',
  name: 'productId',
  type: 'string',
  required: true,
  default: '',
  description: 'Product ID to get inventory for',
  displayOptions: {
    show: {
      resource: ['inventory'],
      operation: ['getProductInventory', 'createInventoryAdjustment', 'updateInventoryLevel']
    }
  }
},
{
  displayName: 'Quantity',
  name: 'quantity',
  type: 'number',
  required: true,
  default: 0,
  description: 'Adjustment quantity (positive or negative)',
  displayOptions: {
    show: {
      resource: ['inventory'],
      operation: ['createInventoryAdjustment']
    }
  }
},
{
  displayName: 'Reason',
  name: 'reason',
  type: 'string',
  required: true,
  default: '',
  description: 'Reason for adjustment',
  displayOptions: {
    show: {
      resource: ['inventory'],
      operation: ['createInventoryAdjustment', 'updateInventoryLevel']
    }
  }
},
{
  displayName: 'Notes',
  name: 'notes',
  type: 'string',
  default: '',
  description: 'Additional notes for adjustment',
  displayOptions: {
    show: {
      resource: ['inventory'],
      operation: ['createInventoryAdjustment']
    }
  }
},
{
  displayName: 'New Quantity',
  name: 'newQuantity',
  type: 'number',
  required: true,
  default: 0,
  description: 'New inventory quantity',
  displayOptions: {
    show: {
      resource: ['inventory'],
      operation: ['updateInventoryLevel']
    }
  }
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 50,
  description: 'Maximum number of movements to return',
  displayOptions: {
    show: {
      resource: ['inventory'],
      operation: ['getInventoryMovements']
    }
  }
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  default: 0,
  description: 'Number of movements to skip',
  displayOptions: {
    show: {
      resource: ['inventory'],
      operation: ['getInventoryMovements']
    }
  }
},
{
  displayName: 'Date From',
  name: 'dateFrom',
  type: 'dateTime',
  default: '',
  description: 'Start date for movement history',
  displayOptions: {
    show: {
      resource: ['inventory'],
      operation: ['getInventoryMovements']
    }
  }
},
{
  displayName: 'Date To',
  name: 'dateTo',
  type: 'dateTime',
  default: '',
  description: 'End date for movement history',
  displayOptions: {
    show: {
      resource: ['inventory'],
      operation: ['getInventoryMovements']
    }
  }
},
{
  displayName: 'Product ID',
  name: 'productId',
  type: 'string',
  default: '',
  description: 'Filter movements by product ID',
  displayOptions: {
    show: {
      resource: ['inventory'],
      operation: ['getInventoryMovements']
    }
  }
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 50,
	description: 'Number of locations to return',
	displayOptions: {
		show: {
			resource: ['location'],
			operation: ['getLocations'],
		},
	},
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	default: 0,
	description: 'Number of locations to skip',
	displayOptions: {
		show: {
			resource: ['location'],
			operation: ['getLocations'],
		},
	},
},
{
	displayName: 'Active',
	name: 'active',
	type: 'boolean',
	default: true,
	description: 'Filter by active status',
	displayOptions: {
		show: {
			resource: ['location'],
			operation: ['getLocations'],
		},
	},
},
{
	displayName: 'Type',
	name: 'type',
	type: 'string',
	default: '',
	description: 'Filter by location type',
	displayOptions: {
		show: {
			resource: ['location'],
			operation: ['getLocations'],
		},
	},
},
{
	displayName: 'Location ID',
	name: 'locationId',
	type: 'string',
	required: true,
	default: '',
	description: 'The ID of the location',
	displayOptions: {
		show: {
			resource: ['location'],
			operation: ['getLocation', 'updateLocation', 'deleteLocation'],
		},
	},
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	required: true,
	default: '',
	description: 'The name of the location',
	displayOptions: {
		show: {
			resource: ['location'],
			operation: ['createLocation', 'updateLocation'],
		},
	},
},
{
	displayName: 'Code',
	name: 'code',
	type: 'string',
	required: true,
	default: '',
	description: 'The code of the location',
	displayOptions: {
		show: {
			resource: ['location'],
			operation: ['createLocation', 'updateLocation'],
		},
	},
},
{
	displayName: 'Type',
	name: 'locationType',
	type: 'string',
	required: true,
	default: '',
	description: 'The type of the location',
	displayOptions: {
		show: {
			resource: ['location'],
			operation: ['createLocation', 'updateLocation'],
		},
	},
},
{
	displayName: 'Parent Location ID',
	name: 'parentLocationId',
	type: 'string',
	default: '',
	description: 'The ID of the parent location',
	displayOptions: {
		show: {
			resource: ['location'],
			operation: ['createLocation'],
		},
	},
},
{
	displayName: 'Active',
	name: 'locationActive',
	type: 'boolean',
	default: true,
	description: 'Whether the location is active',
	displayOptions: {
		show: {
			resource: ['location'],
			operation: ['createLocation', 'updateLocation'],
		},
	},
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['purchaseOrder'],
			operation: ['getPurchaseOrders'],
		},
	},
	default: 50,
	description: 'Number of purchase orders to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['purchaseOrder'],
			operation: ['getPurchaseOrders'],
		},
	},
	default: 0,
	description: 'Number of purchase orders to skip',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['purchaseOrder'],
			operation: ['getPurchaseOrders'],
		},
	},
	default: '',
	description: 'Filter by purchase order status',
},
{
	displayName: 'Vendor ID',
	name: 'vendorId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['purchaseOrder'],
			operation: ['getPurchaseOrders', 'createPurchaseOrder'],
		},
	},
	default: '',
	description: 'Filter by vendor ID or specify vendor for new purchase order',
	required: true,
	routing: {
		show: {
			operation: ['createPurchaseOrder'],
		},
	},
},
{
	displayName: 'Date From',
	name: 'dateFrom',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['purchaseOrder'],
			operation: ['getPurchaseOrders'],
		},
	},
	default: '',
	description: 'Filter purchase orders from this date',
},
{
	displayName: 'Date To',
	name: 'dateTo',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['purchaseOrder'],
			operation: ['getPurchaseOrders'],
		},
	},
	default: '',
	description: 'Filter purchase orders to this date',
},
{
	displayName: 'Purchase Order ID',
	name: 'id',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['purchaseOrder'],
			operation: ['getPurchaseOrder', 'updatePurchaseOrder', 'receivePurchaseOrder'],
		},
	},
	default: '',
	description: 'The ID of the purchase order',
	required: true,
},
{
	displayName: 'Items',
	name: 'items',
	type: 'json',
	displayOptions: {
		show: {
			resource: ['purchaseOrder'],
			operation: ['createPurchaseOrder', 'updatePurchaseOrder'],
		},
	},
	default: '[]',
	description: 'Array of items for the purchase order',
	required: true,
	routing: {
		show: {
			operation: ['createPurchaseOrder'],
		},
	},
},
{
	displayName: 'Expected Date',
	name: 'expectedDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['purchaseOrder'],
			operation: ['createPurchaseOrder', 'updatePurchaseOrder'],
		},
	},
	default: '',
	description: 'Expected delivery date for the purchase order',
},
{
	displayName: 'Notes',
	name: 'notes',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['purchaseOrder'],
			operation: ['createPurchaseOrder'],
		},
	},
	default: '',
	description: 'Additional notes for the purchase order',
},
{
	displayName: 'Status',
	name: 'updateStatus',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['purchaseOrder'],
			operation: ['updatePurchaseOrder'],
		},
	},
	default: '',
	description: 'New status for the purchase order',
},
{
	displayName: 'Received Items',
	name: 'receivedItems',
	type: 'json',
	displayOptions: {
		show: {
			resource: ['purchaseOrder'],
			operation: ['receivePurchaseOrder'],
		},
	},
	default: '[]',
	description: 'Array of items that were received',
	required: true,
},
{
	displayName: 'Receive Date',
	name: 'receiveDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['purchaseOrder'],
			operation: ['receivePurchaseOrder'],
		},
	},
	default: '',
	description: 'Date when items were received',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 50,
  description: 'Maximum number of sales orders to return',
  displayOptions: { show: { resource: ['salesOrder'], operation: ['getSalesOrders'] } },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  default: 0,
  description: 'Number of sales orders to skip',
  displayOptions: { show: { resource: ['salesOrder'], operation: ['getSalesOrders'] } },
},
{
  displayName: 'Status',
  name: 'status',
  type: 'string',
  default: '',
  description: 'Filter by order status',
  displayOptions: { show: { resource: ['salesOrder'], operation: ['getSalesOrders'] } },
},
{
  displayName: 'Customer ID',
  name: 'customerId',
  type: 'string',
  default: '',
  description: 'Filter by customer ID',
  displayOptions: { show: { resource: ['salesOrder'], operation: ['getSalesOrders', 'createSalesOrder'] } },
  required: true,
  requiredIf: 'createSalesOrder',
},
{
  displayName: 'Date From',
  name: 'dateFrom',
  type: 'dateTime',
  default: '',
  description: 'Filter orders from this date',
  displayOptions: { show: { resource: ['salesOrder'], operation: ['getSalesOrders'] } },
},
{
  displayName: 'Date To',
  name: 'dateTo',
  type: 'dateTime',
  default: '',
  description: 'Filter orders to this date',
  displayOptions: { show: { resource: ['salesOrder'], operation: ['getSalesOrders'] } },
},
{
  displayName: 'Sales Order ID',
  name: 'id',
  type: 'string',
  required: true,
  default: '',
  description: 'The ID of the sales order',
  displayOptions: { show: { resource: ['salesOrder'], operation: ['getSalesOrder', 'updateSalesOrder', 'fulfillSalesOrder'] } },
},
{
  displayName: 'Items',
  name: 'items',
  type: 'json',
  default: '[]',
  description: 'Array of order items',
  displayOptions: { show: { resource: ['salesOrder'], operation: ['createSalesOrder', 'updateSalesOrder'] } },
  required: true,
  requiredIf: 'createSalesOrder',
},
{
  displayName: 'Ship Date',
  name: 'shipDate',
  type: 'dateTime',
  default: '',
  description: 'Scheduled ship date for the order',
  displayOptions: { show: { resource: ['salesOrder'], operation: ['createSalesOrder', 'updateSalesOrder'] } },
},
{
  displayName: 'Billing Address',
  name: 'billingAddress',
  type: 'json',
  default: '{}',
  description: 'Billing address object',
  displayOptions: { show: { resource: ['salesOrder'], operation: ['createSalesOrder'] } },
},
{
  displayName: 'Shipping Address',
  name: 'shippingAddress',
  type: 'json',
  default: '{}',
  description: 'Shipping address object',
  displayOptions: { show: { resource: ['salesOrder'], operation: ['createSalesOrder'] } },
},
{
  displayName: 'Order Status',
  name: 'orderStatus',
  type: 'string',
  default: '',
  description: 'New status for the order',
  displayOptions: { show: { resource: ['salesOrder'], operation: ['updateSalesOrder'] } },
},
{
  displayName: 'Fulfillment Items',
  name: 'fulfillmentItems',
  type: 'json',
  default: '[]',
  description: 'Array of items being fulfilled',
  displayOptions: { show: { resource: ['salesOrder'], operation: ['fulfillSalesOrder'] } },
  required: true,
},
{
  displayName: 'Tracking Number',
  name: 'trackingNumber',
  type: 'string',
  default: '',
  description: 'Tracking number for the shipment',
  displayOptions: { show: { resource: ['salesOrder'], operation: ['fulfillSalesOrder'] } },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 50,
  description: 'Maximum number of vendors to return',
  displayOptions: { show: { resource: ['vendor'], operation: ['getVendors'] } }
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  default: 0,
  description: 'Number of vendors to skip',
  displayOptions: { show: { resource: ['vendor'], operation: ['getVendors'] } }
},
{
  displayName: 'Active',
  name: 'active',
  type: 'boolean',
  default: true,
  description: 'Filter by active vendors only',
  displayOptions: { show: { resource: ['vendor'], operation: ['getVendors'] } }
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  default: '',
  description: 'Filter vendors by name',
  displayOptions: { show: { resource: ['vendor'], operation: ['getVendors'] } }
},
{
  displayName: 'Vendor ID',
  name: 'vendorId',
  type: 'string',
  required: true,
  default: '',
  description: 'The ID of the vendor',
  displayOptions: { show: { resource: ['vendor'], operation: ['getVendor', 'updateVendor', 'deleteVendor'] } }
},
{
  displayName: 'Vendor Name',
  name: 'vendorName',
  type: 'string',
  required: true,
  default: '',
  description: 'Name of the vendor',
  displayOptions: { show: { resource: ['vendor'], operation: ['createVendor', 'updateVendor'] } }
},
{
  displayName: 'Contact',
  name: 'contact',
  type: 'string',
  default: '',
  description: 'Primary contact person',
  displayOptions: { show: { resource: ['vendor'], operation: ['createVendor', 'updateVendor'] } }
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  default: '',
  description: 'Vendor address',
  displayOptions: { show: { resource: ['vendor'], operation: ['createVendor', 'updateVendor'] } }
},
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  default: '',
  description: 'Vendor email address',
  displayOptions: { show: { resource: ['vendor'], operation: ['createVendor', 'updateVendor'] } }
},
{
  displayName: 'Phone',
  name: 'phone',
  type: 'string',
  default: '',
  description: 'Vendor phone number',
  displayOptions: { show: { resource: ['vendor'], operation: ['createVendor', 'updateVendor'] } }
},
{
  displayName: 'Terms',
  name: 'terms',
  type: 'string',
  default: '',
  description: 'Payment terms',
  displayOptions: { show: { resource: ['vendor'], operation: ['createVendor'] } }
},
{
  displayName: 'Customer ID',
  name: 'customerId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['customer'], operation: ['getCustomer', 'updateCustomer', 'deleteCustomer'] } },
  default: '',
  description: 'The ID of the customer',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['customer'], operation: ['getCustomers'] } },
  default: 50,
  description: 'Number of customers to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['customer'], operation: ['getCustomers'] } },
  default: 0,
  description: 'Number of customers to skip',
},
{
  displayName: 'Active Only',
  name: 'active',
  type: 'boolean',
  displayOptions: { show: { resource: ['customer'], operation: ['getCustomers'] } },
  default: true,
  description: 'Whether to return only active customers',
},
{
  displayName: 'Filter by Name',
  name: 'name',
  type: 'string',
  displayOptions: { show: { resource: ['customer'], operation: ['getCustomers'] } },
  default: '',
  description: 'Filter customers by name',
},
{
  displayName: 'Filter by Email',
  name: 'email',
  type: 'string',
  displayOptions: { show: { resource: ['customer'], operation: ['getCustomers'] } },
  default: '',
  description: 'Filter customers by email',
},
{
  displayName: 'Customer Name',
  name: 'customerName',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['customer'], operation: ['createCustomer', 'updateCustomer'] } },
  default: '',
  description: 'The name of the customer',
},
{
  displayName: 'Email',
  name: 'customerEmail',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['customer'], operation: ['createCustomer', 'updateCustomer'] } },
  default: '',
  description: 'The email address of the customer',
},
{
  displayName: 'Phone',
  name: 'phone',
  type: 'string',
  displayOptions: { show: { resource: ['customer'], operation: ['createCustomer', 'updateCustomer'] } },
  default: '',
  description: 'The phone number of the customer',
},
{
  displayName: 'Billing Address',
  name: 'billingAddress',
  type: 'string',
  displayOptions: { show: { resource: ['customer'], operation: ['createCustomer'] } },
  default: '',
  description: 'The billing address of the customer',
},
{
  displayName: 'Shipping Address',
  name: 'shippingAddress',
  type: 'string',
  displayOptions: { show: { resource: ['customer'], operation: ['createCustomer'] } },
  default: '',
  description: 'The shipping address of the customer',
},
{
  displayName: 'Terms',
  name: 'terms',
  type: 'string',
  displayOptions: { show: { resource: ['customer'], operation: ['createCustomer'] } },
  default: '',
  description: 'Payment terms for the customer',
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  displayOptions: { show: { resource: ['customer'], operation: ['updateCustomer'] } },
  default: '',
  description: 'Updated addresses for the customer (JSON format)',
},
{
	displayName: 'Location ID',
	name: 'locationId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getInventoryReport'],
		},
	},
	default: '',
	description: 'ID of the location to generate report for',
},
{
	displayName: 'Date From',
	name: 'dateFrom',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getInventoryReport'],
		},
	},
	default: '',
	description: 'Start date for the report period',
},
{
	displayName: 'Date To',
	name: 'dateTo',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getInventoryReport'],
		},
	},
	default: '',
	description: 'End date for the report period',
},
{
	displayName: 'Format',
	name: 'format',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getInventoryReport'],
		},
	},
	options: [
		{
			name: 'JSON',
			value: 'json',
		},
		{
			name: 'CSV',
			value: 'csv',
		},
		{
			name: 'PDF',
			value: 'pdf',
		},
	],
	default: 'json',
	description: 'Output format for the report',
},
{
	displayName: 'Date From',
	name: 'dateFrom',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getSalesReport'],
		},
	},
	default: '',
	required: true,
	description: 'Start date for the sales report period',
},
{
	displayName: 'Date To',
	name: 'dateTo',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getSalesReport'],
		},
	},
	default: '',
	required: true,
	description: 'End date for the sales report period',
},
{
	displayName: 'Customer ID',
	name: 'customerId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getSalesReport'],
		},
	},
	default: '',
	description: 'ID of specific customer to filter by',
},
{
	displayName: 'Format',
	name: 'format',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getSalesReport'],
		},
	},
	options: [
		{
			name: 'JSON',
			value: 'json',
		},
		{
			name: 'CSV',
			value: 'csv',
		},
		{
			name: 'PDF',
			value: 'pdf',
		},
	],
	default: 'json',
	description: 'Output format for the report',
},
{
	displayName: 'Date From',
	name: 'dateFrom',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getPurchasingReport'],
		},
	},
	default: '',
	required: true,
	description: 'Start date for the purchasing report period',
},
{
	displayName: 'Date To',
	name: 'dateTo',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getPurchasingReport'],
		},
	},
	default: '',
	required: true,
	description: 'End date for the purchasing report period',
},
{
	displayName: 'Vendor ID',
	name: 'vendorId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getPurchasingReport'],
		},
	},
	default: '',
	description: 'ID of specific vendor to filter by',
},
{
	displayName: 'Format',
	name: 'format',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getPurchasingReport'],
		},
	},
	options: [
		{
			name: 'JSON',
			value: 'json',
		},
		{
			name: 'CSV',
			value: 'csv',
		},
		{
			name: 'PDF',
			value: 'pdf',
		},
	],
	default: 'json',
	description: 'Output format for the report',
},
{
	displayName: 'Location ID',
	name: 'locationId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getInventoryValuation'],
		},
	},
	default: '',
	description: 'ID of the location to generate valuation for',
},
{
	displayName: 'Date',
	name: 'date',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getInventoryValuation'],
		},
	},
	default: '',
	required: true,
	description: 'Date for the inventory valuation',
},
{
	displayName: 'Method',
	name: 'method',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getInventoryValuation'],
		},
	},
	options: [
		{
			name: 'FIFO',
			value: 'fifo',
		},
		{
			name: 'LIFO',
			value: 'lifo',
		},
		{
			name: 'Average',
			value: 'average',
		},
		{
			name: 'Standard',
			value: 'standard',
		},
	],
	default: 'fifo',
	description: 'Valuation method to use',
},
{
	displayName: 'Format',
	name: 'format',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getInventoryValuation'],
		},
	},
	options: [
		{
			name: 'JSON',
			value: 'json',
		},
		{
			name: 'CSV',
			value: 'csv',
		},
		{
			name: 'PDF',
			value: 'pdf',
		},
	],
	default: 'json',
	description: 'Output format for the report',
},
{
	displayName: 'Product ID',
	name: 'productId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getMovementReport'],
		},
	},
	default: '',
	description: 'ID of specific product to track movement for',
},
{
	displayName: 'Location ID',
	name: 'locationId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getMovementReport'],
		},
	},
	default: '',
	description: 'ID of the location to track movement for',
},
{
	displayName: 'Date From',
	name: 'dateFrom',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getMovementReport'],
		},
	},
	default: '',
	required: true,
	description: 'Start date for the movement report period',
},
{
	displayName: 'Date To',
	name: 'dateTo',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['report'],
			operation: ['getMovementReport'],
		},
	},
	default: '',
	required: true,
	description: 'End date for the movement report period',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'product':
        return [await executeProductOperations.call(this, items)];
      case 'inventory':
        return [await executeInventoryOperations.call(this, items)];
      case 'location':
        return [await executeLocationOperations.call(this, items)];
      case 'purchaseOrder':
        return [await executePurchaseOrderOperations.call(this, items)];
      case 'salesOrder':
        return [await executeSalesOrderOperations.call(this, items)];
      case 'vendor':
        return [await executeVendorOperations.call(this, items)];
      case 'customer':
        return [await executeCustomerOperations.call(this, items)];
      case 'report':
        return [await executeReportOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeProductOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('fishbowlinventoryApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getProducts': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const sku = this.getNodeParameter('sku', i) as string;
					const category = this.getNodeParameter('category', i) as string;
					const active = this.getNodeParameter('active', i) as boolean;

					const queryParams: any = {
						limit,
						offset,
						active,
					};

					if (sku) queryParams.sku = sku;
					if (category) queryParams.category = category;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/products`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: queryParams,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getProduct': {
					const id = this.getNodeParameter('id', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/products/${id}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createProduct': {
					const sku = this.getNodeParameter('sku', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const price = this.getNodeParameter('price', i) as number;
					const category = this.getNodeParameter('category', i) as string;

					const body: any = {
						sku,
						name,
					};

					if (description) body.description = description;
					if (price) body.price = price;
					if (category) body.category = category;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/products`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateProduct': {
					const id = this.getNodeParameter('id', i) as string;
					const sku = this.getNodeParameter('sku', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const price = this.getNodeParameter('price', i) as number;
					const category = this.getNodeParameter('category', i) as string;

					const body: any = {
						sku,
						name,
					};

					if (description) body.description = description;
					if (price) body.price = price;
					if (category) body.category = category;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/products/${id}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteProduct': {
					const id = this.getNodeParameter('id', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/products/${id}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeInventoryOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('fishbowlinventoryApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getInventoryLevels': {
          const qs: any = {};
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const locationId = this.getNodeParameter('locationId', i) as string;
          const productId = this.getNodeParameter('productId', i) as string;
          const sku = this.getNodeParameter('sku', i) as string;

          if (limit) qs.limit = limit;
          if (offset) qs.offset = offset;
          if (locationId) qs.locationId = locationId;
          if (productId) qs.productId = productId;
          if (sku) qs.sku = sku;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/inventory`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProductInventory': {
          const productId = this.getNodeParameter('productId', i) as string;
          const locationId = this.getNodeParameter('locationId', i) as string;
          const qs: any = {};

          if (locationId) qs.locationId = locationId;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/inventory/${productId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createInventoryAdjustment': {
          const productId = this.getNodeParameter('productId', i) as string;
          const locationId = this.getNodeParameter('locationId', i) as string;
          const quantity = this.getNodeParameter('quantity', i) as number;
          const reason = this.getNodeParameter('reason', i) as string;
          const notes = this.getNodeParameter('notes', i) as string;

          const body: any = {
            productId,
            locationId,
            quantity,
            reason,
          };

          if (notes) body.notes = notes;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/inventory/adjustments`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateInventoryLevel': {
          const productId = this.getNodeParameter('productId', i) as string;
          const locationId = this.getNodeParameter('locationId', i) as string;
          const newQuantity = this.getNodeParameter('newQuantity', i) as number;
          const reason = this.getNodeParameter('reason', i) as string;

          const body: any = {
            productId,
            locationId,
            newQuantity,
            reason,
          };

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/inventory`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getInventoryMovements': {
          const qs: any = {};
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const dateFrom = this.getNodeParameter('dateFrom', i) as string;
          const dateTo = this.getNodeParameter('dateTo', i) as string;
          const productId = this.getNodeParameter('productId', i) as string;

          if (limit) qs.limit = limit;
          if (offset) qs.offset = offset;
          if (dateFrom) qs.dateFrom = dateFrom;
          if (dateTo) qs.dateTo = dateTo;
          if (productId) qs.productId = productId;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/inventory/movements`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeLocationOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('fishbowlinventoryApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getLocations': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const active = this.getNodeParameter('active', i) as boolean;
					const type = this.getNodeParameter('type', i) as string;

					const qs: any = {
						limit,
						offset,
						active,
					};

					if (type) {
						qs.type = type;
					}

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/locations`,
						qs,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getLocation': {
					const locationId = this.getNodeParameter('locationId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/locations/${locationId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createLocation': {
					const name = this.getNodeParameter('name', i) as string;
					const code = this.getNodeParameter('code', i) as string;
					const locationType = this.getNodeParameter('locationType', i) as string;
					const parentLocationId = this.getNodeParameter('parentLocationId', i) as string;
					const locationActive = this.getNodeParameter('locationActive', i) as boolean;

					const body: any = {
						name,
						code,
						type: locationType,
						active: locationActive,
					};

					if (parentLocationId) {
						body.parentLocationId = parentLocationId;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/locations`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateLocation': {
					const locationId = this.getNodeParameter('locationId', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const code = this.getNodeParameter('code', i) as string;
					const locationType = this.getNodeParameter('locationType', i) as string;
					const locationActive = this.getNodeParameter('locationActive', i) as boolean;

					const body: any = {
						name,
						code,
						type: locationType,
						active: locationActive,
					};

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/locations/${locationId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteLocation': {
					const locationId = this.getNodeParameter('locationId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/locations/${locationId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: {
					item: i,
				},
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: {
						item: i,
					},
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executePurchaseOrderOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('fishbowlinventoryApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getPurchaseOrders': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const status = this.getNodeParameter('status', i) as string;
					const vendorId = this.getNodeParameter('vendorId', i) as string;
					const dateFrom = this.getNodeParameter('dateFrom', i) as string;
					const dateTo = this.getNodeParameter('dateTo', i) as string;

					const qs: any = {};
					if (limit) qs.limit = limit;
					if (offset) qs.offset = offset;
					if (status) qs.status = status;
					if (vendorId) qs.vendorId = vendorId;
					if (dateFrom) qs.dateFrom = dateFrom;
					if (dateTo) qs.dateTo = dateTo;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/purchaseorders`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getPurchaseOrder': {
					const id = this.getNodeParameter('id', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/purchaseorders/${id}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createPurchaseOrder': {
					const vendorId = this.getNodeParameter('vendorId', i) as string;
					const items = this.getNodeParameter('items', i) as any;
					const expectedDate = this.getNodeParameter('expectedDate', i) as string;
					const notes = this.getNodeParameter('notes', i) as string;

					const body: any = {
						vendorId,
						items: typeof items === 'string' ? JSON.parse(items) : items,
					};

					if (expectedDate) body.expectedDate = expectedDate;
					if (notes) body.notes = notes;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/purchaseorders`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updatePurchaseOrder': {
					const id = this.getNodeParameter('id', i) as string;
					const updateStatus = this.getNodeParameter('updateStatus', i) as string;
					const items = this.getNodeParameter('items', i) as any;
					const expectedDate = this.getNodeParameter('expectedDate', i) as string;

					const body: any = {};
					if (updateStatus) body.status = updateStatus;
					if (items) body.items = typeof items === 'string' ? JSON.parse(items) : items;
					if (expectedDate) body.expectedDate = expectedDate;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/purchaseorders/${id}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'receivePurchaseOrder': {
					const id = this.getNodeParameter('id', i) as string;
					const receivedItems = this.getNodeParameter('receivedItems', i) as any;
					const receiveDate = this.getNodeParameter('receiveDate', i) as string;

					const body: any = {
						receivedItems: typeof receivedItems === 'string' ? JSON.parse(receivedItems) : receivedItems,
					};

					if (receiveDate) body.receiveDate = receiveDate;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/purchaseorders/${id}/receive`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeSalesOrderOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('fishbowlinventoryApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getSalesOrders': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const status = this.getNodeParameter('status', i) as string;
          const customerId = this.getNodeParameter('customerId', i) as string;
          const dateFrom = this.getNodeParameter('dateFrom', i) as string;
          const dateTo = this.getNodeParameter('dateTo', i) as string;

          const queryParams = new URLSearchParams();
          if (limit) queryParams.append('limit', limit.toString());
          if (offset) queryParams.append('offset', offset.toString());
          if (status) queryParams.append('status', status);
          if (customerId) queryParams.append('customerId', customerId);
          if (dateFrom) queryParams.append('dateFrom', dateFrom);
          if (dateTo) queryParams.append('dateTo', dateTo);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/salesorders?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSalesOrder': {
          const id = this.getNodeParameter('id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/salesorders/${id}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createSalesOrder': {
          const customerId = this.getNodeParameter('customerId', i) as string;
          const items = this.getNodeParameter('items', i) as any;
          const shipDate = this.getNodeParameter('shipDate', i) as string;
          const billingAddress = this.getNodeParameter('billingAddress', i) as any;
          const shippingAddress = this.getNodeParameter('shippingAddress', i) as any;

          const body: any = {
            customerId,
            items: typeof items === 'string' ? JSON.parse(items) : items,
          };

          if (shipDate) body.shipDate = shipDate;
          if (billingAddress) body.billingAddress = typeof billingAddress === 'string' ? JSON.parse(billingAddress) : billingAddress;
          if (shippingAddress) body.shippingAddress = typeof shippingAddress === 'string' ? JSON.parse(shippingAddress) : shippingAddress;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/salesorders`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateSalesOrder': {
          const id = this.getNodeParameter('id', i) as string;
          const orderStatus = this.getNodeParameter('orderStatus', i) as string;
          const items = this.getNodeParameter('items', i) as any;
          const shipDate = this.getNodeParameter('shipDate', i) as string;

          const body: any = {};
          if (orderStatus) body.status = orderStatus;
          if (items) body.items = typeof items === 'string' ? JSON.parse(items) : items;
          if (shipDate) body.shipDate = shipDate;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/salesorders/${id}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'fulfillSalesOrder': {
          const id = this.getNodeParameter('id', i) as string;
          const fulfillmentItems = this.getNodeParameter('fulfillmentItems', i) as any;
          const trackingNumber = this.getNodeParameter('trackingNumber', i) as string;

          const body: any = {
            fulfillmentItems: typeof fulfillmentItems === 'string' ? JSON.parse(fulfillmentItems) : fulfillmentItems,
          };

          if (trackingNumber) body.trackingNumber = trackingNumber;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/salesorders/${id}/fulfill`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeVendorOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('fishbowlinventoryApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getVendors': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const active = this.getNodeParameter('active', i) as boolean;
          const name = this.getNodeParameter('name', i) as string;

          const queryParams: any = {};
          if (limit) queryParams.limit = limit;
          if (offset) queryParams.offset = offset;
          if (active !== undefined) queryParams.active = active;
          if (name) queryParams.name = name;

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/vendors${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getVendor': {
          const vendorId = this.getNodeParameter('vendorId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/vendors/${vendorId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createVendor': {
          const vendorName = this.getNodeParameter('vendorName', i) as string;
          const contact = this.getNodeParameter('contact', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const phone = this.getNodeParameter('phone', i) as string;
          const terms = this.getNodeParameter('terms', i) as string;

          const body: any = {
            name: vendorName,
          };
          if (contact) body.contact = contact;
          if (address) body.address = address;
          if (email) body.email = email;
          if (phone) body.phone = phone;
          if (terms) body.terms = terms;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/vendors`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateVendor': {
          const vendorId = this.getNodeParameter('vendorId', i) as string;
          const vendorName = this.getNodeParameter('vendorName', i) as string;
          const contact = this.getNodeParameter('contact', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const phone = this.getNodeParameter('phone', i) as string;

          const body: any = {
            name: vendorName,
          };
          if (contact) body.contact = contact;
          if (address) body.address = address;
          if (email) body.email = email;
          if (phone) body.phone = phone;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/vendors/${vendorId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteVendor': {
          const vendorId = this.getNodeParameter('vendorId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/vendors/${vendorId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeCustomerOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('fishbowlinventoryApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getCustomers': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const active = this.getNodeParameter('active', i) as boolean;
          const name = this.getNodeParameter('name', i) as string;
          const email = this.getNodeParameter('email', i) as string;

          const queryParams = new URLSearchParams();
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());
          queryParams.append('active', active.toString());
          if (name) queryParams.append('name', name);
          if (email) queryParams.append('email', email);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/customers?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCustomer': {
          const customerId = this.getNodeParameter('customerId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/customers/${customerId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createCustomer': {
          const customerName = this.getNodeParameter('customerName', i) as string;
          const customerEmail = this.getNodeParameter('customerEmail', i) as string;
          const phone = this.getNodeParameter('phone', i) as string;
          const billingAddress = this.getNodeParameter('billingAddress', i) as string;
          const shippingAddress = this.getNodeParameter('shippingAddress', i) as string;
          const terms = this.getNodeParameter('terms', i) as string;

          const body: any = {
            name: customerName,
            email: customerEmail,
          };

          if (phone) body.phone = phone;
          if (billingAddress) body.billingAddress = billingAddress;
          if (shippingAddress) body.shippingAddress = shippingAddress;
          if (terms) body.terms = terms;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/customers`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateCustomer': {
          const customerId = this.getNodeParameter('customerId', i) as string;
          const customerName = this.getNodeParameter('customerName', i) as string;
          const customerEmail = this.getNodeParameter('customerEmail', i) as string;
          const phone = this.getNodeParameter('phone', i) as string;
          const addresses = this.getNodeParameter('addresses', i) as string;

          const body: any = {
            name: customerName,
            email: customerEmail,
          };

          if (phone) body.phone = phone;
          if (addresses) {
            try {
              body.addresses = JSON.parse(addresses);
            } catch (error: any) {
              body.addresses = addresses;
            }
          }

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/customers/${customerId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteCustomer': {
          const customerId = this.getNodeParameter('customerId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/customers/${customerId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeReportOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('fishbowlinventoryApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getInventoryReport': {
					const locationId = this.getNodeParameter('locationId', i) as string;
					const dateFrom = this.getNodeParameter('dateFrom', i) as string;
					const dateTo = this.getNodeParameter('dateTo', i) as string;
					const format = this.getNodeParameter('format', i) as string;

					const qs: any = {};
					if (locationId) qs.locationId = locationId;
					if (dateFrom) qs.dateFrom = dateFrom;
					if (dateTo) qs.dateTo = dateTo;
					if (format) qs.format = format;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/reports/inventory`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Accept': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getSalesReport': {
					const dateFrom = this.getNodeParameter('dateFrom', i) as string;
					const dateTo = this.getNodeParameter('dateTo', i) as string;
					const customerId = this.getNodeParameter('customerId', i) as string;
					const format = this.getNodeParameter('format', i) as string;

					const qs: any = {
						dateFrom,
						dateTo,
					};
					if (customerId) qs.customerId = customerId;
					if (format) qs.format = format;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/reports/sales`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Accept': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getPurchasingReport': {
					const dateFrom = this.getNodeParameter('dateFrom', i) as string;
					const dateTo = this.getNodeParameter('dateTo', i) as string;
					const vendorId = this.getNodeParameter('vendorId', i) as string;
					const format = this.getNodeParameter('format', i) as string;

					const qs: any = {
						dateFrom,
						dateTo,
					};
					if (vendorId) qs.vendorId = vendorId;
					if (format) qs.format = format;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/reports/purchasing`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Accept': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getInventoryValuation': {
					const locationId = this.getNodeParameter('locationId', i) as string;
					const date = this.getNodeParameter('date', i) as string;
					const method = this.getNodeParameter('method', i) as string;
					const format = this.getNodeParameter('format', i) as string;

					const qs: any = {
						date,
						method,
					};
					if (locationId) qs.locationId = locationId;
					if (format) qs.format = format;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/reports/valuation`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Accept': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getMovementReport': {
					const productId = this.getNodeParameter('productId', i) as string;
					const locationId = this.getNodeParameter('locationId', i) as string;
					const dateFrom = this.getNodeParameter('dateFrom', i) as string;
					const dateTo = this.getNodeParameter('dateTo', i) as string;

					const qs: any = {
						dateFrom,
						dateTo,
					};
					if (productId) qs.productId = productId;
					if (locationId) qs.locationId = locationId;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/reports/movement`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Accept': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
