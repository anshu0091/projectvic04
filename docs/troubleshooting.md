# Troubleshooting Guide

## Common Issues

### Build Issues

1. **Next.js Build Failures**
   ```bash
   Error: Error occurred prerendering page "/auth/callback"
   ```
   **Solution:**
   - Add `export const dynamic = 'force-dynamic'` to the route handler
   - Check for usage of request-time APIs in static pages
   - Verify environment variables are properly set

2. **TypeScript Errors**
   ```typescript
   Type '...' is not assignable to type '...'
   ```
   **Solution:**
   - Check type definitions
   - Update @types packages
   - Verify TypeScript configuration
   - Add necessary type assertions

### Runtime Issues

1. **Authentication Problems**
   ```typescript
   Error: JWT token expired
   ```
   **Solution:**
   - Check token expiration time
   - Verify refresh token flow
   - Clear local storage
   - Re-authenticate user

2. **API Connection Issues**
   ```typescript
   Error: Failed to fetch
   ```
   **Solution:**
   - Check API endpoint URLs
   - Verify network connectivity
   - Check CORS configuration
   - Validate API keys

## Performance Issues

### Frontend Performance

1. **Slow Page Load**
   ```typescript
   // Use React DevTools Profiler
   <Profiler id="Navigation" onRender={onRenderCallback}>
     <Navigation />
   </Profiler>
   ```
   **Solution:**
   - Implement code splitting
   - Optimize images
   - Enable caching
   - Reduce bundle size

2. **Memory Leaks**
   ```typescript
   // Check for cleanup in useEffect
   useEffect(() => {
     const subscription = subscribe();
     return () => subscription.unsubscribe();
   }, []);
   ```
   **Solution:**
   - Clean up event listeners
   - Unsubscribe from subscriptions
   - Clear intervals/timeouts
   - Use React DevTools Memory tab

### Backend Performance

1. **Slow API Response**
   ```typescript
   // Add request timing
   const start = performance.now();
   const result = await apiCall();
   const duration = performance.now() - start;
   console.log(`API call took ${duration}ms`);
   ```
   **Solution:**
   - Optimize database queries
   - Implement caching
   - Use connection pooling
   - Add request timeout

## Deployment Issues

### Vercel Deployment

1. **Build Failures**
   ```bash
   Error: No Output Directory named "build" found after build completed
   ```
   **Solution:**
   - Check build output directory
   - Verify build command
   - Check environment variables
   - Review build logs

2. **Runtime Errors**
   ```bash
   Error: Cannot find module '...'
   ```
   **Solution:**
   - Check dependencies installation
   - Verify package.json
   - Clear deployment cache
   - Rebuild and redeploy

## Database Issues

### Supabase Connection

1. **Connection Errors**
   ```typescript
   Error: Connection terminated unexpectedly
   ```
   **Solution:**
   - Check connection string
   - Verify credentials
   - Check network access
   - Review connection limits

2. **Query Errors**
   ```typescript
   Error: relation "table" does not exist
   ```
   **Solution:**
   - Check table existence
   - Verify schema migrations
   - Review SQL syntax
   - Check permissions

## State Management

### Redux Issues

1. **State Updates Not Reflecting**
   ```typescript
   // Debug with Redux DevTools
   const store = configureStore({
     reducer: rootReducer,
     devTools: process.env.NODE_ENV !== 'production',
   });
   ```
   **Solution:**
   - Check action dispatching
   - Verify reducer logic
   - Clear persisted state
   - Review middleware

2. **Performance Issues**
   ```typescript
   // Use selector memoization
   const selectTodos = createSelector(
     state => state.todos,
     todos => todos.filter(todo => !todo.completed)
   );
   ```
   **Solution:**
   - Implement memoization
   - Optimize selectors
   - Review re-render triggers
   - Check state structure

## UI Issues

### Styling Problems

1. **CSS Conflicts**
   ```css
   /* Use more specific selectors */
   .component-name__element--modifier {
     /* styles */
   }
   ```
   **Solution:**
   - Check CSS specificity
   - Review class naming
   - Use CSS modules
   - Check style precedence

2. **Layout Issues**
   ```typescript
   // Use layout debugging
   <div style={{ outline: '1px solid red' }}>
     {/* content */}
   </div>
   ```
   **Solution:**
   - Check responsive design
   - Verify flexbox/grid usage
   - Review media queries
   - Test cross-browser

## Environment Issues

### Development Environment

1. **Hot Reload Not Working**
   ```bash
   # Clear development cache
   rm -rf .next
   npm run dev
   ```
   **Solution:**
   - Restart development server
   - Clear cache
   - Check file watchers
   - Review webpack configuration

2. **Package Conflicts**
   ```bash
   npm ls package-name
   ```
   **Solution:**
   - Check package versions
   - Review peer dependencies
   - Clear node_modules
   - Regenerate lock file

## Debugging Tools

### Browser Tools

1. **Chrome DevTools**
   ```typescript
   // Add debug points
   debugger;
   console.log('Debug info:', { data });
   ```
   - Network tab
   - Performance tab
   - Memory tab
   - Sources tab

2. **React DevTools**
   - Components tab
   - Profiler tab
   - Debug hooks
   - Inspect props/state

### Server Tools

1. **Node.js Debugging**
   ```bash
   NODE_OPTIONS='--inspect' npm run dev
   ```
   - Use Chrome DevTools
   - Check server logs
   - Monitor memory usage
   - Profile performance

## Error Reporting

### Error Tracking

1. **Client-Side Errors**
   ```typescript
   window.onerror = (message, source, lineno, colno, error) => {
     logError({ message, source, lineno, colno, error });
   };
   ```
   - Browser console
   - Error boundaries
   - Analytics events
   - Error logging

2. **Server-Side Errors**
   ```typescript
   process.on('uncaughtException', (error) => {
     logger.error('Uncaught Exception:', error);
     process.exit(1);
   });
   ```
   - Server logs
   - Error monitoring
   - Alert systems
   - Error recovery

## Recovery Procedures

### Data Recovery

1. **Database Restore**
   - Backup restoration
   - Point-in-time recovery
   - Data verification
   - Service restart

2. **State Recovery**
   - Clear local storage
   - Reset Redux store
   - Clear cache
   - Refresh tokens 

## Advanced Debugging Scenarios

### Memory Leaks

1. **React Component Memory Leaks**
   ```typescript
   // Problem: Memory leak in useEffect
   useEffect(() => {
     const subscription = eventEmitter.subscribe();
     // Missing cleanup
   }, []);

   // Solution: Proper cleanup
   useEffect(() => {
     const subscription = eventEmitter.subscribe();
     return () => subscription.unsubscribe();
   }, []);
   ```

2. **Memory Profiling**
   ```typescript
   // Memory profiling utility
   export class MemoryProfiler {
     private snapshots: Map<string, HeapSnapshot> = new Map();

     takeSnapshot(label: string) {
       const snapshot = process.memoryUsage();
       this.snapshots.set(label, {
         ...snapshot,
         timestamp: Date.now()
       });
     }

     compareSnapshots(label1: string, label2: string) {
       const snap1 = this.snapshots.get(label1);
       const snap2 = this.snapshots.get(label2);
       return {
         heapDiff: snap2.heapUsed - snap1.heapUsed,
         rss: snap2.rss - snap1.rss,
         timeElapsed: snap2.timestamp - snap1.timestamp
       };
     }
   }
   ```

### Performance Debugging

1. **React Render Debugging**
   ```typescript
   // Debug component re-renders
   const DebugRenders = ({ componentName }: { componentName: string }) => {
     const renderCount = useRef(0);
     
     useEffect(() => {
       renderCount.current++;
       console.log(`${componentName} rendered ${renderCount.current} times`);
     });

     return null;
   };

   // Usage
   const MyComponent = () => (
     <>
       <DebugRenders componentName="MyComponent" />
       {/* Component content */}
     </>
   );
   ```

2. **Performance Tracing**
   ```typescript
   export class PerformanceTracer {
     private traces: Map<string, PerformanceTrace[]> = new Map();

     startTrace(name: string) {
       const existing = this.traces.get(name) || [];
       existing.push({
         start: performance.now(),
         events: []
       });
       this.traces.set(name, existing);
     }

     addEvent(traceName: string, eventName: string) {
       const traces = this.traces.get(traceName);
       if (!traces?.length) return;

       const currentTrace = traces[traces.length - 1];
       currentTrace.events.push({
         name: eventName,
         timestamp: performance.now()
       });
     }

     endTrace(name: string) {
       const traces = this.traces.get(name);
       if (!traces?.length) return;

       const currentTrace = traces[traces.length - 1];
       currentTrace.end = performance.now();
       
       this.analyzeTrace(currentTrace);
     }

     private analyzeTrace(trace: PerformanceTrace) {
       const duration = trace.end - trace.start;
       if (duration > 100) {
         console.warn('Slow operation detected', {
           duration,
           events: trace.events
         });
       }
     }
   }
   ```

### Network Issues

1. **API Request Debugging**
   ```typescript
   export class NetworkDebugger {
     private requests: Map<string, RequestInfo> = new Map();

     interceptRequest(url: string, options: RequestInit) {
       const requestId = crypto.randomUUID();
       this.requests.set(requestId, {
         url,
         options,
         startTime: Date.now()
       });

       return fetch(url, {
         ...options,
         headers: {
           ...options.headers,
           'X-Request-ID': requestId
         }
       }).then(response => {
         this.handleResponse(requestId, response);
         return response;
       }).catch(error => {
         this.handleError(requestId, error);
         throw error;
       });
     }

     private handleResponse(requestId: string, response: Response) {
       const request = this.requests.get(requestId);
       const duration = Date.now() - request.startTime;

       if (duration > 1000) {
         console.warn('Slow request detected', {
           url: request.url,
           duration,
           status: response.status
         });
       }
     }
   }
   ```

2. **WebSocket Debugging**
   ```typescript
   export class WebSocketDebugger {
     private connections: Map<string, WSConnection> = new Map();

     attachToWebSocket(ws: WebSocket, name: string) {
       const connectionId = crypto.randomUUID();
       
       this.connections.set(connectionId, {
         name,
         startTime: Date.now(),
         messageCount: 0,
         errors: []
       });

       ws.addEventListener('message', event => {
         this.handleMessage(connectionId, event);
       });

       ws.addEventListener('error', error => {
         this.handleError(connectionId, error);
       });

       ws.addEventListener('close', () => {
         this.handleClose(connectionId);
       });
     }

     private handleMessage(connectionId: string, event: MessageEvent) {
       const connection = this.connections.get(connectionId);
       connection.messageCount++;

       if (connection.messageCount > 1000) {
         console.warn('High message volume detected', {
           connection: connection.name,
           messageCount: connection.messageCount
         });
       }
     }
   }
   ```

### State Management Issues

1. **Redux Debugging**
   ```typescript
   export const debugMiddleware = store => next => action => {
     const prevState = store.getState();
     const result = next(action);
     const nextState = store.getState();

     console.group(action.type);
     console.log('Previous State:', prevState);
     console.log('Action:', action);
     console.log('Next State:', nextState);
     console.groupEnd();

     // Detect large state changes
     const stateDiff = deepDiff(prevState, nextState);
     if (Object.keys(stateDiff).length > 10) {
       console.warn('Large state change detected', {
         action: action.type,
         changes: stateDiff
       });
     }

     return result;
   };
   ```

2. **Context Debugging**
   ```typescript
   export function createDebugContext<T>(name: string) {
     const Context = React.createContext<T>(null);
     
     return {
       Provider: ({ children, value }: PropsWithChildren<{ value: T }>) => {
         const prevValue = useRef(value);
         
         useEffect(() => {
           const changes = deepDiff(prevValue.current, value);
           if (Object.keys(changes).length > 0) {
             console.log(`${name} Context Changed:`, changes);
           }
           prevValue.current = value;
         }, [value]);

         return (
           <Context.Provider value={value}>
             {children}
           </Context.Provider>
         );
       },
       useContext: () => {
         const context = React.useContext(Context);
         if (context === null) {
           throw new Error(`use${name}Context must be used within a ${name}Provider`);
         }
         return context;
       }
     };
   }
   ```

### Database Issues

1. **Query Performance Analysis**
   ```typescript
   export class QueryAnalyzer {
     private queries: Map<string, QueryInfo> = new Map();

     async analyzeQuery(queryId: string, query: string, params: any[]) {
       const startTime = performance.now();
       try {
         const result = await executeQuery(query, params);
         this.recordQuerySuccess(queryId, startTime, result);
         return result;
       } catch (error) {
         this.recordQueryError(queryId, startTime, error);
         throw error;
       }
     }

     private recordQuerySuccess(queryId: string, startTime: number, result: any) {
       const duration = performance.now() - startTime;
       const rowCount = Array.isArray(result) ? result.length : 1;

       if (duration > 100 || rowCount > 1000) {
         console.warn('Slow or large query detected', {
           queryId,
           duration,
           rowCount
         });
       }
     }
   }
   ```

2. **Connection Pool Monitoring**
   ```typescript
   export class ConnectionMonitor {
     private poolStats: PoolStats = {
       active: 0,
       idle: 0,
       waiting: 0
     };

     updateStats(stats: PoolStats) {
       this.poolStats = stats;

       if (stats.waiting > 5) {
         console.warn('High connection wait count', {
           waiting: stats.waiting,
           active: stats.active,
           idle: stats.idle
         });
       }

       if (stats.active / (stats.active + stats.idle) > 0.8) {
         console.warn('Pool capacity nearly reached', {
           utilizationRate: stats.active / (stats.active + stats.idle)
         });
       }
     }
   }
   ``` 