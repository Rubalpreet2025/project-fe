import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-700 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-green-600 text-white shadow hover:bg-green-700": variant === "primary",
            "bg-blue-600 text-white shadow hover:bg-blue-700": variant === "default",
            "bg-yellow-500 text-white shadow hover:bg-yellow-600": variant === "secondary",
            "bg-red-600 text-white shadow hover:bg-red-700": variant === "danger",
            "border border-input bg-transparent shadow-sm hover:bg-slate-100": variant === "outline",
            "hover:bg-slate-100 hover:text-slate-900": variant === "ghost",
            "text-blue-600 underline-offset-4 hover:underline": variant === "link",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-9 px-4 py-2": size === "md",
            "h-10 rounded-md px-8 text-base": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
