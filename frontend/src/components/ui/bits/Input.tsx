/**
 * Enhanced Input Component using Bits UI
 * Provides better form handling and validation
 */

import React from "react";
import { inputVariants } from "../../../lib/bits-ui";
import { cn } from "../../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "error";
  inputSize?: "default" | "sm" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, variant = "default", inputSize = "default", ...props },
    ref,
  ) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size: inputSize }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
