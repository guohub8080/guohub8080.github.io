import * as React from "react"
import { CalendarIcon, Clock, Plus, Minus, X } from "lucide-react"
import dayjs from "dayjs"

import { cn } from "../../lib/utils.ts"
import { Button } from "./button.tsx"
import { Calendar } from "./calendar.tsx"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover.tsx"
import { Slider } from "./slider.tsx"

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
}

export function DateTimePicker({
  value,
  onChange,
  disabled,
  placeholder = "选择日期和时间"
}: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [hour, setHour] = React.useState<number>(
    value ? parseInt(dayjs(value).format("HH")) : 0
  )
  const [minute, setMinute] = React.useState<number>(
    value ? parseInt(dayjs(value).format("mm")) : 0
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
      setHour(parseInt(dayjs(value).format("HH")))
      setMinute(parseInt(dayjs(value).format("mm")))
    }
  }, [value])

  const updateDateTime = (newDate: Date, newHour: number, newMinute: number) => {
    const updatedDate = new Date(newDate)
    updatedDate.setHours(newHour, newMinute, 0, 0)
    setDate(updatedDate)
    onChange?.(updatedDate)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      updateDateTime(selectedDate, hour, minute)
    }
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

  const pickerContent = (
    <div className="flex flex-col md:flex-row">
      {/* 日历 */}
      <div className={isMobile ? "p-2" : ""}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </div>
      
      {/* 时间选择 */}
      <div className={cn(
        "p-4 border-border",
        isMobile ? "w-full border-t" : "w-[280px] border-l"
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

            <div className="grid grid-cols-3 gap-2 mt-4">
              {/* 第一行：-1小时、-30分、-20分 */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date()
                  const target = new Date(now.getTime() - 60 * 60 * 1000) // -1小时
                  const targetHour = target.getHours()
                  const targetMinute = target.getMinutes()
                  setHour(targetHour)
                  setMinute(targetMinute)
                  if (date) updateDateTime(date, targetHour, targetMinute)
                }}
                type="button"
              >
                -1小时
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date()
                  const target = new Date(now.getTime() - 30 * 60 * 1000) // -30分钟
                  const targetHour = target.getHours()
                  const targetMinute = target.getMinutes()
                  setHour(targetHour)
                  setMinute(targetMinute)
                  if (date) updateDateTime(date, targetHour, targetMinute)
                }}
                type="button"
              >
                -30分
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date()
                  const target = new Date(now.getTime() - 20 * 60 * 1000) // -20分钟
                  const targetHour = target.getHours()
                  const targetMinute = target.getMinutes()
                  setHour(targetHour)
                  setMinute(targetMinute)
                  if (date) updateDateTime(date, targetHour, targetMinute)
                }}
                type="button"
              >
                -20分
              </Button>
              
              {/* 第二行：-10分、现在、+10分 */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date()
                  const target = new Date(now.getTime() - 10 * 60 * 1000) // -10分钟
                  const targetHour = target.getHours()
                  const targetMinute = target.getMinutes()
                  setHour(targetHour)
                  setMinute(targetMinute)
                  if (date) updateDateTime(date, targetHour, targetMinute)
                }}
                type="button"
              >
                -10分
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date()
                  const nowHour = now.getHours()
                  const nowMinute = now.getMinutes()
                  setHour(nowHour)
                  setMinute(nowMinute)
                  if (date) updateDateTime(date, nowHour, nowMinute)
                }}
                type="button"
              >
                现在
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date()
                  const target = new Date(now.getTime() + 10 * 60 * 1000) // +10分钟
                  const targetHour = target.getHours()
                  const targetMinute = target.getMinutes()
                  setHour(targetHour)
                  setMinute(targetMinute)
                  if (date) updateDateTime(date, targetHour, targetMinute)
                }}
                type="button"
              >
                +10分
              </Button>
              
              {/* 第三行：+20分、+30分、+1小时 */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date()
                  const target = new Date(now.getTime() + 20 * 60 * 1000) // +20分钟
                  const targetHour = target.getHours()
                  const targetMinute = target.getMinutes()
                  setHour(targetHour)
                  setMinute(targetMinute)
                  if (date) updateDateTime(date, targetHour, targetMinute)
                }}
                type="button"
              >
                +20分
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date()
                  const target = new Date(now.getTime() + 30 * 60 * 1000) // +30分钟
                  const targetHour = target.getHours()
                  const targetMinute = target.getMinutes()
                  setHour(targetHour)
                  setMinute(targetMinute)
                  if (date) updateDateTime(date, targetHour, targetMinute)
                }}
                type="button"
              >
                +30分
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date()
                  const target = new Date(now.getTime() + 60 * 60 * 1000) // +1小时
                  const targetHour = target.getHours()
                  const targetMinute = target.getMinutes()
                  setHour(targetHour)
                  setMinute(targetMinute)
                  if (date) updateDateTime(date, targetHour, targetMinute)
                }}
                type="button"
              >
                +1小时
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
    </div>
  )

  if (isMobile) {
    return (
      <>
        <Button
          variant={"outline"}
          disabled={disabled}
          onClick={() => setOpen(true)}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            dayjs(date).format("YYYY-MM-DD HH:mm")
          ) : (
            <span>{placeholder}</span>
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
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            dayjs(date).format("YYYY-MM-DD HH:mm")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {pickerContent}
      </PopoverContent>
    </Popover>
  )
}

