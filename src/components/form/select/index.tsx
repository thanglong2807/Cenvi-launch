import React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {label}
          </label>
        )}
        <select
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm",
            "ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50",
            "dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950",
            "dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        >
          <option value="">Chọn nguồn khách hàng</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select; 