/**
 * ByteEnum - Memory-Efficient Enum Utilities for TypeScript
 * 
 * A high-performance, memory-optimized enum implementation with
 * type safety and runtime utility methods.
 * 
 * Features:
 * - Minimal memory footprint using byte values or single characters
 * - High-performance lookups using Map-based implementation
 * - Type safety with TypeScript
 * - Runtime utility methods for validation and display
 * - Case-insensitive key handling (all keys normalized to UPPERCASE)
 * 
 * @license MIT
 * File: src/byteEnum.ts
 */

/**
 * Creates a memory-efficient enum using byte values (0-255)
 * 
 * @param keys - Array of enum keys as string literals
 * @returns Enum object with utility methods
 */
export function createByteEnum<T extends string>(keys: readonly T[]) {
  type OriginalKey = T;
  type UppercaseKey = Uppercase<T>;
  type EnumValue = number;
  
  // Create the enum object with keys mapping to sequential byte values
  // Convert all keys to uppercase
  const enumObject = keys.reduce((acc, key, index) => {
    if (index > 255) {
      throw new Error('Byte enum cannot have more than 256 values');
    }
    // Store the key in uppercase regardless of input format
    const upperKey = key.toUpperCase() as Uppercase<typeof key>;
    acc[upperKey] = index;
    return acc;
  }, {} as Record<UppercaseKey, EnumValue>);

  // Create lookup maps for faster performance
  const valueToKeyMap = new Map<EnumValue, UppercaseKey>();
  const keysList: UppercaseKey[] = [];
  const valuesList: EnumValue[] = [];
  
  // Populate the lookup maps and cached arrays
  Object.entries(enumObject).forEach(([key, value]) => {
    valueToKeyMap.set(value as EnumValue, key as UppercaseKey);
    keysList.push(key as UppercaseKey);
    valuesList.push(value as EnumValue);
  });

  // Add utility functions
  const utilities = {
    /**
     * Get an array of all possible enum values
     */
    values: () => valuesList,

    /**
     * Get an array of all enum keys
     */
    keys: () => keysList,

    /**
     * Check if a value is a valid enum value
     */
    isValue: (value: number): value is EnumValue => 
      valueToKeyMap.has(value),

    /**
     * Check if a key is a valid enum key
     */
    isKey: (key: string): key is UppercaseKey => 
      enumObject.hasOwnProperty(key.toUpperCase()),

    /**
     * Get the key for a given value (optimized with Map lookup)
     */
    getKeyByValue: (value: EnumValue): UppercaseKey | undefined => 
      valueToKeyMap.get(value),

    /**
     * Get the display name for a value
     */
    getDisplayName: (value: EnumValue): string => {
      const key = utilities.getKeyByValue(value);
      if (!key) return '';
      // Convert SNAKE_CASE to Title Case
      return key.toString().toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    
    /**
     * Get a formatted display name with custom formatter
     */
    getFormattedName: (value: EnumValue, formatter: (key: string) => string): string => {
      const key = utilities.getKeyByValue(value);
      if (!key) return '';
      return formatter(key);
    }
  };

  // Combine the enum with its utilities
  return Object.assign(enumObject, utilities) as TinyByteEnum<UppercaseKey, EnumValue>;
}

// Type definitions
export type TinyByteEnum<K extends string, V extends number> = {
  [key in K]: V;
} & {
  values: () => V[];
  keys: () => K[];
  isValue: (value: number) => value is V;
  isKey: (key: string) => key is K;
  getKeyByValue: (value: V) => K | undefined;
  getDisplayName: (value: V) => string;
  getFormattedName: (value: V, formatter: (key: string) => string) => string;
};

// Helper type to ensure uppercase keys are properly handled in TypeScript
type UppercaseKeys<T extends readonly string[]> = {
  [K in T[number] as Uppercase<K>]: K;
};

/**
 * Creates a memory-efficient enum using single byte characters (0-255)
 * 
 * @param keys - Array of enum keys as string literals
 * @param customCharSet - Optional custom character set to use (defaults to all 256 byte values)
 * @returns Enum object with utility methods
 */
export function createCharEnum<T extends string>(
  keys: readonly T[], 
  customCharSet?: string
) {
  // We use UppercaseKey type to ensure type safety with uppercase keys
  type OriginalKey = T;
  type UppercaseKey = Uppercase<T>;
  type EnumValue = string; // Single character
  
  // Define the character set with all 256 possible byte values by default
  let charSet = customCharSet;
  
  if (!charSet) {
    // Generate all 256 characters (0-255) as the default charset
    charSet = '';
    for (let i = 0; i < 256; i++) {
      charSet += String.fromCharCode(i);
    }
  }
  
  // Create the enum object with keys mapping to character values
  // Convert all keys to uppercase
  const enumObject = keys.reduce((acc, key, index) => {
    if (index >= charSet.length) {
      throw new Error(`Enum has too many values (max: ${charSet.length})`);
    }
    // Store the key in uppercase for case-insensitive access
    const upperKey = key.toUpperCase() as Uppercase<typeof key>;
    acc[upperKey] = charSet[index];
    return acc;
  }, {} as Record<UppercaseKey, EnumValue>);

  // Create lookup maps for faster performance
  const valueToKeyMap = new Map<EnumValue, UppercaseKey>();
  const keysList: UppercaseKey[] = [];
  const valuesList: EnumValue[] = [];
  
  // Populate the lookup maps and cached arrays
  Object.entries(enumObject).forEach(([key, value]) => {
    valueToKeyMap.set(value as EnumValue, key as UppercaseKey);
    keysList.push(key as UppercaseKey);
    valuesList.push(value as EnumValue);
  });

  // Add the utility functions
  const utilities = {
    values: () => valuesList,
    keys: () => keysList,
    isValue: (value: string): value is EnumValue => 
      valueToKeyMap.has(value),
    isKey: (key: string): key is UppercaseKey => 
      enumObject.hasOwnProperty(key.toUpperCase()),
    getKeyByValue: (value: EnumValue): UppercaseKey | undefined => 
      valueToKeyMap.get(value),
    getDisplayName: (value: EnumValue): string => {
      const key = utilities.getKeyByValue(value);
      if (!key) return '';
      return key.toString().toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    getFormattedName: (value: EnumValue, formatter: (key: string) => string): string => {
      const key = utilities.getKeyByValue(value);
      if (!key) return '';
      return formatter(key);
    }
  };

  return Object.assign(enumObject, utilities) as TinyCharEnum<UppercaseKey, EnumValue>;
}

/**
 * Creates a memory-efficient enum using alphanumeric characters (0-9, a-z, A-Z)
 * This is provided for compatibility with systems that require printable characters.
 * 
 * @param keys - Array of enum keys as string literals
 * @returns Enum object with utility methods
 */
export function createAlphaNumEnum<T extends string>(keys: readonly T[]) {
  // Define the character set: 0-9, a-z, A-Z (62 characters)
  const charSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return createCharEnum(keys, charSet);
}

export type TinyCharEnum<K extends string, V extends string> = {
  [key in K]: V;
} & {
  values: () => V[];
  keys: () => K[];
  isValue: (value: string) => value is V;
  isKey: (key: string) => key is K;
  getKeyByValue: (value: V) => K | undefined;
  getDisplayName: (value: V) => string;
  getFormattedName: (value: V, formatter: (key: string) => string) => string;
};

// Type helper to get the value type from an enum object
export type TinyEnumValue<T> = T extends TinyByteEnum<any, infer V> ? V : 
                               T extends TinyCharEnum<any, infer V> ? V : never;