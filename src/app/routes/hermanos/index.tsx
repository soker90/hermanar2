import { Card } from '@/components/ui/card'
import { Table, type TableColumn } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { invoke } from '@tauri-apps/api/core'
import type { Hermano } from '@/types'
import { useToastContext } from '@/contexts/toast-context'

export function Component() {
    const navigate = useNavigate()
    const toast = useToastContext()
    const [hermanos, setHermanos] = useState<Hermano[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadHermanos()
    }, [])

    const loadHermanos = async () => {
        try {
            const data = await invoke<Hermano[]>('get_all_hermanos_cmd')
            setHermanos(data)
        } catch (error) {
            console.error('Error loading hermanos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            loadHermanos()
            return
        }
        try {
            const data = await invoke<Hermano[]>('search_hermanos_cmd', {
                query: searchTerm
            })
            setHermanos(data)
        } catch (error) {
            console.error('Error searching hermanos:', error)
        }
    }

    const handleDelete = async (hermano: Hermano) => {
        if (
            !confirm(
                `¿Eliminar a ${hermano.nombre} ${hermano.primer_apellido} ${hermano.segundo_apellido || ''}?`
            )
        )
            return

        try {
            await invoke('delete_hermano_cmd', { id: hermano.id })
            loadHermanos()
        } catch (error) {
            console.error('Error deleting hermano:', error)
            toast.error('Error al eliminar el hermano')
        }
    }

    const columns: TableColumn<Hermano>[] = [
        { key: 'numero_hermano', label: 'Número' },
        { key: 'nombre', label: 'Nombre' },
        {
            key: 'primer_apellido',
            label: 'Apellidos',
            render: (_v, item) =>
                `${item.primer_apellido} ${item.segundo_apellido || ''}`
        },
        {
            key: 'telefono',
            label: 'Teléfono',
            render: (v) => (v as string) || '-'
        },
        {
            key: 'activo',
            label: 'Estado',
            render: (v) => (
                <span
                    className={`px-2 py-1 text-xs rounded-full ${v ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                    {v ? 'Activo' : 'Inactivo'}
                </span>
            )
        }
    ]

    return (
        <div>
            <Card
                title="Gestión de Hermanos"
                subtitle="Lista de todos los hermanos registrados"
                action={
                    <Button onClick={() => navigate('/hermanos/nuevo')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Hermano
                    </Button>
                }
            >
                <div className="mb-4 flex gap-2">
                    <Input
                        placeholder="Buscar por nombre, apellidos o DNI..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="flex-1"
                    />
                    <Button onClick={handleSearch}>
                        <Search className="h-4 w-4 mr-2" />
                        Buscar
                    </Button>
                </div>

                <Table
                    data={hermanos}
                    columns={columns}
                    onView={(h) => navigate(`/hermanos/${h.id}`)}
                    onEdit={(h) => navigate(`/hermanos/${h.id}/editar`)}
                    onDelete={handleDelete}
                    loading={loading}
                    emptyMessage="No hay hermanos registrados"
                />
            </Card>
        </div>
    )
}
