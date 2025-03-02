# Data Protection

## Navigation

- [← Back to Security Overview](./overview.md)
- [↑ Up to Index](./index.md)
- [→ Next: Compliance](./compliance.md)

## Data Security Overview

### Data Classification

```typescript
export enum DataSensitivity {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  CONFIDENTIAL = 'CONFIDENTIAL',
  RESTRICTED = 'RESTRICTED'
}

interface DataClassification {
  level: DataSensitivity;
  handlers: string[];
  retention: number; // days
  encryption: boolean;
}

const dataClassifications: Record<DataSensitivity, DataClassification> = {
  PUBLIC: {
    level: DataSensitivity.PUBLIC,
    handlers: ['all'],
    retention: 365,
    encryption: false
  },
  INTERNAL: {
    level: DataSensitivity.INTERNAL,
    handlers: ['employees'],
    retention: 730,
    encryption: true
  },
  CONFIDENTIAL: {
    level: DataSensitivity.CONFIDENTIAL,
    handlers: ['authorized'],
    retention: 1825,
    encryption: true
  },
  RESTRICTED: {
    level: DataSensitivity.RESTRICTED,
    handlers: ['security-cleared'],
    retention: 3650,
    encryption: true
  }
};
```

## Encryption

### Data at Rest

```typescript
export class DataEncryption {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly saltLength = 64;

  async encrypt(data: Buffer, key: Buffer): Promise<EncryptedData> {
    const iv = crypto.randomBytes(this.ivLength);
    const salt = crypto.randomBytes(this.saltLength);
    
    const derivedKey = await this.deriveKey(key, salt);
    const cipher = crypto.createCipheriv(this.algorithm, derivedKey, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(data),
      cipher.final()
    ]);
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv,
      salt,
      authTag
    };
  }

  async decrypt(
    encryptedData: EncryptedData,
    key: Buffer
  ): Promise<Buffer> {
    const derivedKey = await this.deriveKey(key, encryptedData.salt);
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      derivedKey,
      encryptedData.iv
    );
    
    decipher.setAuthTag(encryptedData.authTag);
    
    return Buffer.concat([
      decipher.update(encryptedData.encrypted),
      decipher.final()
    ]);
  }
}
```

### Data in Transit

```typescript
export const secureTransportConfig = {
  ssl: {
    enabled: true,
    minVersion: 'TLSv1.3',
    cipherSuites: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256'
    ],
    preferServerCiphers: true,
    sessionTimeout: 600
  },
  headers: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': "default-src 'self'"
  }
};
```

## Data Access Control

### Access Control Lists (ACL)

```typescript
export class AccessControl {
  private acl: Map<string, Permission[]> = new Map();

  grantAccess(
    resource: string,
    role: string,
    permissions: Permission[]
  ) {
    const existing = this.acl.get(resource) || [];
    this.acl.set(resource, [
      ...existing,
      ...permissions.map(p => ({ role, ...p }))
    ]);
  }

  checkPermission(
    resource: string,
    role: string,
    action: string
  ): boolean {
    const permissions = this.acl.get(resource) || [];
    return permissions.some(p => 
      p.role === role && p.action === action
    );
  }
}
```

## Data Masking

### Sensitive Data Masking

```typescript
export class DataMasker {
  static maskPII(data: string, type: 'email' | 'phone' | 'card'): string {
    switch (type) {
      case 'email':
        return this.maskEmail(data);
      case 'phone':
        return this.maskPhone(data);
      case 'card':
        return this.maskCard(data);
      default:
        return data;
    }
  }

  private static maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    const maskedLocal = `${local[0]}${'*'.repeat(local.length - 2)}${local.slice(-1)}`;
    return `${maskedLocal}@${domain}`;
  }

  private static maskPhone(phone: string): string {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }

  private static maskCard(card: string): string {
    return card.replace(/(\d{4})\d{8}(\d{4})/, '$1********$2');
  }
}
```

## Data Retention

### Retention Policy

```typescript
export class RetentionPolicy {
  async enforceRetention(data: StoredData): Promise<void> {
    const classification = dataClassifications[data.sensitivity];
    const retentionDays = classification.retention;
    
    const age = this.calculateAge(data.createdAt);
    if (age > retentionDays) {
      await this.archiveOrDelete(data);
    }
  }

  private async archiveOrDelete(data: StoredData): Promise<void> {
    if (data.archiveRequired) {
      await this.archiveData(data);
    } else {
      await this.secureDelete(data);
    }
  }
}
```

## Audit Logging

### Security Events

```typescript
export class SecurityAuditLogger {
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    const logEntry = {
      timestamp: new Date(),
      eventType: event.type,
      severity: event.severity,
      actor: event.actor,
      resource: event.resource,
      action: event.action,
      outcome: event.outcome,
      metadata: {
        ip: event.ip,
        userAgent: event.userAgent,
        location: event.location
      }
    };

    await this.persistAuditLog(logEntry);
  }

  private async persistAuditLog(
    entry: AuditLogEntry
  ): Promise<void> {
    // Implement secure, immutable storage
    await this.secureStorage.append('audit-log', entry);
  }
}
```

## Breach Detection

### Intrusion Detection

```typescript
export class IntrusionDetection {
  private readonly rules: SecurityRule[] = [
    {
      type: 'rate-limit',
      threshold: 100,
      windowMs: 60000,
      action: 'block'
    },
    {
      type: 'pattern-match',
      patterns: ['SQL_INJECTION', 'XSS', 'CSRF'],
      action: 'alert'
    },
    {
      type: 'anomaly',
      baseline: 'normal-behavior',
      deviation: 2,
      action: 'investigate'
    }
  ];

  async detectThreats(
    activity: UserActivity
  ): Promise<ThreatAssessment> {
    const violations = await Promise.all(
      this.rules.map(rule => this.checkRule(rule, activity))
    );

    return {
      threatLevel: this.calculateThreatLevel(violations),
      violations: violations.filter(v => v.detected),
      recommendedActions: this.getRecommendedActions(violations)
    };
  }
}
```

## Data Recovery

### Backup Strategy

```typescript
export class DataBackupStrategy {
  private readonly backupSchedule = {
    full: '0 0 * * 0',    // Weekly
    differential: '0 0 * * 1-6', // Daily
    transaction: '0 */1 * * *'   // Hourly
  };

  async performBackup(type: BackupType): Promise<BackupResult> {
    const backup = await this.createBackup(type);
    await this.encryptBackup(backup);
    await this.validateBackup(backup);
    await this.storeBackup(backup);

    return {
      id: backup.id,
      type: backup.type,
      timestamp: backup.timestamp,
      size: backup.size,
      checksum: backup.checksum
    };
  }
}
```

## Compliance Monitoring

### GDPR Compliance

```typescript
export class GDPRCompliance {
  async processDataRequest(
    request: DataSubjectRequest
  ): Promise<void> {
    switch (request.type) {
      case 'access':
        await this.handleAccessRequest(request);
        break;
      case 'erasure':
        await this.handleErasureRequest(request);
        break;
      case 'portability':
        await this.handlePortabilityRequest(request);
        break;
      case 'rectification':
        await this.handleRectificationRequest(request);
        break;
    }
  }
}
```

## Quick Links

- [Security Overview](./overview.md)
- [Compliance Guide](./compliance.md)
- [Incident Response](./incident-response.md)

## Need Help?

- [Security Issues](../guides/troubleshooting.md#security)
- [Emergency Contact](../reference/support.md#security-emergency)
- [Compliance Support](../reference/support.md#compliance) 