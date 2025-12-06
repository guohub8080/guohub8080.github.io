import * as React from "react"
import { cn } from "../../lib/utils.ts"

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("shrink-0 bg-border h-[1px]", className)}
    {...props}
  />
))
Separator.displayName = "Separator"

export { Separator }

