/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject, INodeExecutionData } from 'n8n-workflow';

/**
 * Convert n8n execution data to simple objects
 */
export function simplifyOutputData(items: IDataObject[]): INodeExecutionData[] {
  return items.map((item) => ({
    json: item,
  }));
}

/**
 * Build filter query parameters from node parameters
 */
export function buildFilterQuery(filters: IDataObject): IDataObject {
  const query: IDataObject = {};

  if (filters.number) {
    query.number = filters.number;
  }

  if (filters.description) {
    query.description = filters.description;
  }

  if (filters.active !== undefined) {
    query.active = filters.active;
  }

  if (filters.locationId) {
    query.locationId = filters.locationId;
  }

  if (filters.locationGroupId) {
    query.locationGroupId = filters.locationGroupId;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.customerId) {
    query.customerId = filters.customerId;
  }

  if (filters.vendorId) {
    query.vendorId = filters.vendorId;
  }

  if (filters.partId) {
    query.partId = filters.partId;
  }

  if (filters.dateFrom) {
    query.dateFrom = filters.dateFrom;
  }

  if (filters.dateTo) {
    query.dateTo = filters.dateTo;
  }

  if (filters.modifiedAfter) {
    query.modifiedAfter = filters.modifiedAfter;
  }

  return query;
}

/**
 * Format date for Fishbowl API
 */
export function formatDate(date: string | Date): string {
  if (typeof date === 'string') {
    return new Date(date).toISOString().split('T')[0];
  }
  return date.toISOString().split('T')[0];
}

/**
 * Format date-time for Fishbowl API
 */
export function formatDateTime(date: string | Date): string {
  if (typeof date === 'string') {
    return new Date(date).toISOString();
  }
  return date.toISOString();
}

/**
 * Parse order items from input
 */
export function parseOrderItems(itemsJson: string): IDataObject[] {
  try {
    const items = JSON.parse(itemsJson);
    if (!Array.isArray(items)) {
      throw new Error('Order items must be an array');
    }
    return items;
  } catch (error) {
    throw new Error(`Invalid order items JSON: ${error}`);
  }
}

/**
 * Build address object from parameters
 */
export function buildAddress(params: IDataObject): IDataObject {
  const address: IDataObject = {};

  if (params.name) address.name = params.name;
  if (params.address) address.address = params.address;
  if (params.city) address.city = params.city;
  if (params.state) address.state = params.state;
  if (params.zip) address.zip = params.zip;
  if (params.country) address.country = params.country;

  return address;
}

/**
 * Clean undefined values from object
 */
export function cleanObject(obj: IDataObject): IDataObject {
  const cleaned: IDataObject = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

/**
 * Validate required parameters
 */
export function validateRequired(params: IDataObject, required: string[]): void {
  for (const field of required) {
    if (params[field] === undefined || params[field] === null || params[field] === '') {
      throw new Error(`Missing required parameter: ${field}`);
    }
  }
}

/**
 * Format inventory quantity response
 */
export function formatInventoryResponse(inventory: IDataObject[]): IDataObject {
  let totalQty = 0;
  let totalAvailable = 0;

  for (const item of inventory) {
    totalQty += (item.qty as number) || 0;
    totalAvailable += (item.qtyAvailable as number) || 0;
  }

  return {
    totalQuantity: totalQty,
    totalAvailable: totalAvailable,
    locations: inventory,
  };
}

/**
 * Build part object from parameters
 */
export function buildPartObject(params: IDataObject): IDataObject {
  const part: IDataObject = {};

  // Required fields
  if (params.partNumber) part.partNumber = params.partNumber;
  if (params.description) part.description = params.description;

  // Part type and classification
  if (params.partType) part.partType = params.partType;
  if (params.abcCode) part.abcCode = params.abcCode;

  // UOM
  if (params.uomId) {
    part.uom = { id: params.uomId };
  } else if (params.uomName) {
    part.uom = { name: params.uomName };
  }

  // Location
  if (params.defaultLocationId) {
    part.defaultLocation = { id: params.defaultLocationId };
  } else if (params.defaultLocationName) {
    part.defaultLocation = { name: params.defaultLocationName };
  }

  // Vendor
  if (params.defaultVendorId) {
    part.defaultVendor = { id: params.defaultVendorId };
  }

  // Numeric fields
  if (params.cost !== undefined) part.cost = params.cost;
  if (params.weight !== undefined) part.weight = params.weight;
  if (params.stdCost !== undefined) part.stdCost = params.stdCost;
  if (params.avgCost !== undefined) part.avgCost = params.avgCost;
  if (params.len !== undefined) part.len = params.len;
  if (params.width !== undefined) part.width = params.width;
  if (params.height !== undefined) part.height = params.height;

  // Boolean fields
  if (params.trackingFlag !== undefined) part.trackingFlag = params.trackingFlag;
  if (params.active !== undefined) part.active = params.active;

  // Additional fields
  if (params.details) part.details = params.details;
  if (params.alertNote) part.alertNote = params.alertNote;

  return cleanObject(part);
}

/**
 * Build order object (common for SO, PO, MO)
 */
export function buildOrderObject(params: IDataObject, orderType: string): IDataObject {
  const order: IDataObject = {};

  // Order number
  if (params[`${orderType}Num`]) {
    order[`${orderType}Num`] = params[`${orderType}Num`];
  }

  // Status
  if (params.status) order.status = params.status;

  // Customer/Vendor reference
  if (params.customerId) {
    order.customer = { id: params.customerId };
  } else if (params.customerName) {
    order.customer = { name: params.customerName };
  }

  if (params.vendorId) {
    order.vendor = { id: params.vendorId };
  } else if (params.vendorName) {
    order.vendor = { name: params.vendorName };
  }

  // Dates
  if (params.dateScheduled) order.dateScheduled = formatDate(params.dateScheduled as string);
  if (params.dateExpired) order.dateExpired = formatDate(params.dateExpired as string);
  if (params.dateConfirmed) order.dateConfirmed = formatDate(params.dateConfirmed as string);

  // Carrier
  if (params.carrierId) {
    order.carrier = { id: params.carrierId };
  }

  // Priority
  if (params.priorityId !== undefined) order.priorityId = params.priorityId;
  if (params.priority !== undefined) order.priority = params.priority;

  // Notes
  if (params.note) order.note = params.note;

  // Order items
  if (params.orderItems) {
    order.orderItems =
      typeof params.orderItems === 'string'
        ? parseOrderItems(params.orderItems as string)
        : params.orderItems;
  }

  return cleanObject(order);
}

/**
 * Build line item object
 */
export function buildLineItem(params: IDataObject): IDataObject {
  const item: IDataObject = {};

  // Part reference
  if (params.partId) {
    item.part = { id: params.partId };
  } else if (params.partNumber) {
    item.part = { partNumber: params.partNumber };
  }

  // Quantities
  if (params.qty !== undefined) item.qty = params.qty;
  if (params.qtyFulfilled !== undefined) item.qtyFulfilled = params.qtyFulfilled;

  // Pricing
  if (params.unitPrice !== undefined) item.unitPrice = params.unitPrice;
  if (params.totalPrice !== undefined) item.totalPrice = params.totalPrice;
  if (params.discount !== undefined) item.discount = params.discount;

  // Description override
  if (params.description) item.description = params.description;

  // Tax
  if (params.taxable !== undefined) item.taxable = params.taxable;
  if (params.taxRate !== undefined) item.taxRate = params.taxRate;

  // UOM
  if (params.uomId) {
    item.uom = { id: params.uomId };
  }

  return cleanObject(item);
}
