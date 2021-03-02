import { isArray } from 'lodash';

/**
 * Convert a string or string array value to a string array
 */
export function ensureArray(val: string | string[]): string[] {
  return isArray(val) ? (val as string[]) : [val as string];
}
