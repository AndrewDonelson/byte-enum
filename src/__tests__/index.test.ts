// File: src/__tests__/index.test.ts

import { 
    createByteEnum, 
    createCharEnum, 
    createAlphaNumEnum, 
  } from '../index';
  
  describe('index.ts exports', () => {
    test('exports all necessary functions and types', () => {
      // Test that all functions are properly exported
      expect(typeof createByteEnum).toBe('function');
      expect(typeof createCharEnum).toBe('function');
      expect(typeof createAlphaNumEnum).toBe('function');
      
      // Create instances to verify exports work correctly
      const byteEnum = createByteEnum(['A', 'B'] as const);
      const charEnum = createCharEnum(['X', 'Y'] as const);
      const alphaNumEnum = createAlphaNumEnum(['FIRST', 'SECOND'] as const);
      
      // Basic validation of the created enums
      expect(byteEnum.A).toBe(0);
      expect(charEnum.X).toBe(String.fromCharCode(0));
      expect(alphaNumEnum.FIRST).toBe('0');
      
      // Instead of using type annotations that might cause errors,
      // verify the value types at runtime
      expect(typeof byteEnum.A).toBe('number');
      expect(typeof charEnum.X).toBe('string');
      
      // Verify that utility methods are properly exported
      expect(typeof byteEnum.values).toBe('function');
      expect(typeof byteEnum.keys).toBe('function');
      expect(typeof byteEnum.isValue).toBe('function');
      expect(typeof byteEnum.isKey).toBe('function');
      expect(typeof byteEnum.getKeyByValue).toBe('function');
      expect(typeof byteEnum.getDisplayName).toBe('function');
      expect(typeof byteEnum.getFormattedName).toBe('function');
    });
  });