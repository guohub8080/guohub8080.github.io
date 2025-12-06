import * as React from "react"
import { cn } from "../../lib/utils.ts"

export interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "muted"
  size?: "default" | "sm"
}

export function Item({ className, variant = "default", size = "default", ...props }: ItemProps) {
  return (
    <div
      className={cn(
        "group w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm",
        variant === "muted" && "bg-muted/40",
        variant === "outline" && "bg-transparent",
        size === "sm" ? "px-3 py-2" : "p-4",
        className
      )}
      {...props}
    />
  )
}

export function ItemHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-3", className)} {...props} />
}

export function ItemFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-3", className)} {...props} />
}

export function ItemMedia({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "icon" | "image" }) {
  return (
    <div
      className={cn(
        "shrink-0 mr-4 flex items-center justify-center",
        variant === "icon" && "w-11 h-11 [&>svg]:w-full [&>svg]:h-full",
        variant === "image" && "w-12 h-12 [&>img]:w-full [&>img]:h-full rounded-full overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

export function ItemContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 min-w-0", className)} {...props} />
}

export function ItemTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm font-medium text-gray-900 truncate dark:text-white", className)} {...props} />
}

export function ItemDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-gray-500 truncate dark:text-gray-400", className)} {...props} />
}

export function ItemActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex items-center text-sm text-foreground", className)} {...props} />
}

export function ItemGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("w-full max-w-5xl mx-auto p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm sm:p-6", className)} {...props} />
  )
}

export function ItemSeparator({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn("my-2 border-gray-200 dark:border-gray-700", className)} {...props} />
}


