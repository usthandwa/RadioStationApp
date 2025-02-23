import React from 'react';
import { cn } from "@/src/lib/utils"
import { AlertTriangle as AlertIcon, AlertCircle } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border p-4",
          {
            "border-gray-200 bg-gray-50 text-gray-900": variant === "default",
            "border-red-600 bg-red-50 text-red-600": variant === "destructive"
          },
          className
        )}
        {...props}
      >
        {variant === "destructive" && (
          <AlertCircle className="h-4 w-4 absolute right-4 top-4" />
        )}
        {variant === "default" && (
          <AlertIcon className="h-4 w-4 absolute right-4 top-4" />
        )}
        {children}
      </div>
    )
  }
)

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))

Alert.displayName = "Alert"
AlertTitle.displayName = "AlertTitle"
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }