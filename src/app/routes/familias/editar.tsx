import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useNavigate, useParams } from 'react-router'
import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'

interface Hermano {
    id?: number
    nombre: string
    apellidos: string
    direccion?: string
    familia_id?: number
}

interface Familia {
    id: number
    nombre_familia: string
    hermano_direccion_id?: number
}

export function Component() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [hermanos, setHermanos] = useState<Hermano[]>([])
    const [formData, setFormData] = useState({
        nombre_familia: '',
        hermano_direccion_id: undefined as number | undefined
    })

    useEffect(() => {
        const loadData = async () => {
            try {
                // Cargar datos de la familia
                const familias = await invoke<Familia[]>('get_all_familias_cmd')
                const familia = familias.find((f) => f.id === Number(id))

                if (familia) {
                    setFormData({
                        nombre_familia: familia.nombre_familia || '',
                        hermano_direccion_id: familia.hermano_direccion_id
                    })
                }

                // Cargar hermanos (sin familia o de esta familia)
                const hermanosData = await invoke<Hermano[]>(
                    'get_all_hermanos_cmd'
                )
                const disponibles = hermanosData.filter(
                    (h) => !h.familia_id || h.familia_id === Number(id)
                )
                setHermanos(disponibles)
            } catch (error) {
                console.error('Error loading data:', error)
                alert('Error al cargar los datos')
            } finally {
                setLoadingData(false)
            }
        }

        loadData()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Preparar datos para enviar, convirtiendo undefined correctamente
            const dataToSend = {
                nombre_familia: formData.nombre_familia,
                hermano_direccion_id: formData.hermano_direccion_id || undefined
            }

            await invoke('update_familia_cmd', {
                id: Number(id),
                familia: dataToSend
            })
            alert('Familia actualizada correctamente')
            navigate('/familias')
        } catch (error) {
            console.error('Error updating familia:', error)
            alert('Error al actualizar la familia')
        } finally {
            setLoading(false)
        }
    }

    if (loadingData) {
        return (
            <Card title="Editar Familia" subtitle="Cargando datos...">
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </Card>
        )
    }

    return (
        <Card title="Editar Familia" subtitle="Modificar datos de la familia">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Nombre de Familia"
                    value={formData.nombre_familia}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            nombre_familia: e.target.value
                        })
                    }
                    placeholder="Ej: Familia García"
                    required
                    helperText="Nombre identificativo de la familia"
                />

                <Select
                    label="Hermano con Dirección Principal"
                    value={formData.hermano_direccion_id?.toString() || ''}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            hermano_direccion_id: e.target.value
                                ? Number(e.target.value)
                                : undefined
                        })
                    }
                    options={[
                        { value: '', label: 'Seleccionar hermano (opcional)' },
                        ...hermanos.map((h) => ({
                            value: h.id!.toString(),
                            label: `${h.nombre} ${h.apellidos}${h.direccion ? ` - ${h.direccion}` : ''}`
                        }))
                    ]}
                    helperText="El hermano seleccionado proporcionará la dirección principal de la familia"
                />

                <div className="flex gap-4 justify-end">
                    <Button
                        type="button"
                        onClick={() => navigate('/familias')}
                        className="bg-gray-500 hover:bg-gray-600"
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Actualizar'}
                    </Button>
                </div>
            </form>
        </Card>
    )
}
