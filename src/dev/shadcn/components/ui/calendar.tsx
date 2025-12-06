import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { zhCN } from "date-fns/locale"

import { cn } from "../../lib/utils.ts"
import { buttonVariants } from "./button.tsx"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  month: monthProp,
  onMonthChange,
  fromMonth,
  toMonth,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    monthProp ?? new Date()
  )

  React.useEffect(() => {
    if (monthProp) {
      setCurrentMonth(monthProp)
    }
  }, [monthProp])

  const updateMonth = React.useCallback(
    (month: Date) => {
      setCurrentMonth(month)
      onMonthChange?.(month)
    },
    [onMonthChange]
  )

  const goToPreviousMonth = React.useCallback(() => {
    const previous = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    )
    if (fromMonth) {
      const limit = new Date(fromMonth.getFullYear(), fromMonth.getMonth(), 1)
      if (previous < limit) {
        return
      }
    }
    updateMonth(previous)
  }, [currentMonth, fromMonth, updateMonth])

  const goToNextMonth = React.useCallback(() => {
    const next = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    )
    if (toMonth) {
      const limit = new Date(toMonth.getFullYear(), toMonth.getMonth(), 1)
      if (next > limit) {
        return
      }
    }
    updateMonth(next)
  }, [currentMonth, toMonth, updateMonth])

  const isPrevDisabled = React.useMemo(() => {
    if (!fromMonth) return false
    const previous = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    )
    const limit = new Date(fromMonth.getFullYear(), fromMonth.getMonth(), 1)
    return previous < limit
  }, [currentMonth, fromMonth])

  const isNextDisabled = React.useMemo(() => {
    if (!toMonth) return false
    const next = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    )
    const limit = new Date(toMonth.getFullYear(), toMonth.getMonth(), 1)
    return next > limit
  }, [currentMonth, toMonth])

  const mergedClassNames = React.useMemo(() => ({
    months:
      "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
    month: "space-y-4 w-full",
    month_caption: "hidden",
    caption_label: "hidden",
    nav: "hidden",
    button_previous: cn(
      buttonVariants({ variant: "outline" }),
      "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100"
    ),
    button_next: cn(
      buttonVariants({ variant: "outline" }),
      "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100"
    ),
    month_grid: "w-full border-collapse space-y-1",
    weekdays: "flex",
    weekday:
      "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
    week: "flex w-full mt-2",
    day: "h-10 w-10 text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
    day_button: cn(
      buttonVariants({ variant: "ghost" }),
      "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-transparent aria-selected:hover:bg-primary"
    ),
    range_end: "day-range-end rounded-r-md",
    range_start: "day-range-start rounded-l-md",
    selected:
      "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary focus:text-primary-foreground",
    today: "bg-accent text-accent-foreground font-semibold",
    outside:
      "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
    disabled: "text-muted-foreground opacity-50",
    range_middle:
      "aria-selected:bg-primary/20 aria-selected:text-foreground rounded-none",
    hidden: "invisible",
    ...classNames,
  }), [classNames])

  const monthLabel = `${currentMonth.getFullYear()}年${(currentMonth.getMonth() + 1)
    .toString()
    .padStart(2, "0")}月`

  return (
    <div className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100",
            isPrevDisabled && "opacity-30 hover:opacity-30 cursor-not-allowed"
          )}
          disabled={isPrevDisabled}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">{monthLabel}</div>
        <button
          type="button"
          onClick={goToNextMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100",
            isNextDisabled && "opacity-30 hover:opacity-30 cursor-not-allowed"
          )}
          disabled={isNextDisabled}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <DayPicker
        showOutsideDays={showOutsideDays}
        locale={zhCN}
        weekStartsOn={0}
        formatters={{
          formatWeekdayName: (date) => {
            const days = ['日', '一', '二', '三', '四', '五', '六']
            return days[date.getDay()]
          }
        }}
        month={currentMonth}
        onMonthChange={updateMonth}
        fromMonth={fromMonth}
        toMonth={toMonth}
        className="pt-0"
        classNames={mergedClassNames}
        components={{
          Chevron: ({ orientation }) => {
            const Icon = orientation === "left" ? ChevronLeft : ChevronRight
            return <Icon className="h-4 w-4" />
          },
        }}
        {...props}
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

