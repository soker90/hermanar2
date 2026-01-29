import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { type ReactNode, useEffect } from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: ReactNode
    footer?: ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md'
}: ModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div
                className={cn(
                    'relative w-full bg-white rounded-lg shadow-xl m-4',
                    sizeClasses[size]
                )}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="border-t border-gray-200 px-6 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}
