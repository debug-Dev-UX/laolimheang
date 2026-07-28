/**
 * Utility to merge class names (cn helper - shadcn style)
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
