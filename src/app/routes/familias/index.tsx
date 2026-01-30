import { Card } from '@/components/ui/card'
import { Table, type TableColumn } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { invoke } from '@tauri-apps/api/core'
import { useToastContext } from '@/contexts/toast-context'

interface Familia extends Record<string, unknown> {
    id: number
    nombre_familia: string
    hermano_direccion_id?: number
    created_at?: string
    updated_at?: string
}

export function Component() {
    const navigate = useNavigate()
    const toast = useToastContext()
    const [familias, setFamilias] = useState<Familia[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadFamilias()
    }, [])

    const loadFamilias = async () => {
        try {
            const data = await invoke<Familia[]>('get_all_familias_cmd')
            setFamilias(data)
        } catch (error) {
            console.error('Error loading familias:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (familia: Familia) => {
        if (!confirm(`¿Eliminar la familia "${familia.nombre_familia}"?`))
            return

        try {
            await invoke('delete_familia_cmd', { id: familia.id })
            loadFamilias()
        } catch (error) {
            console.error('Error deleting familia:', error)
            toast.error(
                'Error al eliminar la familia. Asegúrate de que no tenga hermanos asignados.'
            )
        }
    }

    const columns: TableColumn<Familia>[] = [
        { key: 'nombre_familia', label: 'Nombre de Familia' },
        {
            key: 'hermano_direccion_id',
            label: 'Dirección Principal',
            render: (v) => (v ? 'Sí' : 'No asignada')
        }
    ]

    return (
        <div>
            <Card
                title="Gestión de Familias"
                subtitle="Lista de todas las familias registradas"
                action={
                    <Button onClick={() => navigate('/familias/nueva')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Familia
                    </Button>
                }
            >
                <Table
                    data={familias}
                    columns={columns}
                    onEdit={(f) => navigate(`/familias/${f.id}/editar`)}
                    onDelete={handleDelete}
                    loading={loading}
                    emptyMessage="No hay familias registradas"
                />
            </Card>
        </div>
    )
}
