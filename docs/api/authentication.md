# API Authentication

## Navigation

- [← Back to API Overview](./overview.md)
- [↑ Up to Index](./index.md)
- [→ Next: Endpoints](./endpoints.md)

## Authentication Methods

### JWT Authentication

```typescript
// Request with JWT
const response = await fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json'
  }
});
```

### OAuth Integration

```typescript
// OAuth configuration
const oauthConfig = {
  providers: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: ['email', 'profile']
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: ['user:email']
    }
  }
};
```

## Token Management

### Token Generation

```typescript
export async function generateTokens(user: User) {
  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, version: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}
```

### Token Refresh

```typescript
export async function refreshAccessToken(refreshToken: string) {
  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await getUserById(payload.userId);
    if (!user || user.tokenVersion !== payload.version) {
      throw new Error('Invalid refresh token');
    }

    return generateTokens(user);
  } catch (error) {
    throw new AuthenticationError('Invalid refresh token');
  }
}
```

## Session Management

### Session Store

```typescript
export class SessionStore {
  private store: Map<string, Session> = new Map();

  async createSession(userId: string, metadata: SessionMetadata) {
    const sessionId = crypto.randomUUID();
    const session = {
      id: sessionId,
      userId,
      metadata,
      createdAt: new Date(),
      lastAccessed: new Date()
    };

    this.store.set(sessionId, session);
    return session;
  }

  async validateSession(sessionId: string) {
    const session = this.store.get(sessionId);
    if (!session) return null;

    if (this.isExpired(session)) {
      this.store.delete(sessionId);
      return null;
    }

    session.lastAccessed = new Date();
    return session;
  }
}
```

## Security Measures

### Rate Limiting

```typescript
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later'
});
```

### Password Security

```typescript
export class PasswordService {
  private static readonly SALT_ROUNDS = 12;

  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async verify(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static validatePassword(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  }
}
```

## Error Handling

### Authentication Errors

```typescript
export class AuthenticationError extends Error {
  constructor(
    message: string,
    public code: string = 'AUTHENTICATION_ERROR',
    public status: number = 401
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export const authErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AuthenticationError) {
    return res.status(error.status).json({
      error: {
        code: error.code,
        message: error.message
      }
    });
  }
  next(error);
};
```

## Implementation Examples

### Login Endpoint

```typescript
export async function handleLogin(
  req: Request,
  res: Response
) {
  const { email, password } = req.body;

  try {
    // 1. Validate input
    if (!email || !password) {
      throw new AuthenticationError(
        'Email and password are required'
      );
    }

    // 2. Find user
    const user = await getUserByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // 3. Verify password
    const isValid = await PasswordService.verify(
      password,
      user.passwordHash
    );
    if (!isValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    // 4. Generate tokens
    const tokens = await generateTokens(user);

    // 5. Create session
    const session = await sessionStore.createSession(
      user.id,
      { userAgent: req.headers['user-agent'] }
    );

    // 6. Send response
    res.json({
      tokens,
      user: sanitizeUser(user),
      sessionId: session.id
    });
  } catch (error) {
    next(error);
  }
}
```

## Testing

### Authentication Tests

```typescript
describe('Authentication', () => {
  it('should generate valid tokens', async () => {
    const user = createTestUser();
    const tokens = await generateTokens(user);

    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');

    const decoded = jwt.verify(
      tokens.accessToken,
      process.env.JWT_SECRET
    );
    expect(decoded.userId).toBe(user.id);
  });

  it('should handle invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('AUTHENTICATION_ERROR');
  });
});
```

## Quick Links

- [Security Guidelines](../security/authentication.md)
- [API Overview](./overview.md)
- [Error Handling](./overview.md#error-handling)

## Need Help?

- [Authentication Issues](../guides/troubleshooting.md#authentication)
- [Security Contact](../reference/support.md#security)
- [API Support](../reference/support.md#api) 