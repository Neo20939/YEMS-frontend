"use client";

import React, { forwardRef, useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  className?: string;
  clearable?: boolean;
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, debounceMs = 300, placeholder = "Search...", className, clearable = true, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState("");

    const isControlled = props.value !== undefined;
    const value = isControlled ? props.value : internalValue;

    const setValue = useCallback((newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
    }, [isControlled]);

    // Debounced search
    const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (onSearch) {
        debounceRef.current = setTimeout(() => {
          onSearch(newValue);
        }, debounceMs);
      }
    }, [onSearch, debounceMs, setValue]);

    const handleClear = useCallback(() => {
      setValue("");
      if (onSearch) {
        onSearch("");
      }
      props.onClear?.();
    }, [onSearch, setValue, props]);

    React.useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, []);

    return (
      <div className={cn("relative", className)}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-2.5 border border-stone-300 dark:border-stone-700 rounded-xl",
            "bg-white dark:bg-stone-900 text-slate-900 dark:text-slate-100",
            "placeholder:text-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "transition-all duration-200"
          )}
          aria-label="Search"
          {...props}
        />
        {clearable && value && (
          <Button
            type="button"
            variant="ghost"
            size="iconSm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
