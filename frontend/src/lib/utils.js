import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility for merging tailwind classes with clsx logic.
 * Essential for shadcn/ui component dynamic styling.
 * 
 * @param {...string} inputs - CSS Class arguments.
 * @returns {string} Merged class string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
