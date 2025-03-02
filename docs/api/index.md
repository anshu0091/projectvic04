# API Documentation

## Navigation

- [← Back to Main](../README.md)
- [↑ Up to Index](./index.md)
- [→ Next: Authentication](./authentication.md)

## Contents

1. [API Overview](./overview.md)
   - Base URLs
   - Response Formats
   - Error Handling
   - Rate Limiting

2. [Authentication](./authentication.md)
   - Authentication Methods
   - Token Management
   - Session Handling
   - OAuth Integration

3. [Endpoints](./endpoints.md)
   - User Management
   - Data Operations
   - File Handling
   - Admin Functions

4. [WebSockets](./websockets.md)
   - Real-time Updates
   - Event Types
   - Connection Management
   - Error Handling

## Quick Links

- [Development Guide](../guides/development.md)
- [Security Guidelines](../security/overview.md)
- [Troubleshooting](../guides/troubleshooting.md)

## API Standards

### Response Format
```json
{
  "data": {},
  "error": null,
  "message": "Success",
  "statusCode": 200
}
```

### Error Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  },
  "statusCode": 400
}
```

### Authentication
```http
Authorization: Bearer <jwt_token>
```

## Rate Limiting

- Authentication: 5 requests/minute
- API: 100 requests/minute/user
- Public: 60 requests/minute/IP

## Version Support

- Current: v1.0.0
- Beta: v2.0.0-beta
- Deprecated: v0.9.x

## Need Help?

- [API Troubleshooting](../guides/troubleshooting.md#api-issues)
- [Support Contact](../reference/support.md)
- [Contributing Guide](../reference/contributing.md) 