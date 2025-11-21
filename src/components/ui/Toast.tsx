'use client'

import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-[420px]',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-3 overflow-hidden rounded-lg border-2 p-4 pr-10 shadow-xl backdrop-blur-sm transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full data-[state=open]:fade-in-0',
  {
    variants: {
      variant: {
        default: 'border-gray-300 bg-white/95 dark:bg-gray-800/95 text-gray-900 dark:text-gray-100 dark:border-gray-600',
        destructive:
          'border-red-500 bg-red-50/95 dark:bg-red-950/95 text-red-900 dark:text-red-100',
        success: 'border-green-500 bg-green-50/95 dark:bg-green-950/95 text-green-900 dark:text-green-100',
        warning: 'border-yellow-500 bg-yellow-50/95 dark:bg-yellow-950/95 text-yellow-900 dark:text-yellow-100',
        info: 'border-blue-500 bg-blue-50/95 dark:bg-blue-950/95 text-blue-900 dark:text-blue-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 opacity-70 hover:opacity-100 transition-all hover:bg-gray-200/50 dark:hover:bg-gray-700/50 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold leading-tight', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-95 leading-snug', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

// Toast hook and context
interface ToastState {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: VariantProps<typeof toastVariants>['variant']
  duration?: number
  icon?: React.ReactNode
  open?: boolean
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type Action =
  | {
      type: 'ADD_TOAST'
      toast: ToastState
    }
  | {
      type: 'UPDATE_TOAST'
      toast: Partial<ToastState>
    }
  | {
      type: 'DISMISS_TOAST'
      toastId?: ToastState['id']
    }
  | {
      type: 'REMOVE_TOAST'
      toastId?: ToastState['id']
    }

interface State {
  toasts: ToastState[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case 'DISMISS_TOAST': {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

interface ToastOptions {
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: VariantProps<typeof toastVariants>['variant']
  duration?: number
  icon?: React.ReactNode
}

function toast(options: ToastOptions) {
  const id = genId()
  const duration = options.duration ?? 5000

  const update = (props: ToastOptions) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...options,
      id,
      duration,
      open: true,
    },
  })

  if (duration > 0) {
    setTimeout(() => {
      dismiss()
    }, duration)
  }

  return {
    id: id,
    dismiss,
    update,
  }
}

// Helper functions for common toast types
toast.success = (message: string, description?: string) => {
  return toast({
    title: message,
    description,
    variant: 'success',
    icon: <CheckCircle className="h-5 w-5" />,
  })
}

toast.error = (message: string, description?: string) => {
  return toast({
    title: message,
    description,
    variant: 'destructive',
    icon: <AlertCircle className="h-5 w-5" />,
  })
}

toast.warning = (message: string, description?: string) => {
  return toast({
    title: message,
    description,
    variant: 'warning',
    icon: <AlertTriangle className="h-5 w-5" />,
  })
}

toast.info = (message: string, description?: string) => {
  return toast({
    title: message,
    description,
    variant: 'info',
    icon: <Info className="h-5 w-5" />,
  })
}

toast.loading = (message: string, description?: string) => {
  return toast({
    title: message,
    description,
    variant: 'default',
    duration: 0, // Don't auto-dismiss loading toasts
    icon: (
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
    ),
  })
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  }
}

// Toaster component
function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, icon, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex gap-3 items-start w-full">
              {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
              <div className="grid gap-1 flex-1 min-w-0">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  toast,
  useToast,
  Toaster,
}