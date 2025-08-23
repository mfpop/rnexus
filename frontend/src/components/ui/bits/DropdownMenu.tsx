/**
 * Enhanced DropdownMenu Component using native React
 * Provides better keyboard navigation and accessibility
 * Updated: Removed all debugging console logs for production use
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface DropdownMenuContextType {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.MutableRefObject<HTMLElement | null>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | undefined>(undefined)

const DropdownMenu: React.FC<{ children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }> = ({
  children,
  open: controlledOpen,
  onOpenChange
}) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ children, onClick, asChild = false, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Update the context with our trigger ref
  useEffect(() => {
    if (context && triggerRef.current) {
      context.triggerRef.current = triggerRef.current
    }
  }, [context, triggerRef.current])

  if (asChild) {
    const child = children as React.ReactElement<any>
    return React.cloneElement(child, {
      ref: (node: any) => {
        triggerRef.current = node
        // Handle the child's ref if it exists
        const childRef = (child as any).ref
        if (childRef) {
          if (typeof childRef === 'function') childRef(node)
          else childRef.current = node
        }
        // Update context immediately when ref is set
        if (context && node) {
          context.triggerRef.current = node
        }
      },
      'data-dropdown-trigger': true,
      onClick: (e: React.MouseEvent<Element, MouseEvent>) => {
        context?.setOpen(!context.open)
        onClick?.(e as React.MouseEvent<HTMLButtonElement, MouseEvent>)
        // Call the original onClick if it exists
        if (child.props.onClick) {
          child.props.onClick(e)
        }
      },
      ...props
    })
  }

  return (
    <button
      ref={(node) => {
        triggerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
        // Update context immediately when ref is set
        if (context && node) {
          context.triggerRef.current = node
        }
      }}
      data-dropdown-trigger
      onClick={(e) => {
        context?.setOpen(!context.open)
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div role="group">{children}</div>
)

const DropdownMenuSub = DropdownMenu

const DropdownMenuRadioGroup: React.FC<{ children: React.ReactNode; value?: string; onValueChange?: (value: string) => void }> = ({
  children
}) => (
  <div role="radiogroup">{children}</div>
)

const DropdownMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex cursor-pointer select-none items-center rounded-sm px-2 py-1 text-xs outline-none hover:bg-gray-100 focus:bg-gray-100",
      inset && "pl-6",
      className
    )}
    role="menuitem"
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-3 w-3" />
  </div>
))
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger"

const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute left-full top-0 min-w-28 bg-white border border-gray-200 rounded-md shadow-md p-1",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName = "DropdownMenuSubContent"

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'center' | 'end' }
>(({ className, children, align = 'start', ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext)
  const contentRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // Throttled position updater using requestAnimationFrame
  const rafRef = useRef<number | null>(null)
  const lastPositionRef = useRef<{ top: number; left: number } | null>(null)

  const updatePosition = useCallback(() => {
    if (rafRef.current !== null) return

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null

      if (!contentRef.current || !context?.triggerRef.current) {
        return
      }

      const triggerElement = context.triggerRef.current
      const triggerRect = triggerElement.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()

      const { innerWidth: windowWidth, innerHeight: windowHeight } = window

      let top = triggerRect.bottom + 8
      let left = triggerRect.left

      if (align === 'end') {
        left = triggerRect.right - contentRect.width
      } else if (align === 'center') {
        left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
      }

      // Boundary checks
      left = Math.max(16, left)
      left = Math.min(windowWidth - contentRect.width - 16, left)
      if (top + contentRect.height > windowHeight - 16) {
        top = triggerRect.top - contentRect.height - 8
      }
      top = Math.max(16, top)

      const last = lastPositionRef.current
      // Only update state if position actually changed to avoid re-renders
      if (!last || last.top !== top || last.left !== left) {
        lastPositionRef.current = { top, left }
        setPosition({ top, left })
      }
    })
  }, [align, context?.triggerRef])

  useEffect(() => {
    if (context?.open) {
      const timer = setTimeout(updatePosition, 10)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [context?.open, updatePosition])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking on the trigger itself
      if (context?.triggerRef.current && context.triggerRef.current.contains(event.target as Node)) {
        return
      }

      // Don't close if clicking inside the dropdown content
      if (contentRef.current && contentRef.current.contains(event.target as Node)) {
        return
      }

      // Only close if clicking outside both trigger and content
      context?.setOpen(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        context?.setOpen(false)
      }
    }

    if (context?.open) {
      // Add a small delay to prevent immediate closing
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        // Add resize and scroll listeners for dynamic repositioning
        window.addEventListener('resize', updatePosition)
        window.addEventListener('scroll', updatePosition, true)
      }, 100)

      return () => {
        clearTimeout(timer)
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition, true)
        if (rafRef.current !== null) {
          window.cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
      }
    }

    return undefined
  }, [context?.open, updatePosition])

  if (!context?.open) return null

  return (
    <div
      ref={(node) => {
        contentRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      className={cn(
        "fixed z-[9999] min-w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 pointer-events-auto",
        className
      )}
      style={{
        top: position.top,
        left: position.left,
        position: 'fixed',
        zIndex: 9999,
      }}
      {...props}
    >
      {children}
    </div>
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    inset?: boolean
  }
>(({ className, inset, children, onClick, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext)

  return (
    <div
      ref={ref}
      className={cn(
        "flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-xs outline-none hover:bg-gray-100 focus:bg-gray-100 transition-all duration-150 mx-1",
        inset && "pl-8",
        className
      )}
      onClick={(e) => {
        context?.setOpen(false)
        onClick?.(e)
      }}
      role="menuitem"
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { checked?: boolean; onCheckedChange?: (checked: boolean) => void }
>(({ className, children, checked, onCheckedChange, onClick, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-xs outline-none hover:bg-gray-100 focus:bg-gray-100 transition-all duration-150 mx-1",
        className
      )}
      onClick={(e) => {
        onCheckedChange?.(!checked)
        onClick?.(e)
      }}
      role="menuitemcheckbox"
      aria-checked={checked}
      {...props}
    >
      <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-3 w-3" />}
      </span>
      {children}
    </div>
  )
})
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

const DropdownMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, onClick, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-xs outline-none hover:bg-gray-100 focus:bg-gray-100 transition-all duration-150 mx-1",
      className
    )}
    onClick={onClick}
    role="menuitemradio"
    {...props}
  >
    <span className="absolute left-2.5 flex h-3 w-3 items-center justify-center">
      <Circle className="h-2.5 w-2.5 fill-current" />
    </span>
    {children}
  </div>
))
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-3 py-2 text-xs font-medium text-gray-700 mx-1",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-200 border-0", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-wide opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
