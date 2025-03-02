# API Documentation

## API Overview

### Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

### Authentication

All authenticated endpoints require a Bearer token:
```http
Authorization: Bearer <jwt_token>
```

### Response Format

Standard response format:
```json
{
  "data": {},
  "error": null,
  "message": "Success",
  "statusCode": 200
}
```

Error response format:
```json
{
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  },
  "statusCode": 400
}
```

## Authentication API

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

Response:
```json
{
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token"
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

## User API

### Get User Profile
```http
GET /users/me
Authorization: Bearer <token>
```

### Update Profile
```http
PATCH /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "avatar": "avatar_url"
}
```

### Change Password
```http
POST /users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "current",
  "newPassword": "new"
}
```

## Data API

### List Items
```http
GET /items
Authorization: Bearer <token>
Query Parameters:
  - page (default: 1)
  - limit (default: 10)
  - sort (default: "createdAt")
  - order (default: "desc")
```

### Get Single Item
```http
GET /items/:id
Authorization: Bearer <token>
```

### Create Item
```http
POST /items
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Item Title",
  "description": "Item Description",
  "category": "category_id"
}
```

### Update Item
```http
PUT /items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated Description"
}
```

### Delete Item
```http
DELETE /items/:id
Authorization: Bearer <token>
```

## Error Codes

### Authentication Errors
- `AUTH_INVALID_CREDENTIALS`: Invalid email or password
- `AUTH_TOKEN_EXPIRED`: JWT token has expired
- `AUTH_TOKEN_INVALID`: Invalid JWT token
- `AUTH_UNAUTHORIZED`: User not authorized

### User Errors
- `USER_NOT_FOUND`: User does not exist
- `USER_ALREADY_EXISTS`: Email already registered
- `USER_INVALID_PASSWORD`: Invalid password format

### Data Errors
- `ITEM_NOT_FOUND`: Item does not exist
- `ITEM_VALIDATION_ERROR`: Invalid item data
- `ITEM_UNAUTHORIZED`: Not authorized to access item

## Rate Limiting

Rate limiting is implemented using the following rules:
- Authentication endpoints: 5 requests per minute
- API endpoints: 100 requests per minute per user
- Public endpoints: 60 requests per minute per IP

Headers returned:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1619683200
```

## WebSocket API

### Connection
```javascript
const socket = new WebSocket('ws://your-domain.com/ws');
socket.onopen = () => {
  socket.send(JSON.stringify({
    type: 'auth',
    token: 'jwt_token'
  }));
};
```

### Event Types

1. **Real-time Updates**
```javascript
{
  type: 'update',
  data: {
    itemId: 'item_id',
    changes: {}
  }
}
```

2. **Notifications**
```javascript
{
  type: 'notification',
  data: {
    message: 'New notification',
    type: 'info'
  }
}
```

## API Versioning

API versioning is handled through URL prefixing:
```
/api/v1/resource
/api/v2/resource
```

### Version Support
- v1: Current stable version
- v2: Beta features (if available)
- Legacy versions: Supported for 6 months after deprecation

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}
```

### Item Model
```typescript
interface Item {
  id: string;
  title: string;
  description: string;
  userId: string;
  category: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}
```

## API Security

### CORS Configuration
```typescript
const corsOptions = {
  origin: ['https://your-domain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
```

### Input Validation
All endpoints use Zod schemas for request validation:
```typescript
const createItemSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000),
  category: z.string().uuid()
});
```

## Advanced API Patterns

### GraphQL Integration

1. **Schema Definition**
   ```graphql
   type User {
     id: ID!
     name: String!
     email: String!
     profile: Profile!
     posts: [Post!]!
   }

   type Query {
     user(id: ID!): User
     users(limit: Int, offset: Int): [User!]!
     searchUsers(query: String!): [User!]!
   }

   type Mutation {
     createUser(input: CreateUserInput!): User!
     updateUser(id: ID!, input: UpdateUserInput!): User!
     deleteUser(id: ID!): Boolean!
   }
   ```

2. **Resolvers**
   ```typescript
   const resolvers = {
     Query: {
       user: async (_, { id }, context) => {
         await validateSession(context);
         return await getUserById(id);
       },
       users: async (_, { limit, offset }, context) => {
         await validateSession(context);
         return await getUsers({ limit, offset });
       }
     },
     User: {
       posts: async (parent, _, context) => {
         return await getPostsByUserId(parent.id);
       }
     }
   };
   ```

### API Versioning Strategy

1. **URL-based Versioning**
   ```typescript
   // pages/api/v1/users/[id].ts
   export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     if (req.method === 'GET') {
       return await handleGetUserV1(req, res);
     }
   }

   // pages/api/v2/users/[id].ts
   export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     if (req.method === 'GET') {
       return await handleGetUserV2(req, res);
     }
   }
   ```

2. **Header-based Versioning**
   ```typescript
   // middleware/version.ts
   export function getApiVersion(req: NextApiRequest) {
     const version = req.headers['api-version'];
     switch (version) {
       case '2':
         return 'v2';
       default:
         return 'v1';
     }
   }
   ```

### API Gateway Pattern

1. **Gateway Implementation**
   ```typescript
   // lib/gateway/index.ts
   export class ApiGateway {
     async routeRequest(req: NextApiRequest, res: NextApiResponse) {
       const route = this.getRoute(req.url);
       const handler = await this.getHandler(route);
       
       try {
         await this.validateRequest(req);
         await handler.execute(req, res);
       } catch (error) {
         this.handleError(error, res);
       }
     }

     private async validateRequest(req: NextApiRequest) {
       await this.validateAuth(req);
       await this.validateRateLimit(req);
       await this.validateSchema(req);
     }
   }
   ```

2. **Service Registry**
   ```typescript
   // lib/gateway/registry.ts
   export class ServiceRegistry {
     private services: Map<string, ServiceConfig> = new Map();

     register(name: string, config: ServiceConfig) {
       this.services.set(name, config);
     }

     async getService(name: string) {
       const config = this.services.get(name);
       if (!config) throw new ServiceNotFoundError(name);
       return await this.initializeService(config);
     }
   }
   ```

### Advanced Response Patterns

1. **Pagination**
   ```typescript
   interface PaginatedResponse<T> {
     data: T[];
     pagination: {
       total: number;
       page: number;
       pageSize: number;
       totalPages: number;
       hasNext: boolean;
       hasPrev: boolean;
     };
     links: {
       self: string;
       next?: string;
       prev?: string;
       first: string;
       last: string;
     };
   }

   export async function getPaginatedResponse<T>(
     query: QueryConfig,
     baseUrl: string
   ): Promise<PaginatedResponse<T>> {
     const { page, pageSize } = query;
     const total = await getTotal(query);
     const data = await getData(query);
     
     return {
       data,
       pagination: {
         total,
         page,
         pageSize,
         totalPages: Math.ceil(total / pageSize),
         hasNext: page * pageSize < total,
         hasPrev: page > 1
       },
       links: generatePaginationLinks(query, baseUrl, total)
     };
   }
   ```

2. **Caching Strategy**
   ```typescript
   export class ApiCache {
     private cache: Map<string, CacheEntry> = new Map();

     async get<T>(key: string): Promise<T | null> {
       const entry = this.cache.get(key);
       if (!entry) return null;
       if (this.isExpired(entry)) {
         this.cache.delete(key);
         return null;
       }
       return entry.data as T;
     }

     async set(key: string, data: any, ttl: number) {
       this.cache.set(key, {
         data,
         expires: Date.now() + ttl,
         lastAccessed: Date.now()
       });
     }

     private isExpired(entry: CacheEntry): boolean {
       return Date.now() > entry.expires;
     }
   }
   ```

### API Documentation Generation

1. **OpenAPI Specification**
   ```yaml
   openapi: 3.0.0
   info:
     title: Next.js API
     version: 1.0.0
   paths:
     /api/users:
       get:
         summary: Get users
         parameters:
           - name: limit
             in: query
             schema:
               type: integer
           - name: offset
             in: query
             schema:
               type: integer
         responses:
           200:
             description: Success
             content:
               application/json:
                 schema:
                   $ref: '#/components/schemas/UsersResponse'
   ```

2. **API Documentation Generator**
   ```typescript
   export class ApiDocGenerator {
     private specs: Map<string, OpenAPISpec> = new Map();

     addEndpoint(path: string, method: string, spec: EndpointSpec) {
       const currentSpec = this.specs.get(path) || {};
       this.specs.set(path, {
         ...currentSpec,
         [method.toLowerCase()]: spec
       });
     }

     generateDocs(): OpenAPIDocument {
       return {
         openapi: '3.0.0',
         info: this.getInfo(),
         paths: this.getPaths(),
         components: this.getComponents()
       };
     }
   }
   ```

### Error Handling

1. **Error Classification**
   ```typescript
   export class ApiError extends Error {
     constructor(
       public statusCode: number,
       public code: string,
       message: string,
       public details?: any
     ) {
       super(message);
     }

     static badRequest(code: string, message: string, details?: any) {
       return new ApiError(400, code, message, details);
     }

     static unauthorized(code: string, message: string, details?: any) {
       return new ApiError(401, code, message, details);
     }

     static forbidden(code: string, message: string, details?: any) {
       return new ApiError(403, code, message, details);
     }

     static notFound(code: string, message: string, details?: any) {
       return new ApiError(404, code, message, details);
     }
   }
   ```

2. **Error Handler**
   ```typescript
   export function errorHandler(
     error: Error,
     req: NextApiRequest,
     res: NextApiResponse
   ) {
     if (error instanceof ApiError) {
       return res.status(error.statusCode).json({
         error: {
           code: error.code,
           message: error.message,
           details: error.details
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
   } 