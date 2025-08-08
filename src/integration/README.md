# Integration Tests

## Overview
Integration tests validate the translation library in a real NestJS application context, testing actual HTTP requests, decorator behavior, and service lifecycle.

## Test Categories

### 1. Module Integration
- NestJS module initialization
- Service dependency injection
- Configuration loading and validation

### 2. Decorator Integration  
- Real HTTP request context
- JWT token extraction
- Parameter extraction from requests
- Error handling in HTTP context

### 3. Service Integration
- Translation with real parameters
- Pluralization in real scenarios
- Date formatting with actual locales
- RTL text detection

### 4. Error Handling Integration
- Missing translation keys
- Invalid locales
- Malformed JWT tokens
- File system errors

### 5. Performance Integration
- Caching behavior
- Concurrent request handling
- Memory usage under load

## Coverage Impact
Integration tests **DO count towards coverage** and provide:
- Different code path execution
- Real NestJS lifecycle testing
- HTTP request/response validation
- Error handling in real context

## Running Integration Tests
```bash
npm test -- --testPathPattern="integration"
```

## Benefits
1. **Real-world validation** of decorator behavior
2. **HTTP context testing** for request/response flows
3. **Performance testing** under realistic conditions
4. **Error handling** in actual NestJS context
5. **Configuration validation** with real file system
