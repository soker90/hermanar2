import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'

interface Hermano {
    id?: number
    nombre: string
    apellidos: string
    direccion?: string
    familia_id?: number
}

export function Component() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [hermanos, setHermanos] = useState<Hermano[]>([])
    const [formData, setFormData] = useState({
        nombre_familia: '',
        hermano_direccion_id: undefined as number | undefined
    })

    useEffect(() => {
        const loadHermanos = async () => {
            try {
                const data = await invoke<Hermano[]>('get_all_hermanos_cmd')
                // Filtrar hermanos sin familia o activos
                const disponibles = data.filter((h) => !h.familia_id)
                setHermanos(disponibles)
            } catch (error) {
                console.error('Error loading hermanos:', error)
            }
        }

        loadHermanos()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Preparar datos para enviar, convirtiendo undefined correctamente
            const dataToSend = {
                nombre_familia: formData.nombre_familia,
                hermano_direccion_id: formData.hermano_direccion_id || undefined
            }

            await invoke('create_familia_cmd', { familia: dataToSend })
            alert('Familia creada correctamente')
            navigate('/familias')
        } catch (error) {
            console.error('Error creating familia:', error)
            alert('Error al crear la familia')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card
            title="Nueva Familia"
            subtitle="Registrar una nueva familia en el sistema"
        >
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
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </form>
        </Card>
    )
}
