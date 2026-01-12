/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IDataObject,
  INodeType,
  INodeTypeDescription,
  IPollFunctions,
  INodeExecutionData,
} from 'n8n-workflow';

import { fishbowlApiRequestAllItems } from './transport';

export class FishbowlInventoryTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Fishbowl Inventory Trigger',
    name: 'fishbowlInventoryTrigger',
    icon: 'file:fishbowl.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Trigger workflows on Fishbowl Inventory events via polling',
    defaults: {
      name: 'Fishbowl Inventory Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'fishbowlInventoryApi',
        required: true,
      },
    ],
    polling: true,
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          { name: 'Customer Created', value: 'customerCreated' },
          { name: 'Inventory Changed', value: 'inventoryChanged' },
          { name: 'Manufacture Order Completed', value: 'manufactureOrderCompleted' },
          { name: 'Manufacture Order Created', value: 'manufactureOrderCreated' },
          { name: 'Part Created', value: 'partCreated' },
          { name: 'Part Updated', value: 'partUpdated' },
          { name: 'Purchase Order Created', value: 'purchaseOrderCreated' },
          { name: 'Purchase Order Received', value: 'purchaseOrderReceived' },
          { name: 'Sales Order Created', value: 'salesOrderCreated' },
          { name: 'Sales Order Shipped', value: 'salesOrderShipped' },
          { name: 'Sales Order Updated', value: 'salesOrderUpdated' },
          { name: 'Vendor Created', value: 'vendorCreated' },
        ],
        default: 'salesOrderCreated',
        required: true,
        description: 'The event to trigger on',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Location Group ID',
            name: 'locationGroupId',
            type: 'number',
            default: 0,
            displayOptions: {
              show: { '/event': ['inventoryChanged'] },
            },
            description: 'Filter by location group',
          },
          {
            displayName: 'Status Filter',
            name: 'statusFilter',
            type: 'options',
            options: [
              { name: 'All', value: '' },
              { name: 'Issued', value: 'Issued' },
              { name: 'Fulfilled', value: 'Fulfilled' },
              { name: 'Shipped', value: 'Shipped' },
              { name: 'Closed', value: 'Closed' },
            ],
            default: '',
            displayOptions: {
              show: { '/event': ['salesOrderCreated', 'salesOrderUpdated', 'salesOrderShipped'] },
            },
            description: 'Filter by order status',
          },
        ],
      },
    ],
  };

  async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
    const webhookData = this.getWorkflowStaticData('node');
    const event = this.getNodeParameter('event') as string;
    const options = this.getNodeParameter('options', {}) as IDataObject;
    
    const now = new Date().toISOString();
    const lastPollTime = (webhookData.lastPollTime as string) || new Date(Date.now() - 60000).toISOString();

    let endpoint = '';
    const propertyName = 'results';
    const query: IDataObject = {
      modifiedAfter: lastPollTime,
      pageSize: 100,
    };

    // Determine endpoint based on event type
    switch (event) {
      case 'salesOrderCreated':
      case 'salesOrderUpdated':
      case 'salesOrderShipped':
        endpoint = '/sales-orders';
        if (event === 'salesOrderShipped') {
          query.status = 'Shipped';
        } else if (options.statusFilter) {
          query.status = options.statusFilter;
        }
        break;

      case 'purchaseOrderCreated':
        endpoint = '/purchase-orders';
        break;

      case 'purchaseOrderReceived':
        endpoint = '/purchase-orders';
        query.status = 'Received,PartiallyReceived';
        break;

      case 'manufactureOrderCreated':
        endpoint = '/manufacture-orders';
        break;

      case 'manufactureOrderCompleted':
        endpoint = '/manufacture-orders';
        query.status = 'Fulfilled,Closed';
        break;

      case 'partCreated':
      case 'partUpdated':
        endpoint = '/parts';
        break;

      case 'customerCreated':
        endpoint = '/customers';
        break;

      case 'vendorCreated':
        endpoint = '/vendors';
        break;

      case 'inventoryChanged':
        endpoint = '/inventory';
        if (options.locationGroupId) {
          query.locationGroupId = options.locationGroupId;
        }
        break;

      default:
        throw new Error(`Unknown event type: ${event}`);
    }

    try {
      const responseData = await fishbowlApiRequestAllItems.call(
        this,
        'GET',
        endpoint,
        propertyName,
        undefined,
        query,
      );

      // Update last poll time
      webhookData.lastPollTime = now;

      if (!responseData || responseData.length === 0) {
        return null;
      }

      // Filter based on event type
      let filteredData = responseData;

      if (event === 'salesOrderCreated' || event === 'purchaseOrderCreated' || 
          event === 'manufactureOrderCreated' || event === 'partCreated' ||
          event === 'customerCreated' || event === 'vendorCreated') {
        // For "created" events, filter by creation date
        filteredData = responseData.filter((item: IDataObject) => {
          const createdDate = item.dateCreated || item.createdDate || item.dateEntered;
          if (!createdDate) return true;
          return new Date(createdDate as string) >= new Date(lastPollTime);
        });
      }

      if (filteredData.length === 0) {
        return null;
      }

      return [this.helpers.returnJsonArray(filteredData)];
    } catch (error) {
      // If we get an error, don't fail the workflow, just return null
      if (this.getMode() === 'manual') {
        throw error;
      }
      return null;
    }
  }
}
