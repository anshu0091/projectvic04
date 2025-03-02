# UI Components

## Navigation

- [← Back to Features](./overview.md)
- [↑ Up to Index](./index.md)
- [→ Next: State Management](./state-management.md)

## Component Library

### Core Components

#### Button Component

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  children
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${
        loading ? 'loading' : ''
      }`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner size="small" /> : children}
    </button>
  );
};

// Usage Example:
<Button
  variant="primary"
  size="medium"
  onClick={() => handleClick()}
>
  Submit
</Button>
```

#### Input Component

```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number';
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type,
  label,
  value,
  onChange,
  error,
  placeholder,
  required
}) => {
  return (
    <div className="input-container">
      <label className="input-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input ${error ? 'input-error' : ''}`}
        required={required}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

// Usage Example:
<Input
  type="email"
  label="Email Address"
  value={email}
  onChange={setEmail}
  required
  placeholder="Enter your email"
/>
```

### Data Display

#### Table Component

```typescript
interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  sortable?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export const Table = <T extends Record<string, any>>({
  data,
  columns,
  sortable,
  pagination
}: TableProps<T>) => {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map(column => (
              <th
                key={column.key}
                onClick={() => sortable && column.onSort?.()}
              >
                {column.title}
                {sortable && column.sortable && (
                  <SortIcon direction={column.sortDirection} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map(column => (
                <td key={column.key}>
                  {column.render
                    ? column.render(row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <Pagination
          current={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={pagination.onPageChange}
        />
      )}
    </div>
  );
};

// Usage Example:
<Table
  data={users}
  columns={[
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email' },
    {
      key: 'actions',
      title: 'Actions',
      render: (row) => (
        <Button onClick={() => handleEdit(row)}>Edit</Button>
      )
    }
  ]}
  sortable
  pagination={{
    page: currentPage,
    pageSize: 10,
    total: totalUsers,
    onPageChange: handlePageChange
  }}
/>
```

### Feedback Components

#### Modal Component

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="modal-content">{children}</div>
        {footer && (
          <div className="modal-footer">{footer}</div>
        )}
      </div>
    </div>
  );
};

// Usage Example:
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Confirm Action"
  footer={(
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onConfirm}>
        Confirm
      </Button>
    </>
  )}
>
  Are you sure you want to proceed?
</Modal>
```

### Navigation Components

#### Tabs Component

```typescript
interface Tab {
  key: string;
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange
}) => {
  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`tab ${
              activeTab === tab.key ? 'active' : ''
            }`}
            onClick={() => onChange(tab.key)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs.find(tab => tab.key === activeTab)?.content}
      </div>
    </div>
  );
};

// Usage Example:
<Tabs
  tabs={[
    {
      key: 'details',
      title: 'Details',
      content: <UserDetails user={user} />
    },
    {
      key: 'history',
      title: 'History',
      content: <UserHistory userId={user.id} />
    }
  ]}
  activeTab={currentTab}
  onChange={setCurrentTab}
/>
```

## Form Components

### Form Validation

```typescript
interface FormField {
  name: string;
  label: string;
  type: string;
  validation?: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => boolean;
  };
}

export const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  initialValues
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    fields.forEach(field => {
      if (field.validation?.required && !values[field.name]) {
        newErrors[field.name] = 'This field is required';
      }
      // Add other validation checks
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map(field => (
        <Input
          key={field.name}
          type={field.type}
          label={field.label}
          value={values[field.name]}
          onChange={(value) => 
            setValues({ ...values, [field.name]: value })
          }
          error={errors[field.name]}
          required={field.validation?.required}
        />
      ))}
      <Button type="submit" variant="primary">
        Submit
      </Button>
    </form>
  );
};
```

## Styling Guidelines

### Theme Configuration

```typescript
export const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    info: '#5AC8FA',
    gray: {
      100: '#F2F2F7',
      200: '#E5E5EA',
      300: '#D1D1D6',
      400: '#C7C7CC',
      500: '#AEAEB2'
    }
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  }
};
```

## Accessibility

### ARIA Support

```typescript
export const AccessibleComponent: React.FC<Props> = ({
  label,
  description,
  error
}) => {
  const id = useId();
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return (
    <div
      role="region"
      aria-labelledby={id}
      aria-describedby={
        error ? errorId : description ? descriptionId : undefined
      }
    >
      <label id={id}>{label}</label>
      {description && (
        <div id={descriptionId}>{description}</div>
      )}
      {error && (
        <div
          id={errorId}
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
};
```

## Quick Links

- [Component API Reference](../api/components.md)
- [Styling Guide](../guides/styling.md)
- [Accessibility Guidelines](../guides/accessibility.md)

## Need Help?

- [Component Issues](../guides/troubleshooting.md#components)
- [UI Support](../reference/support.md#ui)
- [Contributing Guidelines](../reference/contributing.md) 