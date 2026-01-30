import { Card } from '@/components/ui/card'
import { Table, type TableColumn } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { invoke } from '@tauri-apps/api/core'
import { useToastContext } from '@/contexts/toast-context'

interface Cuota extends Record<string, unknown> {
    id: number
    hermano_id: number
    anio: number
    trimestre: number
    importe: number
    pagado: boolean
    fecha_pago?: string
    metodo_pago?: string
    observaciones?: string
}

interface Hermano {
    id: number
    nombre: string
    apellidos: string
    numero_hermano: string
}

export function Component() {
    const navigate = useNavigate()
    const [cuotas, setCuotas] = useState<Cuota[]>([])
    const [hermanos, setHermanos] = useState<Hermano[]>([])
    const [loading, setLoading] = useState(true)
    const [filtroAnio, setFiltroAnio] = useState<string>(
        new Date().getFullYear().toString()
    )
    const [filtroPagado, setFiltroPagado] = useState<string>('todos')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [cuotasData, hermanosData] = await Promise.all([
                invoke<Cuota[]>('get_all_cuotas_cmd'),
                invoke<Hermano[]>('get_all_hermanos_cmd')
            ])
            setCuotas(cuotasData)
            setHermanos(hermanosData)
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (cuota: Cuota) => {
        if (!confirm('¿Eliminar esta cuota?')) return

        try {
            await invoke('delete_cuota_cmd', { id: cuota.id })
            loadData()
        } catch (error) {
            console.error('Error deleting cuota:', error)
            toast.error('Error al eliminar la cuota')
        }
    }

    const handleMarcarPagada = async (cuota: Cuota) => {
        try {
            await invoke('marcar_cuota_pagada_cmd', {
                id: cuota.id,
                pagado: !cuota.pagado
            })
            loadData()
        } catch (error) {
            console.error('Error updating cuota:', error)
            toast.error('Error al actualizar el estado de la cuota')
        }
    }

    const getHermanoNombre = (hermanoId: number) => {
        const hermano = hermanos.find((h) => h.id === hermanoId)
        return hermano
            ? `${hermano.numero_hermano} - ${hermano.nombre} ${hermano.apellidos}`
            : 'Desconocido'
    }

    const cuotasFiltradas = cuotas.filter((c) => {
        const matchAnio =
            filtroAnio === 'todos' || c.anio.toString() === filtroAnio
        const matchPagado =
            filtroPagado === 'todos' ||
            (filtroPagado === 'pagado' && c.pagado) ||
            (filtroPagado === 'pendiente' && !c.pagado)
        return matchAnio && matchPagado
    })

    const aniosDisponibles = Array.from(
        new Set(cuotas.map((c) => c.anio))
    ).sort((a, b) => b - a)

    const columns: TableColumn<Cuota>[] = [
        {
            key: 'hermano_id',
            label: 'Hermano',
            render: (v) => getHermanoNombre(v as number)
        },
        { key: 'anio', label: 'Año' },
        {
            key: 'importe',
            label: 'Importe',
            render: (v) => `${(v as number).toFixed(2)} €`
        },
        {
            key: 'pagado',
            label: 'Estado',
            render: (v, row) => (
                <div className="flex items-center gap-2">
                    <span
                        className={`px-2 py-1 text-xs rounded-full ${v ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                        {v ? 'Pagado' : 'Pendiente'}
                    </span>
                    <Button
                        onClick={() => handleMarcarPagada(row)}
                        className="text-xs py-1 px-2"
                    >
                        {v ? 'Marcar pendiente' : 'Marcar pagado'}
                    </Button>
                </div>
            )
        },
        {
            key: 'fecha_pago',
            label: 'Fecha Pago',
            render: (v) =>
                v ? new Date(v as string).toLocaleDateString('es-ES') : '-'
        }
    ]

    return (
        <div>
            <Card
                title="Gestión de Cuotas"
                subtitle="Lista de todas las cuotas registradas"
                action={
                    <Button onClick={() => navigate('/cuotas/nueva')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Cuota
                    </Button>
                }
            >
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Filtrar por año"
                        value={filtroAnio}
                        onChange={(e) => setFiltroAnio(e.target.value)}
                        options={[
                            { value: 'todos', label: 'Todos los años' },
                            ...aniosDisponibles.map((a) => ({
                                value: a.toString(),
                                label: a.toString()
                            }))
                        ]}
                    />
                    <Select
                        label="Filtrar por estado"
                        value={filtroPagado}
                        onChange={(e) => setFiltroPagado(e.target.value)}
                        options={[
                            { value: 'todos', label: 'Todos' },
                            { value: 'pagado', label: 'Pagadas' },
                            { value: 'pendiente', label: 'Pendientes' }
                        ]}
                    />
                </div>

                <Table
                    data={cuotasFiltradas}
                    columns={columns}
                    onEdit={(c) => navigate(`/cuotas/${c.id}/editar`)}
                    onDelete={handleDelete}
                    loading={loading}
                    emptyMessage="No hay cuotas registradas"
                />
            </Card>
        </div>
    )
}
