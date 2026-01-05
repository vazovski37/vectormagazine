import { type ClassValue, clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";
import { type VariantProps, cva } from "class-variance-authority";

/**
 * Combines class names using clsx and tailwind-merge
 * Handles conditional classes and resolves Tailwind conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Type helper for component props
 */
export type ComponentProps<T extends keyof React.JSX.IntrinsicElements> =
  React.ComponentPropsWithoutRef<T>;

/**
 * Re-export cva and VariantProps for component variant definitions
 */
export { cva, type VariantProps };
