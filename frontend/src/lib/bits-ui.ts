/**
 * Bits UI Configuration and Utilities
 * This file contains configuration and utility functions for Bits UI components
 */

import { tv, type VariantProps } from "tailwind-variants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Button component variants using tailwind-variants
 */
export const buttonVariants = tv({
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-8 px-3 py-1.5",
      sm: "h-7 rounded-md px-2.5 py-1",
      lg: "h-9 rounded-md px-6 py-2",
      icon: "h-8 w-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;

/**
 * Input component variants
 */
export const inputVariants = tv({
  base: "flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    variant: {
      default: "",
      error: "border-destructive focus-visible:ring-destructive",
    },
    size: {
      default: "h-8",
      sm: "h-7",
      lg: "h-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

/**
 * Card component variants
 */
export const cardVariants = tv({
  base: "rounded-lg border bg-card text-card-foreground shadow-sm",
});

/**
 * Badge component variants
 */
export const badgeVariants = tv({
  base: "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  variants: {
    variant: {
      default:
        "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      secondary:
        "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Progress component variants
 */
export const progressVariants = tv({
  base: "relative h-3 w-full overflow-hidden rounded-full bg-secondary",
  variants: {
    size: {
      default: "h-3",
      sm: "h-1.5",
      lg: "h-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/**
 * Common Bits UI component styles and configurations
 */
export const bitsConfig = {
  // Dialog/Modal configurations
  dialog: {
    overlay:
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    content:
      "fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-3 border bg-background p-4 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
  },

  // Tooltip configurations
  tooltip: {
    content:
      "z-50 overflow-hidden rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  },

  // Dropdown Menu configurations
  dropdownMenu: {
    content:
      "z-50 min-w-[7rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    item: "relative flex cursor-default select-none items-center rounded-sm px-2 py-1 text-xs outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  },
};
