import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDefinedValue(value: any, defaultValue: any) {
  return value !== undefined ? value : defaultValue;
}

export function capitalise(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
