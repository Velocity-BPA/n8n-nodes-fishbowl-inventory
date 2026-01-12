# n8n-nodes-fishbowl-inventory

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Fishbowl Inventory (Fishbowl Advanced), providing warehouse and manufacturing inventory management automation within n8n workflows.

![n8n](https://img.shields.io/badge/n8n-community%20node-orange)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

## Features

- **12 Resource Categories** with 60+ operations
- **Part Management**: Create, update, inventory tracking, lot/serial numbers
- **Sales Orders**: Full lifecycle management with shipping and fulfillment
- **Purchase Orders**: Vendor orders with receiving and quick-receive
- **Manufacturing Orders**: BOM-based production with build tracking
- **Customer & Vendor Management**: Addresses, contacts, and order history
- **Location Management**: Hierarchical locations and inventory movement
- **Import/Export**: Bulk data operations and custom SQL queries
- **Polling Trigger**: Event-based workflow automation

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter: `n8n-nodes-fishbowl-inventory`
5. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-fishbowl-inventory
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-fishbowl-inventory.git
cd n8n-nodes-fishbowl-inventory

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n custom nodes
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-fishbowl-inventory

# Restart n8n
n8n start
```

## Credentials Setup

| Field | Description |
|-------|-------------|
| Server URL | Your Fishbowl server URL (e.g., https://fishbowl.yourcompany.com) |
| Port | Server port (default: 443) |
| Username | Fishbowl username with API access |
| Password | User password |
| App Name | Application name for identification |
| App ID | Unique application ID |

### Setting Up API Access

1. In Fishbowl Advanced, go to **Settings** > **Integrations**
2. Create a new API Integration
3. Note the application credentials
4. Create a user with appropriate API permissions

## Resources & Operations

### Part (Product/Item)
| Operation | Description |
|-----------|-------------|
| Get | Retrieve a part by ID or number |
| Get Many | List all parts with filters |
| Create | Create a new part |
| Update | Update part details |
| Delete | Delete a part |
| Get Inventory | Get inventory quantities |
| Add Inventory | Add inventory to a location |
| Cycle Inventory | Perform cycle count |
| Move Inventory | Move between locations |
| Scrap Inventory | Scrap inventory |
| Get Tracking | Get lot/serial tracking |

### Sales Order
| Operation | Description |
|-----------|-------------|
| Get | Retrieve SO by ID or number |
| Get Many | List sales orders with filters |
| Create | Create a new sales order |
| Update | Update sales order |
| Delete | Delete/void sales order |
| Issue | Issue for fulfillment |
| Ship | Ship the order |
| Void | Void the order |
| Add Item | Add line item |
| Remove Item | Remove line item |
| Quick Ship | Auto-pick and ship |

### Purchase Order
| Operation | Description |
|-----------|-------------|
| Get | Retrieve PO by ID or number |
| Get Many | List purchase orders |
| Create | Create a new PO |
| Update | Update PO details |
| Delete | Delete/void PO |
| Issue | Issue to vendor |
| Receive | Receive items |
| Close | Close PO |
| Void | Void PO |
| Add Item | Add line item |
| Quick Receive | Receive all items |

### Customer
| Operation | Description |
|-----------|-------------|
| Get | Retrieve by ID or name |
| Get Many | List customers |
| Create | Create customer |
| Update | Update customer |
| Delete | Deactivate customer |
| Get Addresses | Get addresses |
| Add Address | Add address |
| Get Contacts | Get contacts |
| Add Contact | Add contact |
| Get Orders | Get customer's orders |

### Vendor
| Operation | Description |
|-----------|-------------|
| Get | Retrieve by ID or name |
| Get Many | List vendors |
| Create | Create vendor |
| Update | Update vendor |
| Delete | Deactivate vendor |
| Get Addresses | Get addresses |
| Add Address | Add address |
| Get Contacts | Get contacts |
| Add Contact | Add contact |
| Get Purchase Orders | Get vendor's POs |

### Manufacture Order
| Operation | Description |
|-----------|-------------|
| Get | Retrieve MO by ID or number |
| Get Many | List manufacture orders |
| Create | Create MO |
| Update | Update MO |
| Delete | Delete MO |
| Issue | Issue for production |
| Build | Complete build |
| Close | Close MO |
| Void | Void MO |
| Add Item | Add component |
| Remove Item | Remove component |

### Location
| Operation | Description |
|-----------|-------------|
| Get | Retrieve location |
| Get Many | List locations |
| Create | Create location |
| Update | Update location |
| Delete | Delete location |
| Get Inventory | Get inventory at location |
| Move All Inventory | Move all from location |

### Location Group
| Operation | Description |
|-----------|-------------|
| Get | Retrieve location group |
| Get Many | List location groups |
| Create | Create location group |
| Update | Update location group |
| Delete | Delete location group |
| Get Locations | Get locations in group |

### Unit of Measure (UOM)
| Operation | Description |
|-----------|-------------|
| Get | Retrieve UOM |
| Get Many | List UOMs |
| Create | Create UOM |
| Update | Update UOM |
| Delete | Delete UOM |
| Get Conversions | Get conversions |
| Add Conversion | Add conversion |

### User
| Operation | Description |
|-----------|-------------|
| Get | Retrieve user |
| Get Many | List users |
| Create | Create user |
| Update | Update user |
| Delete | Deactivate user |
| Get Permissions | Get permissions |

### Payment
| Operation | Description |
|-----------|-------------|
| Get | Retrieve payment |
| Get Many | List payments |
| Create | Record payment |
| Update | Update payment |
| Delete | Delete payment |
| Get By Order | Get payments for order |

### Import/Export
| Operation | Description |
|-----------|-------------|
| Import Sales Order | Import SO from JSON |
| Import Purchase Order | Import PO |
| Import Products | Import products |
| Import Customers | Import customers |
| Export Inventory | Export inventory report |
| Export Sales Report | Export sales data |
| Run Custom Query | Execute SQL query |

## Trigger Node

The Fishbowl Inventory Trigger node uses polling to detect changes:

| Event | Description |
|-------|-------------|
| Sales Order Created | New sales orders |
| Sales Order Updated | Modified sales orders |
| Sales Order Shipped | Shipped orders |
| Purchase Order Created | New purchase orders |
| Purchase Order Received | Received POs |
| Manufacture Order Created | New MOs |
| Manufacture Order Completed | Completed MOs |
| Part Created | New parts |
| Part Updated | Modified parts |
| Customer Created | New customers |
| Vendor Created | New vendors |
| Inventory Changed | Inventory modifications |

## Usage Examples

### Create a Sales Order

```json
{
  "resource": "salesOrder",
  "operation": "create",
  "customerId": 123,
  "additionalFields": {
    "customerContact": "John Smith",
    "carrierId": 1,
    "note": "Rush order"
  }
}
```

### Move Inventory Between Locations

```json
{
  "resource": "part",
  "operation": "moveInventory",
  "partId": "WIDGET-001",
  "fromLocationId": 10,
  "toLocationId": 20,
  "qty": 50
}
```

### Quick Receive a Purchase Order

```json
{
  "resource": "purchaseOrder",
  "operation": "quickReceive",
  "poId": "45",
  "locationId": 5
}
```

## Fishbowl Inventory Concepts

### Part Types
- **Inventory**: Physical items tracked in stock
- **Non-Inventory**: Items not tracked in stock
- **Service**: Service/labor items

### Order Statuses
- **Sales Orders**: Estimate → Issued → In Progress → Fulfilled → Closed
- **Purchase Orders**: Pending → Issued → Partially Received → Received → Closed
- **Manufacture Orders**: Pending → Entered → Issued → In Progress → Fulfilled → Closed

### Location Hierarchy
Fishbowl supports hierarchical locations with parent-child relationships. Locations can be grouped into Location Groups for reporting and organization.

### Lot/Serial Tracking
Parts with tracking enabled support lot numbers and serial numbers for full traceability.

## Error Handling

The node includes comprehensive error handling:

- **401 Unauthorized**: Token automatically refreshed
- **404 Not Found**: Clear error message with resource details
- **409 Conflict**: Duplicate detection
- **500 Server Error**: Retry with exponential backoff

Enable **Continue On Fail** in n8n to process remaining items even if some fail.

## Security Best Practices

1. **Use dedicated API users** with minimal required permissions
2. **Store credentials securely** using n8n's credential system
3. **Use HTTPS** for all API communications
4. **Rotate API credentials** periodically
5. **Monitor API usage** for unusual patterns

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Format code
npm run format
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
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write or update tests
5. Submit a pull request

## Support

- **Documentation**: [GitHub Wiki](https://github.com/Velocity-BPA/n8n-nodes-fishbowl-inventory/wiki)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-fishbowl-inventory/issues)
- **Fishbowl API Docs**: [Fishbowl API Documentation](https://www.fishbowlinventory.com/api)

## Acknowledgments

- [n8n](https://n8n.io) - Workflow automation platform
- [Fishbowl Inventory](https://www.fishbowlinventory.com) - Inventory management software
