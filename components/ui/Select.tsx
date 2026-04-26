"use client";

import React, { forwardRef, useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { SearchInput } from "./SearchInput";

export interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  required?: boolean;
  clearable?: boolean;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      onChange,
      placeholder = "Select...",
      searchable = false,
      searchPlaceholder = "Search...",
      className,
      disabled = false,
      error = false,
      errorMessage,
      label,
      required = false,
      clearable = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedValue, setSelectedValue] = useState<string | number | undefined>(
      value ?? defaultValue
    );
    const buttonRef = useRef<HTMLButtonElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : selectedValue;

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          optionsRef.current &&
          !optionsRef.current.contains(event.target as Node) &&
          !buttonRef.current?.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchQuery("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sync controlled value
    useEffect(() => {
      if (isControlled) {
        setSelectedValue(value);
      }
    }, [value, isControlled]);

    const handleSelect = (optionValue: string | number) => {
      const option = options.find((o) => o.value === optionValue);
      if (option?.disabled) return;

      if (!isControlled) {
        setSelectedValue(optionValue);
      }
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchQuery("");
    };

    const handleClear = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!isControlled) {
        setSelectedValue(undefined);
      }
      onChange?.(undefined as unknown as string | number);
    };

    const selectedOption = options.find((o) => o.value === currentValue);
    const filteredOptions = searchable
      ? options.filter((o) =>
          o.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
            {required && <span className="text-primary ml-1">*</span>}
          </label>
        )}

        <div className="relative" ref={optionsRef}>
          <Button
            ref={buttonRef || ref}
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              "w-full h-11 px-3 py-2 flex items-center justify-between",
              "border-stone-300 dark:border-stone-700",
              "bg-white dark:bg-stone-900",
              "text-slate-900 dark:text-slate-100",
              "hover:bg-stone-50 dark:hover:bg-stone-800",
              error && "border-red-500 focus:ring-red-500",
              !error && "focus:ring-2 focus:ring-primary",
              className
            )}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label={label}
          >
            <span className="flex-1 text-left truncate">
              {selectedOption ? (
                <span className="block">
                  {selectedOption.label}
                  {selectedOption.description && (
                    <span className="text-xs text-slate-500 block">
                      {selectedOption.description}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-slate-400">{placeholder}</span>
              )}
            </span>
            <div className="flex items-center gap-2">
              {clearable && selectedOption && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear(e)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation()
                      handleClear(e as unknown as React.MouseEvent)
                    }
                  }}
                  className="h-6 w-6 inline-flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Clear selection"
                >
                  ×
                </span>
              )}
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-slate-400 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </div>
          </Button>

          {isOpen && (
            <div
              className="absolute z-50 w-full mt-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg max-h-60 overflow-hidden"
              role="listbox"
            >
              {searchable && (
                <div className="p-2 border-b border-stone-200 dark:border-stone-800">
                  <SearchInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    autoFocus
                  />
                </div>
              )}

              <div className="overflow-y-auto max-h-48">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">
                    No results found
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      disabled={option.disabled}
                      className={cn(
                        "w-full px-4 py-2.5 text-left flex items-center gap-3",
                        "hover:bg-stone-100 dark:hover:bg-stone-800",
                        option.disabled && "opacity-50 cursor-not-allowed",
                        currentValue === option.value && "bg-primary/10 text-primary"
                      )}
                      role="option"
                      aria-selected={currentValue === option.value}
                    >
                      <span
                        className={cn(
                          "w-5 h-5 flex items-center justify-center",
                          currentValue === option.value ? "text-primary" : "text-transparent"
                        )}
                      >
                        <Check className="w-4 h-4" />
                      </span>
                      <span>
                        <span className="block font-medium">{option.label}</span>
                        {option.description && (
                          <span className="text-xs text-slate-500 block">
                            {option.description}
                          </span>
                        )}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {error && errorMessage && (
          <p className="mt-1.5 text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
