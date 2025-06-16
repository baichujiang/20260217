"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 传入 0–100 的数值 */
  value: number
  /** 可选：进度条高度，sm=0.5rem, md=1rem, lg=1.5rem */
  size?: 'sm' | 'md' | 'lg'
  /** 可选：指示条额外 class，用于自定义颜色等 */
  indicatorClassName?: string
}

export function Progress({
  value,
  size = 'md',
  className,
  indicatorClassName,
  ...props
}: ProgressProps) {
  // 根据 size 选择不同高度
  const heightClass = {
    sm: 'h-2',  // 0.5rem
    md: 'h-4',  // 1rem
    lg: 'h-6'   // 1.5rem
  }[size]

  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative w-full bg-gray-200 rounded-full overflow-hidden",
        heightClass,
        className
      )}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full bg-green-600 transition-all",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}
