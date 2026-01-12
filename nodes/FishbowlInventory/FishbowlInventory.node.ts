/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import * as actions from './actions';

export class FishbowlInventory implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Fishbowl Inventory',
    name: 'fishbowlInventory',
    icon: 'file:fishbowl.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Fishbowl Inventory API for warehouse and manufacturing management',
    defaults: {
      name: 'Fishbowl Inventory',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'fishbowlInventoryApi',
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
          { name: 'Customer', value: 'customer' },
          { name: 'Import/Export', value: 'importExport' },
          { name: 'Location', value: 'location' },
          { name: 'Location Group', value: 'locationGroup' },
          { name: 'Manufacture Order', value: 'manufactureOrder' },
          { name: 'Part', value: 'part' },
          { name: 'Payment', value: 'payment' },
          { name: 'Purchase Order', value: 'purchaseOrder' },
          { name: 'Sales Order', value: 'salesOrder' },
          { name: 'Unit of Measure', value: 'uom' },
          { name: 'User', value: 'user' },
          { name: 'Vendor', value: 'vendor' },
        ],
        default: 'part',
      },

      // =====================
      // PART OPERATIONS
      // =====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['part'] },
        },
        options: [
          { name: 'Add Inventory', value: 'addInventory', description: 'Add inventory to a part', action: 'Add inventory to a part' },
          { name: 'Create', value: 'create', description: 'Create a new part', action: 'Create a part' },
          { name: 'Cycle Inventory', value: 'cycleInventory', description: 'Perform cycle count', action: 'Cycle count inventory' },
          { name: 'Delete', value: 'delete', description: 'Delete a part', action: 'Delete a part' },
          { name: 'Get', value: 'get', description: 'Get a part by ID or number', action: 'Get a part' },
          { name: 'Get Many', value: 'getAll', description: 'Get many parts', action: 'Get many parts' },
          { name: 'Get Inventory', value: 'getInventory', description: 'Get inventory for a part', action: 'Get inventory for a part' },
          { name: 'Get Tracking', value: 'getTracking', description: 'Get tracking items (lot/serial)', action: 'Get tracking items' },
          { name: 'Move Inventory', value: 'moveInventory', description: 'Move inventory between locations', action: 'Move inventory' },
          { name: 'Scrap Inventory', value: 'scrapInventory', description: 'Scrap inventory', action: 'Scrap inventory' },
          { name: 'Update', value: 'update', description: 'Update a part', action: 'Update a part' },
        ],
        default: 'get',
      },

      // Part Get Parameters
      {
        displayName: 'Part ID or Number',
        name: 'partId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['part'], operation: ['get', 'update', 'delete', 'getInventory', 'addInventory', 'cycleInventory', 'moveInventory', 'scrapInventory', 'getTracking'] },
        },
        description: 'The ID or part number of the part',
      },
      {
        displayName: 'By Part Number',
        name: 'byNumber',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['part'], operation: ['get'] },
        },
        description: 'Whether to look up by part number instead of ID',
      },

      // Part Create Parameters
      {
        displayName: 'Part Number',
        name: 'partNumber',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['part'], operation: ['create'] },
        },
        description: 'The part number/SKU',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['part'], operation: ['create'] },
        },
        description: 'Part description',
      },
      {
        displayName: 'Part Type',
        name: 'partType',
        type: 'options',
        options: [
          { name: 'Inventory', value: 'Inventory' },
          { name: 'Non-Inventory', value: 'NonInventory' },
          { name: 'Service', value: 'Service' },
        ],
        default: 'Inventory',
        required: true,
        displayOptions: {
          show: { resource: ['part'], operation: ['create'] },
        },
        description: 'The type of part',
      },

      // Part Additional Fields
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['part'], operation: ['create'] },
        },
        options: [
          { displayName: 'ABC Code', name: 'abcCode', type: 'options', options: [{ name: 'A', value: 'A' }, { name: 'B', value: 'B' }, { name: 'C', value: 'C' }], default: 'B' },
          { displayName: 'Active', name: 'active', type: 'boolean', default: true },
          { displayName: 'Alert Note', name: 'alertNote', type: 'string', default: '' },
          { displayName: 'Cost', name: 'cost', type: 'number', default: 0 },
          { displayName: 'Default Location ID', name: 'defaultLocationId', type: 'number', default: 0 },
          { displayName: 'Default Vendor ID', name: 'defaultVendorId', type: 'number', default: 0 },
          { displayName: 'Details', name: 'details', type: 'string', default: '' },
          { displayName: 'Height', name: 'height', type: 'number', default: 0 },
          { displayName: 'Length', name: 'len', type: 'number', default: 0 },
          { displayName: 'Tracking Flag', name: 'trackingFlag', type: 'boolean', default: false, description: 'Enable lot/serial tracking' },
          { displayName: 'UOM ID', name: 'uomId', type: 'number', default: 0 },
          { displayName: 'Weight', name: 'weight', type: 'number', default: 0 },
          { displayName: 'Width', name: 'width', type: 'number', default: 0 },
        ],
      },

      // Part Update Fields
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['part'], operation: ['update'] },
        },
        options: [
          { displayName: 'ABC Code', name: 'abcCode', type: 'options', options: [{ name: 'A', value: 'A' }, { name: 'B', value: 'B' }, { name: 'C', value: 'C' }], default: 'B' },
          { displayName: 'Active', name: 'active', type: 'boolean', default: true },
          { displayName: 'Alert Note', name: 'alertNote', type: 'string', default: '' },
          { displayName: 'Cost', name: 'cost', type: 'number', default: 0 },
          { displayName: 'Default Location ID', name: 'defaultLocationId', type: 'number', default: 0 },
          { displayName: 'Default Vendor ID', name: 'defaultVendorId', type: 'number', default: 0 },
          { displayName: 'Description', name: 'description', type: 'string', default: '' },
          { displayName: 'Details', name: 'details', type: 'string', default: '' },
          { displayName: 'Part Number', name: 'partNumber', type: 'string', default: '' },
          { displayName: 'Part Type', name: 'partType', type: 'options', options: [{ name: 'Inventory', value: 'Inventory' }, { name: 'Non-Inventory', value: 'NonInventory' }, { name: 'Service', value: 'Service' }], default: 'Inventory' },
          { displayName: 'Tracking Flag', name: 'trackingFlag', type: 'boolean', default: false },
          { displayName: 'UOM ID', name: 'uomId', type: 'number', default: 0 },
          { displayName: 'Weight', name: 'weight', type: 'number', default: 0 },
        ],
      },

      // Part GetAll Parameters
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['part'], operation: ['getAll'] },
        },
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: {
          show: { resource: ['part'], operation: ['getAll'], returnAll: [false] },
        },
        description: 'Max number of results to return',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: { resource: ['part'], operation: ['getAll'] },
        },
        options: [
          { displayName: 'Active', name: 'active', type: 'boolean', default: true },
          { displayName: 'Description', name: 'description', type: 'string', default: '' },
          { displayName: 'Location Group ID', name: 'locationGroupId', type: 'number', default: 0 },
          { displayName: 'Part Number', name: 'number', type: 'string', default: '' },
        ],
      },

      // Part Inventory Parameters
      {
        displayName: 'Location Group ID',
        name: 'locationGroupId',
        type: 'string',
        default: '',
        displayOptions: {
          show: { resource: ['part'], operation: ['getInventory'] },
        },
        description: 'Optional location group to filter by',
      },
      {
        displayName: 'Location ID',
        name: 'locationId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['part'], operation: ['addInventory', 'cycleInventory', 'scrapInventory'] },
        },
        description: 'The location ID',
      },
      {
        displayName: 'Quantity',
        name: 'qty',
        type: 'number',
        default: 1,
        required: true,
        displayOptions: {
          show: { resource: ['part'], operation: ['addInventory', 'cycleInventory', 'moveInventory', 'scrapInventory'] },
        },
        description: 'Quantity',
      },
      {
        displayName: 'From Location ID',
        name: 'fromLocationId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['part'], operation: ['moveInventory'] },
        },
        description: 'Source location ID',
      },
      {
        displayName: 'To Location ID',
        name: 'toLocationId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['part'], operation: ['moveInventory'] },
        },
        description: 'Destination location ID',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['part'], operation: ['addInventory', 'cycleInventory', 'moveInventory', 'scrapInventory'] },
        },
        options: [
          { displayName: 'Cost', name: 'cost', type: 'number', default: 0 },
          { displayName: 'Note', name: 'note', type: 'string', default: '' },
          { displayName: 'Reason', name: 'reason', type: 'string', default: '', description: 'Reason for scrap' },
          { displayName: 'Tracking Number', name: 'trackingNumber', type: 'string', default: '' },
        ],
      },

      // =====================
      // SALES ORDER OPERATIONS
      // =====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['salesOrder'] },
        },
        options: [
          { name: 'Add Item', value: 'addItem', description: 'Add a line item to sales order', action: 'Add item to sales order' },
          { name: 'Create', value: 'create', description: 'Create a new sales order', action: 'Create a sales order' },
          { name: 'Delete', value: 'delete', description: 'Delete a sales order', action: 'Delete a sales order' },
          { name: 'Get', value: 'get', description: 'Get a sales order', action: 'Get a sales order' },
          { name: 'Get Many', value: 'getAll', description: 'Get many sales orders', action: 'Get many sales orders' },
          { name: 'Issue', value: 'issue', description: 'Issue a sales order', action: 'Issue a sales order' },
          { name: 'Quick Ship', value: 'quickShip', description: 'Quick ship with auto-pick', action: 'Quick ship a sales order' },
          { name: 'Remove Item', value: 'removeItem', description: 'Remove a line item', action: 'Remove item from sales order' },
          { name: 'Ship', value: 'ship', description: 'Ship a sales order', action: 'Ship a sales order' },
          { name: 'Update', value: 'update', description: 'Update a sales order', action: 'Update a sales order' },
          { name: 'Void', value: 'void', description: 'Void a sales order', action: 'Void a sales order' },
        ],
        default: 'get',
      },

      // Sales Order Parameters
      {
        displayName: 'SO ID or Number',
        name: 'soId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['salesOrder'], operation: ['get', 'update', 'delete', 'issue', 'ship', 'void', 'addItem', 'removeItem', 'quickShip'] },
        },
        description: 'The ID or number of the sales order',
      },
      {
        displayName: 'By Number',
        name: 'byNumber',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['salesOrder'], operation: ['get'] },
        },
        description: 'Whether to look up by SO number instead of ID',
      },
      {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['salesOrder'], operation: ['create'] },
        },
        description: 'The customer ID',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['salesOrder'], operation: ['create'] },
        },
        options: [
          { displayName: 'Carrier ID', name: 'carrierId', type: 'number', default: 0 },
          { displayName: 'Customer Contact', name: 'customerContact', type: 'string', default: '' },
          { displayName: 'Date Expired', name: 'dateExpired', type: 'dateTime', default: '' },
          { displayName: 'Date Scheduled', name: 'dateScheduled', type: 'dateTime', default: '' },
          { displayName: 'Note', name: 'note', type: 'string', default: '' },
          { displayName: 'Priority ID', name: 'priorityId', type: 'number', default: 0 },
          { displayName: 'Salesman ID', name: 'salesmanId', type: 'number', default: 0 },
          { displayName: 'SO Number', name: 'soNum', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['salesOrder'], operation: ['update'] },
        },
        options: [
          { displayName: 'Carrier ID', name: 'carrierId', type: 'number', default: 0 },
          { displayName: 'Customer Contact', name: 'customerContact', type: 'string', default: '' },
          { displayName: 'Date Expired', name: 'dateExpired', type: 'dateTime', default: '' },
          { displayName: 'Date Scheduled', name: 'dateScheduled', type: 'dateTime', default: '' },
          { displayName: 'Note', name: 'note', type: 'string', default: '' },
          { displayName: 'Priority ID', name: 'priorityId', type: 'number', default: 0 },
          { displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Estimate', value: 'Estimate' }, { name: 'Issued', value: 'Issued' }, { name: 'In Progress', value: 'InProgress' }, { name: 'Fulfilled', value: 'Fulfilled' }, { name: 'Closed', value: 'Closed' }], default: 'Estimate' },
        ],
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['salesOrder'], operation: ['getAll'] },
        },
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: {
          show: { resource: ['salesOrder'], operation: ['getAll'], returnAll: [false] },
        },
        description: 'Max number of results to return',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: { resource: ['salesOrder'], operation: ['getAll'] },
        },
        options: [
          { displayName: 'Customer ID', name: 'customerId', type: 'number', default: 0 },
          { displayName: 'Date From', name: 'dateFrom', type: 'dateTime', default: '' },
          { displayName: 'Date To', name: 'dateTo', type: 'dateTime', default: '' },
          { displayName: 'SO Number', name: 'number', type: 'string', default: '' },
          { displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'All', value: '' }, { name: 'Estimate', value: 'Estimate' }, { name: 'Issued', value: 'Issued' }, { name: 'In Progress', value: 'InProgress' }, { name: 'Fulfilled', value: 'Fulfilled' }, { name: 'Closed', value: 'Closed' }, { name: 'Void', value: 'Void' }], default: '' },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['salesOrder'], operation: ['ship', 'quickShip'] },
        },
        options: [
          { displayName: 'Carrier ID', name: 'carrierId', type: 'number', default: 0 },
          { displayName: 'Note', name: 'note', type: 'string', default: '' },
          { displayName: 'Ship Date', name: 'shipDate', type: 'dateTime', default: '' },
          { displayName: 'Tracking Number', name: 'trackingNumber', type: 'string', default: '' },
        ],
      },

      // Sales Order Line Item Parameters
      {
        displayName: 'Part ID',
        name: 'partId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['salesOrder'], operation: ['addItem'] },
        },
        description: 'The part ID to add',
      },
      {
        displayName: 'Quantity',
        name: 'qty',
        type: 'number',
        default: 1,
        required: true,
        displayOptions: {
          show: { resource: ['salesOrder'], operation: ['addItem'] },
        },
        description: 'Quantity to add',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['salesOrder'], operation: ['addItem'] },
        },
        options: [
          { displayName: 'Description', name: 'description', type: 'string', default: '' },
          { displayName: 'Discount', name: 'discount', type: 'number', default: 0 },
          { displayName: 'Tax Rate', name: 'taxRate', type: 'number', default: 0 },
          { displayName: 'Taxable', name: 'taxable', type: 'boolean', default: true },
          { displayName: 'Unit Price', name: 'unitPrice', type: 'number', default: 0 },
          { displayName: 'UOM ID', name: 'uomId', type: 'number', default: 0 },
        ],
      },
      {
        displayName: 'Item ID',
        name: 'itemId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['salesOrder'], operation: ['removeItem'] },
        },
        description: 'The line item ID to remove',
      },

      // =====================
      // PURCHASE ORDER OPERATIONS
      // =====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['purchaseOrder'] },
        },
        options: [
          { name: 'Add Item', value: 'addItem', description: 'Add a line item to PO', action: 'Add item to purchase order' },
          { name: 'Close', value: 'close', description: 'Close a PO', action: 'Close a purchase order' },
          { name: 'Create', value: 'create', description: 'Create a new PO', action: 'Create a purchase order' },
          { name: 'Delete', value: 'delete', description: 'Delete a PO', action: 'Delete a purchase order' },
          { name: 'Get', value: 'get', description: 'Get a PO', action: 'Get a purchase order' },
          { name: 'Get Many', value: 'getAll', description: 'Get many POs', action: 'Get many purchase orders' },
          { name: 'Issue', value: 'issue', description: 'Issue a PO', action: 'Issue a purchase order' },
          { name: 'Quick Receive', value: 'quickReceive', description: 'Quick receive all items', action: 'Quick receive purchase order' },
          { name: 'Receive', value: 'receive', description: 'Receive items', action: 'Receive purchase order items' },
          { name: 'Update', value: 'update', description: 'Update a PO', action: 'Update a purchase order' },
          { name: 'Void', value: 'void', description: 'Void a PO', action: 'Void a purchase order' },
        ],
        default: 'get',
      },

      // Purchase Order Parameters
      {
        displayName: 'PO ID or Number',
        name: 'poId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['purchaseOrder'], operation: ['get', 'update', 'delete', 'issue', 'receive', 'close', 'void', 'addItem', 'quickReceive'] },
        },
        description: 'The ID or number of the purchase order',
      },
      {
        displayName: 'By Number',
        name: 'byNumber',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['purchaseOrder'], operation: ['get'] },
        },
        description: 'Whether to look up by PO number instead of ID',
      },
      {
        displayName: 'Vendor ID',
        name: 'vendorId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['purchaseOrder'], operation: ['create'] },
        },
        description: 'The vendor ID',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['purchaseOrder'], operation: ['create'] },
        },
        options: [
          { displayName: 'Buyer ID', name: 'buyerId', type: 'number', default: 0 },
          { displayName: 'Carrier ID', name: 'carrierId', type: 'number', default: 0 },
          { displayName: 'Date Confirmed', name: 'dateConfirmed', type: 'dateTime', default: '' },
          { displayName: 'Date Scheduled', name: 'dateScheduled', type: 'dateTime', default: '' },
          { displayName: 'Note', name: 'note', type: 'string', default: '' },
          { displayName: 'PO Number', name: 'poNum', type: 'string', default: '' },
          { displayName: 'Vendor Contact', name: 'vendorContact', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['purchaseOrder'], operation: ['update'] },
        },
        options: [
          { displayName: 'Buyer ID', name: 'buyerId', type: 'number', default: 0 },
          { displayName: 'Carrier ID', name: 'carrierId', type: 'number', default: 0 },
          { displayName: 'Date Confirmed', name: 'dateConfirmed', type: 'dateTime', default: '' },
          { displayName: 'Date Scheduled', name: 'dateScheduled', type: 'dateTime', default: '' },
          { displayName: 'Note', name: 'note', type: 'string', default: '' },
          { displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Pending', value: 'Pending' }, { name: 'Bid Request', value: 'BidRequest' }, { name: 'Issued', value: 'Issued' }, { name: 'Partially Received', value: 'PartiallyReceived' }, { name: 'Received', value: 'Received' }, { name: 'Closed', value: 'Closed' }], default: 'Pending' },
        ],
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['purchaseOrder'], operation: ['getAll'] },
        },
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: {
          show: { resource: ['purchaseOrder'], operation: ['getAll'], returnAll: [false] },
        },
        description: 'Max number of results to return',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: { resource: ['purchaseOrder'], operation: ['getAll'] },
        },
        options: [
          { displayName: 'Date From', name: 'dateFrom', type: 'dateTime', default: '' },
          { displayName: 'Date To', name: 'dateTo', type: 'dateTime', default: '' },
          { displayName: 'PO Number', name: 'number', type: 'string', default: '' },
          { displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'All', value: '' }, { name: 'Pending', value: 'Pending' }, { name: 'Issued', value: 'Issued' }, { name: 'Partially Received', value: 'PartiallyReceived' }, { name: 'Received', value: 'Received' }, { name: 'Closed', value: 'Closed' }, { name: 'Void', value: 'Void' }], default: '' },
          { displayName: 'Vendor ID', name: 'vendorId', type: 'number', default: 0 },
        ],
      },

      // PO Receive Parameters
      {
        displayName: 'Items',
        name: 'items',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        default: {},
        displayOptions: {
          show: { resource: ['purchaseOrder'], operation: ['receive'] },
        },
        options: [
          {
            name: 'item',
            displayName: 'Item',
            values: [
              { displayName: 'Item ID', name: 'itemId', type: 'number', default: 0, required: true },
              { displayName: 'Quantity', name: 'qty', type: 'number', default: 1, required: true },
              { displayName: 'Location ID', name: 'locationId', type: 'number', default: 0, required: true },
            ],
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['purchaseOrder'], operation: ['receive'] },
        },
        options: [
          { displayName: 'Note', name: 'note', type: 'string', default: '' },
          { displayName: 'Receive Date', name: 'receiveDate', type: 'dateTime', default: '' },
        ],
      },
      {
        displayName: 'Location ID',
        name: 'locationId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['purchaseOrder'], operation: ['quickReceive'] },
        },
        description: 'The location to receive items into',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['purchaseOrder'], operation: ['quickReceive'] },
        },
        options: [
          { displayName: 'Note', name: 'note', type: 'string', default: '' },
          { displayName: 'Receive Date', name: 'receiveDate', type: 'dateTime', default: '' },
        ],
      },

      // PO Line Item Parameters
      {
        displayName: 'Part ID',
        name: 'partId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['purchaseOrder'], operation: ['addItem'] },
        },
        description: 'The part ID to add',
      },
      {
        displayName: 'Quantity',
        name: 'qty',
        type: 'number',
        default: 1,
        required: true,
        displayOptions: {
          show: { resource: ['purchaseOrder'], operation: ['addItem'] },
        },
        description: 'Quantity to order',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['purchaseOrder'], operation: ['addItem'] },
        },
        options: [
          { displayName: 'Description', name: 'description', type: 'string', default: '' },
          { displayName: 'Unit Price', name: 'unitPrice', type: 'number', default: 0 },
          { displayName: 'UOM ID', name: 'uomId', type: 'number', default: 0 },
        ],
      },

      // =====================
      // CUSTOMER OPERATIONS
      // =====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['customer'] },
        },
        options: [
          { name: 'Add Address', value: 'addAddress', description: 'Add an address to customer', action: 'Add address to customer' },
          { name: 'Add Contact', value: 'addContact', description: 'Add a contact to customer', action: 'Add contact to customer' },
          { name: 'Create', value: 'create', description: 'Create a new customer', action: 'Create a customer' },
          { name: 'Delete', value: 'delete', description: 'Delete a customer', action: 'Delete a customer' },
          { name: 'Get', value: 'get', description: 'Get a customer by ID or name', action: 'Get a customer' },
          { name: 'Get Addresses', value: 'getAddresses', description: 'Get customer addresses', action: 'Get customer addresses' },
          { name: 'Get Contacts', value: 'getContacts', description: 'Get customer contacts', action: 'Get customer contacts' },
          { name: 'Get Many', value: 'getAll', description: 'Get many customers', action: 'Get many customers' },
          { name: 'Get Orders', value: 'getOrders', description: 'Get customer sales orders', action: 'Get customer orders' },
          { name: 'Update', value: 'update', description: 'Update a customer', action: 'Update a customer' },
        ],
        default: 'get',
      },
      {
        displayName: 'Customer ID or Name',
        name: 'customerId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['customer'], operation: ['get', 'update', 'delete', 'getAddresses', 'addAddress', 'getContacts', 'addContact', 'getOrders'] },
        },
        description: 'The ID or name of the customer',
      },
      {
        displayName: 'By Name',
        name: 'byName',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['customer'], operation: ['get'] },
        },
        description: 'Whether to look up by customer name instead of ID',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['customer'], operation: ['create'] },
        },
        description: 'Customer name',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['customer'], operation: ['create'] },
        },
        options: [
          { displayName: 'Active', name: 'activeFlag', type: 'boolean', default: true },
          { displayName: 'Credit Limit', name: 'creditLimit', type: 'number', default: 0 },
          { displayName: 'Customer Number', name: 'number', type: 'string', default: '' },
          { displayName: 'Default Carrier ID', name: 'defaultCarrierId', type: 'number', default: 0 },
          { displayName: 'Default Salesman ID', name: 'defaultSalesmanId', type: 'number', default: 0 },
          { displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Normal', value: 'Normal' }, { name: 'Hold', value: 'Hold' }], default: 'Normal' },
          { displayName: 'Tax Exempt', name: 'taxExempt', type: 'boolean', default: false },
          { displayName: 'Tax Exempt Number', name: 'taxExemptNumber', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['customer'], operation: ['update'] },
        },
        options: [
          { displayName: 'Active', name: 'activeFlag', type: 'boolean', default: true },
          { displayName: 'Credit Limit', name: 'creditLimit', type: 'number', default: 0 },
          { displayName: 'Default Carrier ID', name: 'defaultCarrierId', type: 'number', default: 0 },
          { displayName: 'Default Salesman ID', name: 'defaultSalesmanId', type: 'number', default: 0 },
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
          { displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Normal', value: 'Normal' }, { name: 'Hold', value: 'Hold' }], default: 'Normal' },
          { displayName: 'Tax Exempt', name: 'taxExempt', type: 'boolean', default: false },
          { displayName: 'Tax Exempt Number', name: 'taxExemptNumber', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['customer'], operation: ['getAll'] },
        },
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: {
          show: { resource: ['customer'], operation: ['getAll'], returnAll: [false] },
        },
        description: 'Max number of results to return',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: { resource: ['customer'], operation: ['getAll'] },
        },
        options: [
          { displayName: 'Active Only', name: 'activeOnly', type: 'boolean', default: true },
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
        ],
      },
      // Customer Address
      {
        displayName: 'Address Name',
        name: 'addressName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['customer'], operation: ['addAddress'] },
        },
        description: 'Name for the address (e.g., Main, Warehouse)',
      },
      {
        displayName: 'Address Fields',
        name: 'addressFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['customer'], operation: ['addAddress'] },
        },
        options: [
          { displayName: 'Address', name: 'address', type: 'string', default: '' },
          { displayName: 'City', name: 'city', type: 'string', default: '' },
          { displayName: 'Country', name: 'country', type: 'string', default: '' },
          { displayName: 'Default', name: 'default', type: 'boolean', default: false },
          { displayName: 'State', name: 'state', type: 'string', default: '' },
          { displayName: 'Type', name: 'type', type: 'options', options: [{ name: 'Main', value: 'Main' }, { name: 'Bill To', value: 'BillTo' }, { name: 'Ship To', value: 'ShipTo' }], default: 'Main' },
          { displayName: 'Zip', name: 'zip', type: 'string', default: '' },
        ],
      },
      // Customer Contact
      {
        displayName: 'Contact Name',
        name: 'contactName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['customer'], operation: ['addContact'] },
        },
        description: 'Name of the contact',
      },
      {
        displayName: 'Contact Fields',
        name: 'contactFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['customer'], operation: ['addContact'] },
        },
        options: [
          { displayName: 'Default', name: 'default', type: 'boolean', default: false },
          { displayName: 'Email', name: 'email', type: 'string', default: '' },
          { displayName: 'Phone', name: 'phone', type: 'string', default: '' },
          { displayName: 'Title', name: 'title', type: 'string', default: '' },
        ],
      },

      // =====================
      // VENDOR OPERATIONS
      // =====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['vendor'] },
        },
        options: [
          { name: 'Add Address', value: 'addAddress', description: 'Add an address to vendor', action: 'Add address to vendor' },
          { name: 'Add Contact', value: 'addContact', description: 'Add a contact to vendor', action: 'Add contact to vendor' },
          { name: 'Create', value: 'create', description: 'Create a new vendor', action: 'Create a vendor' },
          { name: 'Delete', value: 'delete', description: 'Delete a vendor', action: 'Delete a vendor' },
          { name: 'Get', value: 'get', description: 'Get a vendor by ID or name', action: 'Get a vendor' },
          { name: 'Get Addresses', value: 'getAddresses', description: 'Get vendor addresses', action: 'Get vendor addresses' },
          { name: 'Get Contacts', value: 'getContacts', description: 'Get vendor contacts', action: 'Get vendor contacts' },
          { name: 'Get Many', value: 'getAll', description: 'Get many vendors', action: 'Get many vendors' },
          { name: 'Get Purchase Orders', value: 'getPurchaseOrders', description: 'Get vendor POs', action: 'Get vendor purchase orders' },
          { name: 'Update', value: 'update', description: 'Update a vendor', action: 'Update a vendor' },
        ],
        default: 'get',
      },
      {
        displayName: 'Vendor ID or Name',
        name: 'vendorId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['vendor'], operation: ['get', 'update', 'delete', 'getAddresses', 'addAddress', 'getContacts', 'addContact', 'getPurchaseOrders'] },
        },
        description: 'The ID or name of the vendor',
      },
      {
        displayName: 'By Name',
        name: 'byName',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['vendor'], operation: ['get'] },
        },
        description: 'Whether to look up by vendor name instead of ID',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['vendor'], operation: ['create'] },
        },
        description: 'Vendor name',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['vendor'], operation: ['create'] },
        },
        options: [
          { displayName: 'Active', name: 'activeFlag', type: 'boolean', default: true },
          { displayName: 'Default Carrier ID', name: 'defaultCarrierId', type: 'number', default: 0 },
          { displayName: 'Lead Time (Days)', name: 'leadTime', type: 'number', default: 0 },
          { displayName: 'Minimum Order Amount', name: 'minimumOrderAmount', type: 'number', default: 0 },
          { displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Normal', value: 'Normal' }, { name: 'Hold', value: 'Hold' }], default: 'Normal' },
          { displayName: 'Vendor Number', name: 'number', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['vendor'], operation: ['update'] },
        },
        options: [
          { displayName: 'Active', name: 'activeFlag', type: 'boolean', default: true },
          { displayName: 'Default Carrier ID', name: 'defaultCarrierId', type: 'number', default: 0 },
          { displayName: 'Lead Time (Days)', name: 'leadTime', type: 'number', default: 0 },
          { displayName: 'Minimum Order Amount', name: 'minimumOrderAmount', type: 'number', default: 0 },
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
          { displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Normal', value: 'Normal' }, { name: 'Hold', value: 'Hold' }], default: 'Normal' },
        ],
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['vendor'], operation: ['getAll'] },
        },
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: {
          show: { resource: ['vendor'], operation: ['getAll'], returnAll: [false] },
        },
        description: 'Max number of results to return',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: { resource: ['vendor'], operation: ['getAll'] },
        },
        options: [
          { displayName: 'Active Only', name: 'activeOnly', type: 'boolean', default: true },
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
        ],
      },
      // Vendor Address
      {
        displayName: 'Address Name',
        name: 'addressName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['vendor'], operation: ['addAddress'] },
        },
        description: 'Name for the address',
      },
      {
        displayName: 'Address Fields',
        name: 'addressFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['vendor'], operation: ['addAddress'] },
        },
        options: [
          { displayName: 'Address', name: 'address', type: 'string', default: '' },
          { displayName: 'City', name: 'city', type: 'string', default: '' },
          { displayName: 'Country', name: 'country', type: 'string', default: '' },
          { displayName: 'Default', name: 'default', type: 'boolean', default: false },
          { displayName: 'State', name: 'state', type: 'string', default: '' },
          { displayName: 'Zip', name: 'zip', type: 'string', default: '' },
        ],
      },
      // Vendor Contact
      {
        displayName: 'Contact Name',
        name: 'contactName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['vendor'], operation: ['addContact'] },
        },
        description: 'Name of the contact',
      },
      {
        displayName: 'Contact Fields',
        name: 'contactFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['vendor'], operation: ['addContact'] },
        },
        options: [
          { displayName: 'Default', name: 'default', type: 'boolean', default: false },
          { displayName: 'Email', name: 'email', type: 'string', default: '' },
          { displayName: 'Phone', name: 'phone', type: 'string', default: '' },
          { displayName: 'Title', name: 'title', type: 'string', default: '' },
        ],
      },

      // =====================
      // MANUFACTURE ORDER OPERATIONS
      // =====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['manufactureOrder'] },
        },
        options: [
          { name: 'Add Item', value: 'addItem', description: 'Add component to MO', action: 'Add item to manufacture order' },
          { name: 'Build', value: 'build', description: 'Build/complete MO', action: 'Build manufacture order' },
          { name: 'Close', value: 'close', description: 'Close MO', action: 'Close manufacture order' },
          { name: 'Create', value: 'create', description: 'Create a new MO', action: 'Create a manufacture order' },
          { name: 'Delete', value: 'delete', description: 'Delete a MO', action: 'Delete a manufacture order' },
          { name: 'Get', value: 'get', description: 'Get MO by ID or number', action: 'Get a manufacture order' },
          { name: 'Get Many', value: 'getAll', description: 'Get many MOs', action: 'Get many manufacture orders' },
          { name: 'Issue', value: 'issue', description: 'Issue MO for production', action: 'Issue manufacture order' },
          { name: 'Remove Item', value: 'removeItem', description: 'Remove component from MO', action: 'Remove item from manufacture order' },
          { name: 'Update', value: 'update', description: 'Update a MO', action: 'Update a manufacture order' },
          { name: 'Void', value: 'void', description: 'Void a MO', action: 'Void a manufacture order' },
        ],
        default: 'get',
      },
      {
        displayName: 'MO ID or Number',
        name: 'moId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['manufactureOrder'], operation: ['get', 'update', 'delete', 'issue', 'build', 'close', 'void', 'addItem', 'removeItem'] },
        },
        description: 'The ID or number of the manufacture order',
      },
      {
        displayName: 'By Number',
        name: 'byNumber',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['manufactureOrder'], operation: ['get'] },
        },
        description: 'Whether to look up by MO number instead of ID',
      },
      {
        displayName: 'Part ID',
        name: 'partId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['manufactureOrder'], operation: ['create'] },
        },
        description: 'The part ID to manufacture',
      },
      {
        displayName: 'Quantity',
        name: 'qty',
        type: 'number',
        default: 1,
        required: true,
        displayOptions: {
          show: { resource: ['manufactureOrder'], operation: ['create'] },
        },
        description: 'Quantity to manufacture',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['manufactureOrder'], operation: ['create'] },
        },
        options: [
          { displayName: 'BOM ID', name: 'bomId', type: 'number', default: 0 },
          { displayName: 'Date Scheduled', name: 'dateScheduled', type: 'dateTime', default: '' },
          { displayName: 'Location ID', name: 'locationId', type: 'number', default: 0 },
          { displayName: 'MO Number', name: 'moNum', type: 'string', default: '' },
          { displayName: 'Note', name: 'note', type: 'string', default: '' },
          { displayName: 'Priority', name: 'priority', type: 'number', default: 0 },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['manufactureOrder'], operation: ['update'] },
        },
        options: [
          { displayName: 'Date Scheduled', name: 'dateScheduled', type: 'dateTime', default: '' },
          { displayName: 'Location ID', name: 'locationId', type: 'number', default: 0 },
          { displayName: 'Note', name: 'note', type: 'string', default: '' },
          { displayName: 'Priority', name: 'priority', type: 'number', default: 0 },
          { displayName: 'Quantity', name: 'qty', type: 'number', default: 0 },
        ],
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['manufactureOrder'], operation: ['getAll'] },
        },
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: {
          show: { resource: ['manufactureOrder'], operation: ['getAll'], returnAll: [false] },
        },
        description: 'Max number of results to return',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: { resource: ['manufactureOrder'], operation: ['getAll'] },
        },
        options: [
          { displayName: 'Date From', name: 'dateFrom', type: 'dateTime', default: '' },
          { displayName: 'Date To', name: 'dateTo', type: 'dateTime', default: '' },
          { displayName: 'MO Number', name: 'number', type: 'string', default: '' },
          { displayName: 'Part ID', name: 'partId', type: 'number', default: 0 },
          { displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'All', value: '' }, { name: 'Pending', value: 'Pending' }, { name: 'Entered', value: 'Entered' }, { name: 'Issued', value: 'Issued' }, { name: 'In Progress', value: 'InProgress' }, { name: 'Fulfilled', value: 'Fulfilled' }, { name: 'Closed', value: 'Closed' }, { name: 'Void', value: 'Void' }], default: '' },
        ],
      },
      // MO Build Parameters
      {
        displayName: 'Quantity',
        name: 'buildQty',
        type: 'number',
        default: 1,
        required: true,
        displayOptions: {
          show: { resource: ['manufactureOrder'], operation: ['build'] },
        },
        description: 'Quantity to build',
      },
      {
        displayName: 'Location ID',
        name: 'locationId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['manufactureOrder'], operation: ['build'] },
        },
        description: 'Location to build into',
      },
      // MO Add Item Parameters
      {
        displayName: 'Part ID',
        name: 'componentPartId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['manufactureOrder'], operation: ['addItem'] },
        },
        description: 'The component part ID to add',
      },
      {
        displayName: 'Quantity',
        name: 'componentQty',
        type: 'number',
        default: 1,
        required: true,
        displayOptions: {
          show: { resource: ['manufactureOrder'], operation: ['addItem'] },
        },
        description: 'Component quantity',
      },
      {
        displayName: 'Item ID',
        name: 'itemId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['manufactureOrder'], operation: ['removeItem'] },
        },
        description: 'The item ID to remove',
      },

      // =====================
      // LOCATION OPERATIONS
      // =====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['location'] },
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a new location', action: 'Create a location' },
          { name: 'Delete', value: 'delete', description: 'Delete a location', action: 'Delete a location' },
          { name: 'Get', value: 'get', description: 'Get a location by ID or name', action: 'Get a location' },
          { name: 'Get Inventory', value: 'getInventory', description: 'Get inventory at location', action: 'Get location inventory' },
          { name: 'Get Many', value: 'getAll', description: 'Get many locations', action: 'Get many locations' },
          { name: 'Move All Inventory', value: 'moveAllInventory', description: 'Move all inventory from location', action: 'Move all inventory from location' },
          { name: 'Update', value: 'update', description: 'Update a location', action: 'Update a location' },
        ],
        default: 'get',
      },
      {
        displayName: 'Location ID or Name',
        name: 'locationId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['location'], operation: ['get', 'update', 'delete', 'getInventory', 'moveAllInventory'] },
        },
        description: 'The ID or name of the location',
      },
      {
        displayName: 'By Name',
        name: 'byName',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['location'], operation: ['get'] },
        },
        description: 'Whether to look up by location name instead of ID',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['location'], operation: ['create'] },
        },
        description: 'Location name',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['location'], operation: ['create'] },
        },
        options: [
          { displayName: 'Active', name: 'active', type: 'boolean', default: true },
          { displayName: 'Countable', name: 'countable', type: 'boolean', default: true },
          { displayName: 'Description', name: 'description', type: 'string', default: '' },
          { displayName: 'Location Group ID', name: 'locationGroupId', type: 'number', default: 0 },
          { displayName: 'Parent ID', name: 'parentId', type: 'number', default: 0 },
          { displayName: 'Pickable', name: 'pickable', type: 'boolean', default: true },
          { displayName: 'Receivable', name: 'receivable', type: 'boolean', default: true },
          { displayName: 'Sort Order', name: 'sortOrder', type: 'number', default: 0 },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['location'], operation: ['update'] },
        },
        options: [
          { displayName: 'Active', name: 'active', type: 'boolean', default: true },
          { displayName: 'Countable', name: 'countable', type: 'boolean', default: true },
          { displayName: 'Description', name: 'description', type: 'string', default: '' },
          { displayName: 'Location Group ID', name: 'locationGroupId', type: 'number', default: 0 },
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
          { displayName: 'Parent ID', name: 'parentId', type: 'number', default: 0 },
          { displayName: 'Pickable', name: 'pickable', type: 'boolean', default: true },
          { displayName: 'Receivable', name: 'receivable', type: 'boolean', default: true },
          { displayName: 'Sort Order', name: 'sortOrder', type: 'number', default: 0 },
        ],
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['location'], operation: ['getAll'] },
        },
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: {
          show: { resource: ['location'], operation: ['getAll'], returnAll: [false] },
        },
        description: 'Max number of results to return',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: { resource: ['location'], operation: ['getAll'] },
        },
        options: [
          { displayName: 'Active Only', name: 'activeOnly', type: 'boolean', default: true },
          { displayName: 'Location Group ID', name: 'locationGroupId', type: 'number', default: 0 },
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'To Location ID',
        name: 'toLocationId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['location'], operation: ['moveAllInventory'] },
        },
        description: 'Destination location ID',
      },

      // =====================
      // LOCATION GROUP OPERATIONS
      // =====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['locationGroup'] },
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a new location group', action: 'Create a location group' },
          { name: 'Delete', value: 'delete', description: 'Delete a location group', action: 'Delete a location group' },
          { name: 'Get', value: 'get', description: 'Get a location group by ID', action: 'Get a location group' },
          { name: 'Get Locations', value: 'getLocations', description: 'Get locations in group', action: 'Get locations in group' },
          { name: 'Get Many', value: 'getAll', description: 'Get many location groups', action: 'Get many location groups' },
          { name: 'Update', value: 'update', description: 'Update a location group', action: 'Update a location group' },
        ],
        default: 'get',
      },
      {
        displayName: 'Location Group ID',
        name: 'locationGroupId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['locationGroup'], operation: ['get', 'update', 'delete', 'getLocations'] },
        },
        description: 'The ID of the location group',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['locationGroup'], operation: ['create'] },
        },
        description: 'Location group name',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['locationGroup'], operation: ['create'] },
        },
        options: [
          { displayName: 'Active', name: 'active', type: 'boolean', default: true },
          { displayName: 'Description', name: 'description', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['locationGroup'], operation: ['update'] },
        },
        options: [
          { displayName: 'Active', name: 'active', type: 'boolean', default: true },
          { displayName: 'Description', name: 'description', type: 'string', default: '' },
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['locationGroup'], operation: ['getAll'] },
        },
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: {
          show: { resource: ['locationGroup'], operation: ['getAll'], returnAll: [false] },
        },
        description: 'Max number of results to return',
      },

      // =====================
      // UOM OPERATIONS
      // =====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['uom'] },
        },
        options: [
          { name: 'Add Conversion', value: 'addConversion', description: 'Add UOM conversion', action: 'Add UOM conversion' },
          { name: 'Create', value: 'create', description: 'Create a new UOM', action: 'Create a UOM' },
          { name: 'Delete', value: 'delete', description: 'Delete a UOM', action: 'Delete a UOM' },
          { name: 'Get', value: 'get', description: 'Get a UOM by ID', action: 'Get a UOM' },
          { name: 'Get Conversions', value: 'getConversions', description: 'Get UOM conversions', action: 'Get UOM conversions' },
          { name: 'Get Many', value: 'getAll', description: 'Get many UOMs', action: 'Get many UOMs' },
          { name: 'Update', value: 'update', description: 'Update a UOM', action: 'Update a UOM' },
        ],
        default: 'get',
      },
      {
        displayName: 'UOM ID',
        name: 'uomId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['uom'], operation: ['get', 'update', 'delete', 'getConversions', 'addConversion'] },
        },
        description: 'The ID of the UOM',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['uom'], operation: ['create'] },
        },
        description: 'UOM name',
      },
      {
        displayName: 'Abbreviation',
        name: 'abbreviation',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['uom'], operation: ['create'] },
        },
        description: 'UOM abbreviation (e.g., ea, lb, kg)',
      },
      {
        displayName: 'Type',
        name: 'uomType',
        type: 'options',
        options: [
          { name: 'Count', value: 'Count' },
          { name: 'Length', value: 'Length' },
          { name: 'Area', value: 'Area' },
          { name: 'Weight', value: 'Weight' },
          { name: 'Volume', value: 'Volume' },
          { name: 'Time', value: 'Time' },
        ],
        default: 'Count',
        required: true,
        displayOptions: {
          show: { resource: ['uom'], operation: ['create'] },
        },
        description: 'Type of UOM',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['uom'], operation: ['create'] },
        },
        options: [
          { displayName: 'Active', name: 'active', type: 'boolean', default: true },
          { displayName: 'Integral', name: 'integral', type: 'boolean', default: false, description: 'Whether only whole numbers are allowed' },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['uom'], operation: ['update'] },
        },
        options: [
          { displayName: 'Abbreviation', name: 'abbreviation', type: 'string', default: '' },
          { displayName: 'Active', name: 'active', type: 'boolean', default: true },
          { displayName: 'Integral', name: 'integral', type: 'boolean', default: false },
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['uom'], operation: ['getAll'] },
        },
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: {
          show: { resource: ['uom'], operation: ['getAll'], returnAll: [false] },
        },
        description: 'Max number of results to return',
      },
      // UOM Conversion Parameters
      {
        displayName: 'To UOM ID',
        name: 'toUomId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['uom'], operation: ['addConversion'] },
        },
        description: 'Target UOM ID',
      },
      {
        displayName: 'Factor',
        name: 'factor',
        type: 'number',
        default: 1,
        required: true,
        displayOptions: {
          show: { resource: ['uom'], operation: ['addConversion'] },
        },
        description: 'Conversion factor',
      },

      // =====================
      // USER OPERATIONS
      // =====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['user'] },
        },
        options: [
          { name: 'Create', value: 'create', description: 'Create a new user', action: 'Create a user' },
          { name: 'Delete', value: 'delete', description: 'Delete a user', action: 'Delete a user' },
          { name: 'Get', value: 'get', description: 'Get a user by ID', action: 'Get a user' },
          { name: 'Get Many', value: 'getAll', description: 'Get many users', action: 'Get many users' },
          { name: 'Get Permissions', value: 'getPermissions', description: 'Get user permissions', action: 'Get user permissions' },
          { name: 'Update', value: 'update', description: 'Update a user', action: 'Update a user' },
        ],
        default: 'get',
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['user'], operation: ['get', 'update', 'delete', 'getPermissions'] },
        },
        description: 'The ID of the user',
      },
      {
        displayName: 'Username',
        name: 'userName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['user'], operation: ['create'] },
        },
        description: 'Username for the new user',
      },
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['user'], operation: ['create'] },
        },
        description: "User's first name",
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['user'], operation: ['create'] },
        },
        description: "User's last name",
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['user'], operation: ['create'] },
        },
        options: [
          { displayName: 'Active', name: 'active', type: 'boolean', default: true },
          { displayName: 'Email', name: 'email', type: 'string', default: '' },
          { displayName: 'Phone', name: 'phone', type: 'string', default: '' },
          { displayName: 'User Group ID', name: 'userGroupId', type: 'number', default: 0 },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['user'], operation: ['update'] },
        },
        options: [
          { displayName: 'Active', name: 'active', type: 'boolean', default: true },
          { displayName: 'Email', name: 'email', type: 'string', default: '' },
          { displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
          { displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
          { displayName: 'Phone', name: 'phone', type: 'string', default: '' },
          { displayName: 'User Group ID', name: 'userGroupId', type: 'number', default: 0 },
        ],
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['user'], operation: ['getAll'] },
        },
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: {
          show: { resource: ['user'], operation: ['getAll'], returnAll: [false] },
        },
        description: 'Max number of results to return',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: { resource: ['user'], operation: ['getAll'] },
        },
        options: [
          { displayName: 'Active Only', name: 'activeOnly', type: 'boolean', default: true },
        ],
      },

      // =====================
      // PAYMENT OPERATIONS
      // =====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['payment'] },
        },
        options: [
          { name: 'Create', value: 'create', description: 'Record a payment', action: 'Create a payment' },
          { name: 'Delete', value: 'delete', description: 'Delete a payment', action: 'Delete a payment' },
          { name: 'Get', value: 'get', description: 'Get a payment by ID', action: 'Get a payment' },
          { name: 'Get By Order', value: 'getByOrder', description: 'Get payments for an order', action: 'Get payments by order' },
          { name: 'Get Many', value: 'getAll', description: 'Get many payments', action: 'Get many payments' },
          { name: 'Update', value: 'update', description: 'Update a payment', action: 'Update a payment' },
        ],
        default: 'get',
      },
      {
        displayName: 'Payment ID',
        name: 'paymentId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['payment'], operation: ['get', 'update', 'delete'] },
        },
        description: 'The ID of the payment',
      },
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['payment'], operation: ['create'] },
        },
        description: 'Payment amount',
      },
      {
        displayName: 'Payment Date',
        name: 'paymentDate',
        type: 'dateTime',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['payment'], operation: ['create'] },
        },
        description: 'Date of payment',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['payment'], operation: ['create'] },
        },
        options: [
          { displayName: 'Memo', name: 'memo', type: 'string', default: '' },
          { displayName: 'Payment Type ID', name: 'paymentTypeId', type: 'number', default: 0 },
          { displayName: 'Purchase Order ID', name: 'purchaseOrderId', type: 'number', default: 0 },
          { displayName: 'Reference', name: 'reference', type: 'string', default: '' },
          { displayName: 'Sales Order ID', name: 'salesOrderId', type: 'number', default: 0 },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { resource: ['payment'], operation: ['update'] },
        },
        options: [
          { displayName: 'Amount', name: 'amount', type: 'number', default: 0 },
          { displayName: 'Memo', name: 'memo', type: 'string', default: '' },
          { displayName: 'Payment Date', name: 'paymentDate', type: 'dateTime', default: '' },
          { displayName: 'Reference', name: 'reference', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { resource: ['payment'], operation: ['getAll'] },
        },
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: {
          show: { resource: ['payment'], operation: ['getAll'], returnAll: [false] },
        },
        description: 'Max number of results to return',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: { resource: ['payment'], operation: ['getAll'] },
        },
        options: [
          { displayName: 'Date From', name: 'dateFrom', type: 'dateTime', default: '' },
          { displayName: 'Date To', name: 'dateTo', type: 'dateTime', default: '' },
        ],
      },
      // Get By Order Parameters
      {
        displayName: 'Order Type',
        name: 'orderType',
        type: 'options',
        options: [
          { name: 'Sales Order', value: 'salesOrder' },
          { name: 'Purchase Order', value: 'purchaseOrder' },
        ],
        default: 'salesOrder',
        required: true,
        displayOptions: {
          show: { resource: ['payment'], operation: ['getByOrder'] },
        },
        description: 'Type of order',
      },
      {
        displayName: 'Order ID',
        name: 'orderId',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { resource: ['payment'], operation: ['getByOrder'] },
        },
        description: 'The ID of the order',
      },

      // =====================
      // IMPORT/EXPORT OPERATIONS
      // =====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['importExport'] },
        },
        options: [
          { name: 'Export Inventory', value: 'exportInventory', description: 'Export inventory report', action: 'Export inventory' },
          { name: 'Export Sales Report', value: 'exportSalesReport', description: 'Export sales data', action: 'Export sales report' },
          { name: 'Import Customers', value: 'importCustomers', description: 'Import customers', action: 'Import customers' },
          { name: 'Import Products', value: 'importProducts', description: 'Import products', action: 'Import products' },
          { name: 'Import Purchase Order', value: 'importPurchaseOrder', description: 'Import PO', action: 'Import purchase order' },
          { name: 'Import Sales Order', value: 'importSalesOrder', description: 'Import SO', action: 'Import sales order' },
          { name: 'Run Custom Query', value: 'runCustomQuery', description: 'Execute custom SQL query', action: 'Run custom query' },
        ],
        default: 'exportInventory',
      },
      // Import Data
      {
        displayName: 'Data (JSON)',
        name: 'importData',
        type: 'json',
        default: '[]',
        required: true,
        displayOptions: {
          show: { resource: ['importExport'], operation: ['importSalesOrder', 'importPurchaseOrder', 'importProducts', 'importCustomers'] },
        },
        description: 'JSON array of data to import',
      },
      {
        displayName: 'Options',
        name: 'importOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: { resource: ['importExport'], operation: ['importSalesOrder', 'importPurchaseOrder', 'importProducts', 'importCustomers'] },
        },
        options: [
          { displayName: 'Validate Only', name: 'validateOnly', type: 'boolean', default: false, description: 'Whether to validate without importing' },
        ],
      },
      // Export Options
      {
        displayName: 'Format',
        name: 'exportFormat',
        type: 'options',
        options: [
          { name: 'CSV', value: 'CSV' },
          { name: 'JSON', value: 'JSON' },
          { name: 'XML', value: 'XML' },
        ],
        default: 'JSON',
        displayOptions: {
          show: { resource: ['importExport'], operation: ['exportInventory', 'exportSalesReport'] },
        },
        description: 'Export format',
      },
      {
        displayName: 'Filters',
        name: 'exportFilters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: { resource: ['importExport'], operation: ['exportInventory'] },
        },
        options: [
          { displayName: 'Location Group ID', name: 'locationGroupId', type: 'number', default: 0 },
          { displayName: 'Location ID', name: 'locationId', type: 'number', default: 0 },
          { displayName: 'Part Type', name: 'partType', type: 'options', options: [{ name: 'All', value: '' }, { name: 'Inventory', value: 'Inventory' }, { name: 'Non-Inventory', value: 'NonInventory' }], default: '' },
        ],
      },
      {
        displayName: 'Filters',
        name: 'exportFilters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: { resource: ['importExport'], operation: ['exportSalesReport'] },
        },
        options: [
          { displayName: 'Customer ID', name: 'customerId', type: 'number', default: 0 },
          { displayName: 'Date From', name: 'dateFrom', type: 'dateTime', default: '' },
          { displayName: 'Date To', name: 'dateTo', type: 'dateTime', default: '' },
        ],
      },
      // Custom Query
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        typeOptions: { rows: 4 },
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['importExport'], operation: ['runCustomQuery'] },
        },
        description: 'SQL query to execute',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData;

        switch (resource) {
          case 'part':
            responseData = await actions.part[operation as keyof typeof actions.part].call(this, i);
            break;
          case 'salesOrder':
            responseData = await actions.salesOrder[operation as keyof typeof actions.salesOrder].call(this, i);
            break;
          case 'purchaseOrder':
            responseData = await actions.purchaseOrder[operation as keyof typeof actions.purchaseOrder].call(this, i);
            break;
          case 'customer':
            responseData = await actions.customer[operation as keyof typeof actions.customer].call(this, i);
            break;
          case 'vendor':
            responseData = await actions.vendor[operation as keyof typeof actions.vendor].call(this, i);
            break;
          case 'manufactureOrder':
            responseData = await actions.manufactureOrder[operation as keyof typeof actions.manufactureOrder].call(this, i);
            break;
          case 'location':
            responseData = await actions.location[operation as keyof typeof actions.location].call(this, i);
            break;
          case 'locationGroup':
            responseData = await actions.locationGroup[operation as keyof typeof actions.locationGroup].call(this, i);
            break;
          case 'uom':
            responseData = await actions.uom[operation as keyof typeof actions.uom].call(this, i);
            break;
          case 'user':
            responseData = await actions.user[operation as keyof typeof actions.user].call(this, i);
            break;
          case 'payment':
            responseData = await actions.payment[operation as keyof typeof actions.payment].call(this, i);
            break;
          case 'importExport':
            responseData = await actions.importExport[operation as keyof typeof actions.importExport].call(this, i);
            break;
          default:
            throw new Error(`Unknown resource: ${resource}`);
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData as any),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
