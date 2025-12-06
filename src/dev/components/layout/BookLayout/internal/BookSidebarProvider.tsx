/**
 * BookSidebarProvider - 侧边栏上下文提供者（internal）
 */
import * as React from "react"
import { useIsMobile } from "../../../../shadcn/hooks/use-mobile.ts"
import { cn } from "../../../../shadcn/lib/utils.ts"
import { TooltipProvider } from "../../../../shadcn/components/ui/tooltip.tsx"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

export function useBookSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useBookSidebar must be used within a BookSidebarProvider.")
  }
  return context
}

export function BookSidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  openMobile: openMobileProp,
  onOpenMobileChange: setOpenMobileProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  openMobile?: boolean
  onOpenMobileChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [_openMobile, _setOpenMobile] = React.useState(false)
  const openMobile = openMobileProp ?? _openMobile
  const setOpenMobile = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(openMobile) : value
      if (setOpenMobileProp) {
        setOpenMobileProp(openState)
      } else {
        _setOpenMobile(openState)
      }
    },
    [setOpenMobileProp, openMobile]
  )

  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={{ "--sidebar-width": SIDEBAR_WIDTH, "--sidebar-width-icon": SIDEBAR_WIDTH_ICON, ...style } as React.CSSProperties}
          className={cn("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

// no external re-exports; internal only


