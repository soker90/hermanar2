import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
    id: string
    type: ToastType
    message: string
    duration?: number
}

interface ToastProps {
    toast: Toast
    onClose: (id: string) => void
}

const ToastItem = ({ toast, onClose }: ToastProps) => {
    useEffect(() => {
        const duration = toast.duration || 5000
        const timer = setTimeout(() => {
            onClose(toast.id)
        }, duration)

        return () => clearTimeout(timer)
    }, [toast.id, toast.duration, onClose])

    const icons = {
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        error: <AlertCircle className="h-5 w-5 text-red-500" />,
        warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />
    }

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        warning: 'bg-yellow-50 border-yellow-200',
        info: 'bg-blue-50 border-blue-200'
    }

    return (
        <div
            className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${bgColors[toast.type]} animate-slide-in`}
            role="alert"
        >
            {icons[toast.type]}
            <p className="flex-1 text-sm font-medium text-gray-900">
                {toast.message}
            </p>
            <button
                onClick={() => onClose(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar notificación"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}

interface ToastContainerProps {
    toasts: Toast[]
    onClose: (id: string) => void
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
            <div className="pointer-events-auto space-y-2">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={onClose} />
                ))}
            </div>
        </div>
    )
}

// Hook para manejar toasts
export const useToast = () => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = (type: ToastType, message: string, duration?: number) => {
        const id = Math.random().toString(36).substring(7)
        const newToast: Toast = { id, type, message, duration }
        setToasts((prev) => [...prev, newToast])
    }

    const closeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }

    return {
        toasts,
        showToast,
        closeToast,
        success: (message: string, duration?: number) =>
            showToast('success', message, duration),
        error: (message: string, duration?: number) =>
            showToast('error', message, duration),
        warning: (message: string, duration?: number) =>
            showToast('warning', message, duration),
        info: (message: string, duration?: number) =>
            showToast('info', message, duration)
    }
}
