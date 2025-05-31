"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "w-screen",
        "text-sm font-medium text-center text-gray-500 dark:text-gray-400",
        "border-b border-gray-200 dark:border-gray-700",
        "flex flex-wrap -mb-px",
        className
      )}
      {...props}
    />
  )
}


function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-block p-4 border-b-2 border-transparent rounded-t-lg me-2 transition-colors",
        "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300",
        "data-[state=active]:text-black data-[state=active]:border-black",
        "dark:data-[state=active]:text-black dark:data-[state=active]:border-black",
        "disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("mt-4", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
