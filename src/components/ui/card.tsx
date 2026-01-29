import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
    title?: string
    subtitle?: string
    action?: ReactNode
}

export function Card({
    children,
    className,
    title,
    subtitle,
    action
}: CardProps) {
    return (
        <div
            className={cn(
                'rounded-lg border border-gray-200 bg-white shadow-sm',
                className
            )}
        >
            {(title || subtitle || action) && (
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            {title && (
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className="mt-1 text-sm text-gray-500">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {action && <div>{action}</div>}
                    </div>
                </div>
            )}
            <div className="px-6 py-4">{children}</div>
        </div>
    )
}
