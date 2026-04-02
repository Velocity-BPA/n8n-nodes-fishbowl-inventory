# n8n-nodes-fishbowl-inventory

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This community node provides seamless integration between n8n and Fishbowl Inventory, enabling automated inventory management, order processing, and reporting workflows. Access 8 core resources including products, inventory tracking, purchase orders, sales orders, and comprehensive reporting capabilities to streamline your inventory operations.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Fishbowl](https://img.shields.io/badge/Fishbowl-Inventory-orange)
![ERP](https://img.shields.io/badge/ERP-Integration-green)
![Automation](https://img.shields.io/badge/Automation-Ready-purple)

## Features

- **Complete Product Management** - Create, update, search, and manage product catalogs with full SKU tracking
- **Real-time Inventory Control** - Monitor stock levels, track movements, and automate reorder workflows
- **Location Management** - Manage warehouse locations, bins, and inventory distribution across facilities  
- **Purchase Order Automation** - Create, update, and track purchase orders with vendor integration
- **Sales Order Processing** - Handle sales orders from creation through fulfillment with customer data
- **Vendor & Customer Management** - Maintain comprehensive contact databases with relationship tracking
- **Advanced Reporting** - Generate custom reports for inventory, sales, purchasing, and business analytics
- **Bulk Operations** - Process multiple records efficiently with batch operations support

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-fishbowl-inventory`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-fishbowl-inventory
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-fishbowl-inventory.git
cd n8n-nodes-fishbowl-inventory
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-fishbowl-inventory
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Fishbowl Inventory API key | Yes |
| Server URL | Fishbowl server URL (e.g., http://localhost:28192) | Yes |
| Username | Fishbowl username for authentication | Yes |
| Password | Fishbowl password for authentication | Yes |
| Database | Fishbowl database name | Yes |

## Resources & Operations

### 1. Product

| Operation | Description |
|-----------|-------------|
| Create | Create a new product with specifications and pricing |
| Update | Update existing product information and attributes |
| Get | Retrieve product details by ID or SKU |
| Get All | List all products with filtering and pagination |
| Delete | Remove a product from the catalog |
| Search | Search products by name, SKU, or description |

### 2. Inventory

| Operation | Description |
|-----------|-------------|
| Get | Get current inventory levels for specific items |
| Get All | Retrieve inventory status across all products |
| Adjust | Perform inventory adjustments and corrections |
| Move | Transfer inventory between locations |
| Cycle Count | Execute cycle counting procedures |
| Get History | View inventory movement history |

### 3. Location

| Operation | Description |
|-----------|-------------|
| Create | Create new warehouse locations or bins |
| Update | Modify location details and settings |
| Get | Retrieve specific location information |
| Get All | List all locations and their hierarchies |
| Delete | Remove unused locations |

### 4. Purchase Order

| Operation | Description |
|-----------|-------------|
| Create | Create new purchase orders with line items |
| Update | Modify existing purchase order details |
| Get | Retrieve purchase order information |
| Get All | List purchase orders with status filtering |
| Delete | Cancel or remove purchase orders |
| Fulfill | Process purchase order receipts |

### 5. Sales Order

| Operation | Description |
|-----------|-------------|
| Create | Create new sales orders with customer details |
| Update | Modify sales order information |
| Get | Retrieve sales order details and status |
| Get All | List sales orders with filtering options |
| Delete | Cancel sales orders |
| Ship | Process sales order shipments |

### 6. Vendor

| Operation | Description |
|-----------|-------------|
| Create | Add new vendor records with contact details |
| Update | Modify vendor information and terms |
| Get | Retrieve specific vendor details |
| Get All | List all vendors with search capabilities |
| Delete | Remove vendor records |

### 7. Customer

| Operation | Description |
|-----------|-------------|
| Create | Create new customer accounts |
| Update | Update customer information and preferences |
| Get | Retrieve customer details and history |
| Get All | List all customers with filtering |
| Delete | Remove customer records |

### 8. Report

| Operation | Description |
|-----------|-------------|
| Generate | Generate custom reports with parameters |
| Get | Retrieve existing report data |
| Get All | List available report templates |
| Export | Export reports in various formats |
| Schedule | Set up automated report generation |

## Usage Examples

```javascript
// Create a new product
{
  "name": "Wireless Headphones",
  "sku": "WH-001",
  "description": "Premium wireless headphones with noise cancellation",
  "price": 199.99,
  "uom": "Each",
  "trackingType": "Serialized"
}
```

```javascript
// Adjust inventory levels
{
  "productId": "WH-001",
  "locationId": "MAIN-A1-01",
  "quantity": 50,
  "adjustmentType": "Add",
  "reason": "New stock received"
}
```

```javascript
// Create purchase order
{
  "vendorId": "VENDOR-001",
  "items": [
    {
      "productId": "WH-001",
      "quantity": 100,
      "unitCost": 125.00
    }
  ],
  "deliveryDate": "2024-02-15"
}
```

```javascript
// Generate inventory report
{
  "reportType": "Inventory Valuation",
  "dateRange": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "locations": ["MAIN", "WAREHOUSE-2"],
  "format": "PDF"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Authentication Failed | Invalid API credentials or expired session | Verify API key, username, password, and server connectivity |
| Product Not Found | Referenced product ID or SKU doesn't exist | Check product exists and use correct identifier |
| Insufficient Inventory | Attempting to allocate more than available stock | Verify inventory levels before processing orders |
| Location Invalid | Specified location doesn't exist or is inactive | Confirm location is active and properly configured |
| Vendor/Customer Missing | Referenced vendor or customer record not found | Ensure vendor/customer exists before creating orders |
| Permission Denied | User lacks required permissions for operation | Check user permissions in Fishbowl administration |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-fishbowl-inventory/issues)
- **Fishbowl API Documentation**: [Fishbowl Developer Resources](https://www.fishbowlinventory.com/developers)
- **Community Forums**: [Fishbowl Community](https://www.fishbowlinventory.com/community)