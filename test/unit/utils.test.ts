/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  buildFilterQuery,
  formatDate,
  formatDateTime,
  cleanObject,
  validateRequired,
} from '../../nodes/FishbowlInventory/utils';

describe('Utility Functions', () => {
  describe('buildFilterQuery', () => {
    it('should build query from simple filters', () => {
      const filters = {
        active: true,
        status: 'Open',
      };

      const result = buildFilterQuery(filters);

      expect(result).toEqual({
        active: true,
        status: 'Open',
      });
    });

    it('should handle location filters', () => {
      const filters = {
        locationId: 123,
        locationGroupId: 456,
      };

      const result = buildFilterQuery(filters);

      expect(result).toEqual({
        locationId: 123,
        locationGroupId: 456,
      });
    });

    it('should handle date filters', () => {
      const filters = {
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
        modifiedAfter: '2024-06-01',
      };

      const result = buildFilterQuery(filters);

      expect(result).toEqual({
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
        modifiedAfter: '2024-06-01',
      });
    });

    it('should return empty object for empty filters', () => {
      const result = buildFilterQuery({});
      expect(result).toEqual({});
    });
  });

  describe('formatDate', () => {
    it('should format ISO date string to YYYY-MM-DD', () => {
      const date = '2024-06-15T14:30:00.000Z';
      const result = formatDate(date);
      expect(result).toBe('2024-06-15');
    });

    it('should format Date object to YYYY-MM-DD', () => {
      const date = new Date('2024-06-15T00:00:00.000Z');
      const result = formatDate(date);
      expect(result).toBe('2024-06-15');
    });

    it('should handle date with different time', () => {
      const date = '2024-12-25T23:59:59.999Z';
      const result = formatDate(date);
      expect(result).toBe('2024-12-25');
    });
  });

  describe('formatDateTime', () => {
    it('should format date to ISO string', () => {
      const date = '2024-06-15T14:30:00.000Z';
      const result = formatDateTime(date);
      expect(result).toBe('2024-06-15T14:30:00.000Z');
    });

    it('should format Date object to ISO string', () => {
      const date = new Date('2024-06-15T14:30:00.000Z');
      const result = formatDateTime(date);
      expect(result).toBe('2024-06-15T14:30:00.000Z');
    });
  });

  describe('cleanObject', () => {
    it('should remove undefined values', () => {
      const obj = {
        name: 'Test',
        value: undefined,
        count: 5,
      };

      const result = cleanObject(obj);

      expect(result).toEqual({
        name: 'Test',
        count: 5,
      });
    });

    it('should remove null values', () => {
      const obj = {
        name: 'Test',
        value: null,
        count: 5,
      };

      const result = cleanObject(obj);

      expect(result).toEqual({
        name: 'Test',
        count: 5,
      });
    });

    it('should remove empty strings', () => {
      const obj = {
        name: '',
        count: 0,
        active: false,
      };

      const result = cleanObject(obj);

      expect(result).toEqual({
        count: 0,
        active: false,
      });
    });

    it('should return empty object for all null/undefined/empty', () => {
      const obj = {
        a: undefined,
        b: null,
        c: '',
      };

      const result = cleanObject(obj);

      expect(result).toEqual({});
    });
  });

  describe('validateRequired', () => {
    it('should not throw for valid params with all required fields', () => {
      const params = { name: 'Test', id: 123 };
      expect(() => validateRequired(params, ['name', 'id'])).not.toThrow();
    });

    it('should not throw for zero values', () => {
      const params = { count: 0 };
      expect(() => validateRequired(params, ['count'])).not.toThrow();
    });

    it('should not throw for false boolean', () => {
      const params = { active: false };
      expect(() => validateRequired(params, ['active'])).not.toThrow();
    });

    it('should throw for missing required field', () => {
      const params = { name: 'Test' };
      expect(() => validateRequired(params, ['name', 'id'])).toThrow('Missing required parameter: id');
    });

    it('should throw for empty string required field', () => {
      const params = { name: '' };
      expect(() => validateRequired(params, ['name'])).toThrow('Missing required parameter: name');
    });

    it('should throw for null required field', () => {
      const params = { name: null };
      expect(() => validateRequired(params, ['name'])).toThrow('Missing required parameter: name');
    });

    it('should throw for undefined required field', () => {
      const params = { name: undefined };
      expect(() => validateRequired(params, ['name'])).toThrow('Missing required parameter: name');
    });
  });
});
