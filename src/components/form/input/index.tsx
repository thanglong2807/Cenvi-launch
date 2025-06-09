import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  flex?:string;
  classNameLabel?:string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({flex, className, label,classNameLabel, error, ...props }, ref) => {
    return (
      <div className={` ${flex} flex-col items-end` }>
        <div className="flex items-center w-full">
          {label && (
            <label className={`${classNameLabel} block text-sm font-medium text-gray-700  mb-1`}>
              {label}
            </label>
          )}
          <input
            className={cn(
              "flex h-10 w-full rounded-md bg-white px-3 py-2 text-sm",
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
          />
      </div>
          {error && (
            <p className="mt-1 text-sm text-red-500">{error}</p>
          )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input; 