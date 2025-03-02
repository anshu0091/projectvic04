# API Endpoints

## Navigation

- [← Back to Authentication](./authentication.md)
- [↑ Up to Index](./index.md)
- [→ Next: WebSockets](./websockets.md)

## User Endpoints

### User Management

#### Get Current User
```http
GET /api/users/me
Authorization: Bearer <token>

Response 200:
{
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Update User Profile
```http
PATCH /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "avatar": "https://example.com/avatar.jpg"
}

Response 200:
{
  "data": {
    "id": "user_id",
    "name": "Updated Name",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

### User Settings

#### Get User Settings
```http
GET /api/users/settings
Authorization: Bearer <token>

Response 200:
{
  "data": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": false
    },
    "preferences": {
      "language": "en"
    }
  }
}
```

## Data Endpoints

### Item Management

#### List Items
```http
GET /api/items
Authorization: Bearer <token>
Query Parameters:
  - page (default: 1)
  - limit (default: 10)
  - sort (default: "createdAt")
  - order (default: "desc")

Response 200:
{
  "data": [
    {
      "id": "item_id",
      "title": "Item Title",
      "description": "Item Description"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

#### Create Item
```http
POST /api/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Item",
  "description": "Item Description",
  "category": "category_id"
}

Response 201:
{
  "data": {
    "id": "new_item_id",
    "title": "New Item",
    "description": "Item Description",
    "category": "category_id",
    "createdAt": "2024-04-01T12:00:00Z"
  }
}
```

## File Operations

### File Upload

#### Upload File
```http
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
  - file: <file_data>
  - type: "image"
  - metadata: { "alt": "Image description" }

Response 201:
{
  "data": {
    "id": "file_id",
    "url": "https://storage.example.com/file.jpg",
    "type": "image",
    "size": 1024,
    "metadata": {
      "alt": "Image description"
    }
  }
}
```

## Admin Endpoints

### System Management

#### System Health
```http
GET /api/admin/health
Authorization: Bearer <token>
Required Role: admin

Response 200:
{
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "uptime": 3600,
    "metrics": {
      "cpu": 45,
      "memory": 60,
      "requests": 1000
    }
  }
}
```

## Implementation Examples

### Request Handler

```typescript
export class RequestHandler<T> {
  constructor(private readonly service: Service<T>) {}

  async handleRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // 1. Validate request
      await this.validateRequest(req);

      // 2. Process request
      const result = await this.service.process(req.body);

      // 3. Send response
      res.status(200).json({
        data: result,
        message: 'Success'
      });
    } catch (error) {
      next(error);
    }
  }

  private async validateRequest(req: Request) {
    const schema = this.getValidationSchema(req.method);
    await schema.parseAsync(req.body);
  }
}
```

### Error Handling

```typescript
export const apiErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        details: error.details
      }
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: error.message
      }
    });
  }

  // Log unexpected errors
  logger.error('Unexpected error', { error, req });

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};
```

## Rate Limiting

### Endpoint-specific Limits

```typescript
export const rateLimits = {
  'GET /api/items': {
    windowMs: 60000, // 1 minute
    max: 100
  },
  'POST /api/items': {
    windowMs: 60000,
    max: 10
  },
  'PATCH /api/items/:id': {
    windowMs: 60000,
    max: 20
  }
};

export const createRateLimiter = (endpoint: string) => {
  const config = rateLimits[endpoint];
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: `Too many requests for ${endpoint}`
  });
};
```

## Response Formatting

### Response Transformer

```typescript
export class ResponseTransformer {
  static transform<T>(data: T, meta?: ResponseMeta) {
    return {
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta
      }
    };
  }

  static paginate<T>(
    data: T[],
    pagination: PaginationInfo
  ) {
    return this.transform(data, {
      pagination: {
        total: pagination.total,
        page: pagination.page,
        limit: pagination.limit,
        pages: Math.ceil(pagination.total / pagination.limit)
      }
    });
  }
}
```

## Testing

### Endpoint Tests

```typescript
describe('API Endpoints', () => {
  describe('GET /api/items', () => {
    it('should return paginated items', async () => {
      const response = await request(app)
        .get('/api/items')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeArray();
      expect(response.body.meta.pagination).toBeDefined();
    });

    it('should handle filtering', async () => {
      const response = await request(app)
        .get('/api/items?category=test')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchFilter({ category: 'test' });
    });
  });
});
```

## Quick Links

- [Authentication](./authentication.md)
- [Error Handling](./overview.md#error-handling)
- [Rate Limiting](./overview.md#rate-limiting)

## Need Help?

- [API Issues](../guides/troubleshooting.md#api-issues)
- [Support Contact](../reference/support.md#api-support)
- [Contributing](../reference/contributing.md) 