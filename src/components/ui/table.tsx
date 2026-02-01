import { cn } from '@/lib/utils'
import { Edit, Eye, Trash2 } from 'lucide-react'
import { type ReactNode } from 'react'

export interface TableColumn<T> {
    key: keyof T | string
    label: string
    render?: (value: unknown, item: T) => ReactNode
    className?: string
}

export interface TableProps<T> {
    data: T[]
    columns: TableColumn<T>[]
    onEdit?: (item: T) => void
    onDelete?: (item: T) => void
    onView?: (item: T) => void
    loading?: boolean
    emptyMessage?: string
    viewTitle?: string
    editTitle?: string
    deleteTitle?: string
}

export function Table<T extends Record<string, unknown>>({
    data,
    columns,
    onEdit,
    onDelete,
    onView,
    loading,
    emptyMessage = 'No hay datos para mostrar',
    viewTitle = 'Ver detalle',
    editTitle = 'Editar',
    deleteTitle = 'Eliminar'
}: TableProps<T>) {
    const hasActions = onEdit || onDelete || onView

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={cn(
                                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                                    column.className
                                )}
                            >
                                {column.label}
                            </th>
                        ))}
                        {hasActions && (
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {columns.map((column, colIndex) => {
                                const value = item[column.key as keyof T]
                                return (
                                    <td
                                        key={colIndex}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    >
                                        {column.render
                                            ? column.render(value, item)
                                            : String(value || '')}
                                    </td>
                                )
                            })}
                            {hasActions && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        {onView && (
                                            <button
                                                onClick={() => onView(item)}
                                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                                                title={viewTitle}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        )}
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                title={editTitle}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(item)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                title={deleteTitle}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
