"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error = false,
      errorMessage,
      required = false,
      helperText,
      leftIcon,
      rightIcon,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
            {required && <span className="text-primary ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full px-4 py-2.5 border rounded-xl",
              "bg-white dark:bg-stone-900 text-slate-900 dark:text-slate-100",
              "placeholder:text-slate-400",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "transition-all duration-200",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-stone-300 dark:border-stone-700 focus:ring-primary",
              className
            )}
            aria-invalid={error}
            aria-describedby={
              errorMessage ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

        {helperText && !error && (
          <p id={`${inputId}-help`} className="mt-1.5 text-xs text-slate-500">
            {helperText}
          </p>
        )}

        {error && errorMessage && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-600 flex items-center gap-1"
            role="alert"
          >
            <span>⚠️</span>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
