"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Drawer = DialogPrimitive.Root
const DrawerTrigger = DialogPrimitive.Trigger
const DrawerClose = DialogPrimitive.Close

const DrawerContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed top-0 left-0 bottom-0 z-50 m-0 h-full w-64 rounded-none bg-white p-6 shadow-lg animate-in slide-in-from-left duration-300",
                className
            )}
            {...props}
        >
            {/* ✅ This satisfies Radix's requirement */}
            <DialogPrimitive.Title className="sr-only">
                Menu
            </DialogPrimitive.Title>

            {children}

            <DialogPrimitive.Close className="absolute right-4 top-4">
                <X className="h-5 w-5" />
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
))
DrawerContent.displayName = "DrawerContent"

export { Drawer, DrawerTrigger, DrawerContent, DrawerClose }

