"use client"

import * as React from "react"
import { Calendar } from "./calendar.tsx"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover.tsx"
import { Button } from "./button.tsx"
import { Calendar as CalendarIcon, Clock, Plus, Minus, X } from "lucide-react"
import { Slider } from "./slider.tsx"
import { cn } from "../../lib/utils.ts"
import guoDT from "../../../utils/utDateTime/guoDT.ts"

interface DeadlinePickerProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder?: string
}

export function DeadlinePicker({
  value,
  onChange,
  placeholder = "选择截止日期",
}: DeadlinePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [hour, setHour] = React.useState<number>(
    value ? value.getHours() : 23
  )
  const [minute, setMinute] = React.useState<number>(
    value ? value.getMinutes() : 59
  )
  const [open, setOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  React.useEffect(() => {
    if (value) {
      setDate(value)
      setHour(value.getHours())
      setMinute(value.getMinutes())
    }
  }, [value])

  const updateDateTime = (newDate: Date, newHour: number, newMinute: number) => {
    const updatedDate = new Date(newDate)
    updatedDate.setHours(newHour, newMinute, 0, 0)
    setDate(updatedDate)
    onChange(updatedDate)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      updateDateTime(selectedDate, hour, minute)
    }
  }

  const setQuickDeadline = (days: number) => {
    const now = new Date()
    const deadline = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    deadline.setHours(23, 59, 59, 0) // 设置为当天结束
    setDate(deadline)
    setHour(23)
    setMinute(59)
    onChange(deadline)
    setOpen(false)
  }

  const handleHourChange = (value: number[]) => {
    const newHour = value[0]
    setHour(newHour)
    if (date) {
      updateDateTime(date, newHour, minute)
    }
  }

  const handleMinuteChange = (value: number[]) => {
    const newMinute = value[0]
    setMinute(newMinute)
    if (date) {
      updateDateTime(date, hour, newMinute)
    }
  }

  const adjustHour = (delta: number) => {
    const newHour = (hour + delta + 24) % 24
    setHour(newHour)
    if (date) {
      updateDateTime(date, newHour, minute)
    }
  }

  const adjustMinute = (delta: number) => {
    const newMinute = (minute + delta + 60) % 60
    setMinute(newMinute)
    if (date) {
      updateDateTime(date, hour, newMinute)
    }
  }

  const setQuickTime = (hours: number, minutes: number) => {
    setHour(hours)
    setMinute(minutes)
    if (date) {
      updateDateTime(date, hours, minutes)
    }
  }

  const pickerContent = (
    <div className="flex flex-col md:flex-row">
      {/* 左侧：快捷选项 */}
      <div className={cn(
        "space-y-2 border-border",
        isMobile ? "w-full border-b p-2" : "w-[140px] border-r p-3"
      )}>
        <div className={cn(
          "text-xs font-medium text-muted-foreground",
          isMobile ? "mb-2" : "mb-3"
        )}>快捷选项</div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => setQuickDeadline(0)}
            >
              今天
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => setQuickDeadline(1)}
            >
              明天
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => setQuickDeadline(3)}
            >
              3天后
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => setQuickDeadline(7)}
            >
              1周后
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => setQuickDeadline(14)}
            >
              2周后
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => setQuickDeadline(30)}
            >
              1个月后
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => setQuickDeadline(90)}
            >
              3个月后
            </Button>
      </div>

      {/* 中间：日历 */}
      <div className={cn(
        isMobile && "w-full flex justify-center p-2"
      )}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </div>

      {/* 右侧：时间调节器 */}
      {date && (
        <div className={cn(
          "border-border",
          isMobile ? "w-full border-t p-2" : "w-[280px] border-l p-4"
        )}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">时间</span>
                </div>
                <div className="text-3xl font-bold tracking-wider">
                  {hour.toString().padStart(2, '0')}
                  <span className="text-muted-foreground">:</span>
                  {minute.toString().padStart(2, '0')}
                </div>
              </div>
              
              <div className="space-y-4">
                {/* 小时滑块 */}
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground block">小时</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => adjustHour(-1)}
                      type="button"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="flex-1">
                      <Slider
                        value={[hour]}
                        onValueChange={handleHourChange}
                        min={0}
                        max={23}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => adjustHour(1)}
                      type="button"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-right">
                      {hour}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground px-[36px]">
                    <span>0</span>
                    <span>12</span>
                    <span>23</span>
                  </div>
                </div>

                {/* 分钟滑块 */}
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground block">分钟</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => adjustMinute(-1)}
                      type="button"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="flex-1">
                      <Slider
                        value={[minute]}
                        onValueChange={handleMinuteChange}
                        min={0}
                        max={59}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => adjustMinute(1)}
                      type="button"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-right">
                      {minute}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground px-[36px]">
                    <span>0</span>
                    <span>30</span>
                    <span>59</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickTime(10, 0)}
                  type="button"
                >
                  10:00
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickTime(12, 0)}
                  type="button"
                >
                  12:00
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickTime(14, 0)}
                  type="button"
                >
                  14:00
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickTime(17, 0)}
                  type="button"
                >
                  17:00
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickTime(18, 0)}
                  type="button"
                >
                  18:00
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickTime(23, 59)}
                  type="button"
                >
                  23:59
                </Button>
              </div>

          {/* 窄屏关闭按钮 */}
          {isMobile && (
            <div className="mt-4">
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={() => setOpen(false)}
                type="button"
              >
                确定
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            guoDT.getFormattedDayjs(guoDT.getDayjs(date.getTime()), "YYYY-MM-DD HH:mm")
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>

        {/* 移动端：全屏模态 */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="relative bg-background border rounded-lg shadow-lg w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto pt-8">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 z-10 h-7 w-7 opacity-50 hover:opacity-100"
                onClick={() => setOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
              {pickerContent}
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    /* 桌面端：Popover */
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            guoDT.getFormattedDayjs(guoDT.getDayjs(date.getTime()), "YYYY-MM-DD HH:mm")
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {pickerContent}
      </PopoverContent>
    </Popover>
  )
}

