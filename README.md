# ByteEnum

A high-performance, memory-optimized enum implementation for TypeScript with robust utility methods.

[![npm version](https://img.shields.io/npm/v/byte-enum.svg)](https://www.npmjs.com/package/byte-enum)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [ByteEnum](#byteenum)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Installation](#installation)
  - [Pros \& Cons](#pros--cons)
    - [Pros](#pros)
    - [Cons](#cons)
  - [Usage](#usage)
    - [Creating Enums](#creating-enums)
    - [Accessing Enum Values](#accessing-enum-values)
    - [Utility Methods](#utility-methods)
  - [Use Cases](#use-cases)
    - [Database Storage](#database-storage)
    - [API Communication](#api-communication)
    - [Large Collections](#large-collections)
  - [Advanced Usage](#advanced-usage)
    - [Custom Character Sets](#custom-character-sets)
    - [Custom Formatters](#custom-formatters)
    - [TypeScript Integration](#typescript-integration)
  - [Performance Considerations](#performance-considerations)
  - [Examples](#examples)
    - [User Profile System](#user-profile-system)
    - [Order Processing System](#order-processing-system)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

ByteEnum provides an alternative to TypeScript's built-in enums, focusing on memory efficiency while maintaining type safety and adding powerful runtime utility methods. It stores enum values as single bytes (numbers 0-255) or as single characters, dramatically reducing memory usage when storing large collections of enum values.

The implementation uses optimized data structures (Map and pre-computed arrays) to ensure lookup performance is comparable to native TypeScript enums.

## Features

- **Memory Efficiency**: Uses single bytes or characters instead of full strings
- **Type Safety**: Full TypeScript type checking and inference
- **Fast Lookups**: O(1) performance for value-to-key lookups
- **Key Normalization**: All keys are normalized to UPPERCASE for consistency
- **Case Insensitivity**: Lookups work regardless of case
- **Formatting Options**: Convert enum values to human-readable formats
- **Extensive Utilities**: Methods for validation, conversion, and display

## Installation

```bash
npm install byte-enum
# or
yarn add byte-enum
```

## Pros & Cons

### Pros

- **Memory Optimized**: Uses 1-4 bytes per value versus 8+ bytes for string enums
- **Runtime Utilities**: Provides methods not available with native TypeScript enums
- **Database Friendly**: Smaller storage requirements for enum columns
- **Network Efficient**: Reduces payload size when transmitting data
- **Fast Lookups**: Optimized for performance with Map-based implementation
- **User Friendly**: Easily convert between code values and human-readable formats
- **Type Safe**: Full TypeScript integration

### Cons

- **Not Standard**: Requires using a custom implementation instead of native TypeScript enums
- **Setup Overhead**: Slightly more code to define compared to native enums
- **Value Limits**: Limited to 256 values per enum (though this is rarely an issue)
- **Tooling**: IDEs may not provide the same level of auto-completion as with native enums

## Usage

### Creating Enums

```typescript
import { createByteEnum, createCharEnum, createAlphaNumEnum, ByteEnumValue } from 'byte-enum';

// Using byte values (0, 1, 2, etc.)
export const BodyType = createByteEnum([
  'PETITE',
  'ATHLETIC',
  'AVERAGE', 
  'MUSCULAR',
  'PLUS_SIZED',
  'CURVY'
] as const);

// Get the type for TypeScript
export type BodyTypeValue = ByteEnumValue<typeof BodyType>;

// Using character values (single characters)
export const Status = createCharEnum([
  'ACTIVE',
  'INACTIVE',
  'PENDING',
  'SUSPENDED'
] as const);

// Using alphanumeric characters (0-9, a-z, A-Z only)
export const Priority = createAlphaNumEnum([
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
] as const);
```

### Accessing Enum Values

```typescript
// Get the enum value (just like with native enums)
const bodyType = BodyType.ATHLETIC; // Returns 1

// Use in interfaces/types
interface Profile {
  name: string;
  bodyType: BodyTypeValue; // Type is number (byte)
}

// Creating an object with the enum
const profile: Profile = {
  name: "John",
  bodyType: BodyType.ATHLETIC // Storing the value 1
};
```

### Utility Methods

```typescript
// Get all possible values
const allBodyTypes = BodyType.values(); // [0, 1, 2, 3, 4, 5]

// Get all keys
const allBodyTypeKeys = BodyType.keys(); // ["PETITE", "ATHLETIC", ...]

// Check if a value is valid
if (BodyType.isValue(userInput)) {
  // userInput is a valid body type
}

// Convert from value to key
const keyName = BodyType.getKeyByValue(profile.bodyType); // "ATHLETIC"

// Get display name (formatted)
const displayName = BodyType.getDisplayName(profile.bodyType); // "Athletic"

// Custom formatting
const customName = BodyType.getFormattedName(
  profile.bodyType, 
  (key) => `Body Type: ${key.toLowerCase()}`
); // "Body Type: athletic"
```

## Use Cases

### Database Storage

```typescript
// Database schema (using TypeScript to represent)
interface UserRecord {
  id: string;
  name: string;  
  body_type: number; // Stores a single byte (0-255)
  status: string;   // Stores a single character
}

// Converting to database format
function saveUser(profile: Profile): UserRecord {
  return {
    id: profile.id,
    name: profile.name,
    body_type: profile.bodyType, // Single byte value
    status: profile.status       // Single character
  };
}
```

### API Communication

```typescript
// Compact API payload
const apiPayload = {
  users: [
    { id: "user1", name: "John", bt: BodyType.ATHLETIC, st: Status.ACTIVE },
    { id: "user2", name: "Lisa", bt: BodyType.PETITE, st: Status.PENDING }
  ]
};

// Converting from API response
function parseApiResponse(data: any[]): Profile[] {
  return data.map(item => ({
    id: item.id,
    name: item.name,
    bodyType: BodyType.isValue(item.bt) ? item.bt : BodyType.AVERAGE,
    status: Status.isValue(item.st) ? item.st : Status.PENDING
  }));
}
```

### Large Collections

```typescript
// Memory-efficient storage for millions of records
const userBodyTypes: BodyTypeValue[] = new Array(1000000);

// Fill with random values
for (let i = 0; i < userBodyTypes.length; i++) {
  userBodyTypes[i] = Math.floor(Math.random() * 6); // Random body type
}

// Memory usage: ~8MB vs ~50-100MB with string values
```

## Advanced Usage

### Custom Character Sets

```typescript
// Using specific meaningful characters
export const OrderStatus = createCharEnum([
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
], 'PPSDC'); // Maps to these specific characters
```

### Custom Formatters

```typescript
// Define a custom formatter
function genderFormatter(key: string): string {
  switch(key) {
    case 'MALE': return 'Man';
    case 'FEMALE': return 'Woman';
    case 'NON_BINARY': return 'Non-binary person';
    default: return key;
  }
}

// Use the custom formatter
const displayGender = Gender.getFormattedName(profile.gender, genderFormatter);
```

### TypeScript Integration

```typescript
// Exhaustive switch statements
function getBodyTypeDescription(bodyType: BodyTypeValue): string {
  switch (bodyType) {
    case BodyType.PETITE:
      return "Small frame";
    case BodyType.ATHLETIC:
      return "Toned muscles";
    case BodyType.AVERAGE:
      return "Balanced proportions";
    case BodyType.MUSCULAR:
      return "Strong build";
    case BodyType.PLUS_SIZED:
      return "Fuller figure";
    case BodyType.CURVY:
      return "Defined curves";
    default:
      // TypeScript ensures we've covered all cases
      const exhaustiveCheck: never = bodyType;
      return exhaustiveCheck;
  }
}
```

## Performance Considerations

ByteEnum is optimized for both memory usage and lookup performance. Here's how it compares to native TypeScript enums:

**Memory Usage** (for 1 million values):
- Native String Enum: ~15-30MB
- Native Numeric Enum: ~8MB
- ByteEnum Byte Enum: ~1-4MB
- ByteEnum Char Enum: ~1-4MB

**Lookup Performance**:
- Native Enum Direct Access: Fastest
- ByteEnum Direct Access: Nearly identical
- Native Enum Reverse Lookup: O(1) for numeric enums only
- ByteEnum Reverse Lookup: O(1) using Map-based implementation

## Examples

### User Profile System

```typescript
import { createByteEnum, createCharEnum, ByteEnumValue } from 'byte-enum';

// Define gender enum
const Gender = createByteEnum([
  'MALE',
  'FEMALE',
  'NON_BINARY',
  'OTHER',
  'PREFER_NOT_TO_SAY'
] as const);
type GenderValue = ByteEnumValue<typeof Gender>;

// Define account status enum
const AccountStatus = createCharEnum([
  'ACTIVE',
  'SUSPENDED',
  'PENDING_VERIFICATION',
  'CLOSED'
] as const);
type AccountStatusValue = ByteEnumValue<typeof AccountStatus>;

// Define user interface
interface User {
  id: string;
  name: string;
  gender: GenderValue;
  status: AccountStatusValue;
}

// Create a user
const user: User = {
  id: 'user123',
  name: 'Alex Smith',
  gender: Gender.NON_BINARY,      // Stores 2 (byte)
  status: AccountStatus.ACTIVE    // Stores a single character
};

// Display user info
function renderUserProfile(user: User): string {
  return `
    Name: ${user.name}
    Gender: ${Gender.getDisplayName(user.gender)}
    Status: ${AccountStatus.getDisplayName(user.status)}
  `;
}

// Convert for database storage
function toDbRecord(user: User) {
  return {
    id: user.id,
    name: user.name,
    gender_code: user.gender,            // Store as byte
    account_status_code: user.status     // Store as character
  };
}

// UI dropdown options
function getGenderOptions() {
  return Gender.values().map(value => ({
    value,
    label: Gender.getDisplayName(value)
  }));
}
```

### Order Processing System

```typescript
import { createCharEnum, ByteEnumValue } from 'byte-enum';

// Define order status with custom characters
const OrderStatus = createCharEnum([
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
  'REFUNDED'
], 'PSDCXRF'); // Meaningful character codes
type OrderStatusValue = ByteEnumValue<typeof OrderStatus>;

// Define permitted status transitions
const allowedTransitions: Record<OrderStatusValue, OrderStatusValue[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.RETURNED],
  [OrderStatus.DELIVERED]: [OrderStatus.RETURNED],
  [OrderStatus.CANCELLED]: [OrderStatus.REFUNDED],
  [OrderStatus.RETURNED]: [OrderStatus.REFUNDED],
  [OrderStatus.REFUNDED]: []
};

// Use in business logic
function canTransitionStatus(current: OrderStatusValue, target: OrderStatusValue): boolean {
  return allowedTransitions[current]?.includes(target) || false;
}

// Usage
const order = {
  id: 'ORD-123',
  status: OrderStatus.PROCESSING // 'S' character
};

// Check if transition is valid
if (canTransitionStatus(order.status, OrderStatus.SHIPPED)) {
  order.status = OrderStatus.SHIPPED;
}

// Display order status
console.log(`Order status: ${OrderStatus.getDisplayName(order.status)}`);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.