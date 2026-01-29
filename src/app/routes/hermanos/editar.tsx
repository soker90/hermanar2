import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useNavigate, useParams } from 'react-router'
import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'

interface Hermano {
    id?: number
    numero_hermano: string
    nombre: string
    apellidos: string
    dni: string
    fecha_nacimiento: string
    fecha_alta: string
    familia_id?: number
    telefono: string
    email: string
    direccion: string
    activo: boolean
    observaciones?: string
}

interface Familia {
    id: number
    nombre_familia: string
}

export function Component() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [familias, setFamilias] = useState<Familia[]>([])
    const [formData, setFormData] = useState({
        numero_hermano: '',
        nombre: '',
        apellidos: '',
        dni: '',
        fecha_nacimiento: '',
        fecha_alta: '',
        telefono: '',
        email: '',
        direccion: '',
        activo: true,
        familia_id: undefined as number | undefined,
        observaciones: ''
    })

    useEffect(() => {
        const loadData = async () => {
            try {
                // Cargar datos del hermano
                const hermanos = await invoke<Hermano[]>('get_all_hermanos_cmd')
                const hermano = hermanos.find((h) => h.id === Number(id))

                if (hermano) {
                    setFormData({
                        numero_hermano: hermano.numero_hermano || '',
                        nombre: hermano.nombre || '',
                        apellidos: hermano.apellidos || '',
                        dni: hermano.dni || '',
                        fecha_nacimiento: hermano.fecha_nacimiento || '',
                        fecha_alta: hermano.fecha_alta || '',
                        telefono: hermano.telefono || '',
                        email: hermano.email || '',
                        direccion: hermano.direccion || '',
                        activo: hermano.activo ?? true,
                        familia_id: hermano.familia_id,
                        observaciones: hermano.observaciones || ''
                    })
                }

                // Cargar familias
                const familiasData = await invoke<Familia[]>(
                    'get_all_familias_cmd'
                )
                setFamilias(familiasData)
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
            // Preparar datos para enviar, convirtiendo cadenas vacías a undefined
            const dataToSend = {
                ...formData,
                dni: formData.dni || undefined,
                fecha_nacimiento: formData.fecha_nacimiento || undefined,
                telefono: formData.telefono || undefined,
                email: formData.email || undefined,
                direccion: formData.direccion || undefined,
                observaciones: formData.observaciones || undefined
            }

            await invoke('update_hermano_cmd', {
                id: Number(id),
                hermano: dataToSend
            })
            alert('Hermano actualizado correctamente')
            navigate('/hermanos')
        } catch (error) {
            console.error('Error updating hermano:', error)
            alert('Error al actualizar el hermano')
        } finally {
            setLoading(false)
        }
    }

    if (loadingData) {
        return (
            <Card title="Editar Hermano" subtitle="Cargando datos...">
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </Card>
        )
    }

    return (
        <Card title="Editar Hermano" subtitle="Modificar datos del hermano">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Número de Hermano"
                        value={formData.numero_hermano}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                numero_hermano: e.target.value
                            })
                        }
                        required
                    />
                    <Select
                        label="Estado"
                        value={formData.activo ? '1' : '0'}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                activo: e.target.value === '1'
                            })
                        }
                        options={[
                            { value: '1', label: 'Activo' },
                            { value: '0', label: 'Inactivo' }
                        ]}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nombre"
                        value={formData.nombre}
                        onChange={(e) =>
                            setFormData({ ...formData, nombre: e.target.value })
                        }
                        required
                    />
                    <Input
                        label="Apellidos"
                        value={formData.apellidos}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                apellidos: e.target.value
                            })
                        }
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="DNI"
                        value={formData.dni}
                        onChange={(e) =>
                            setFormData({ ...formData, dni: e.target.value })
                        }
                    />
                    <Input
                        label="Fecha de Nacimiento"
                        type="date"
                        value={formData.fecha_nacimiento}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                fecha_nacimiento: e.target.value
                            })
                        }
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Teléfono"
                        value={formData.telefono}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                telefono: e.target.value
                            })
                        }
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />
                </div>

                <Input
                    label="Dirección"
                    value={formData.direccion}
                    onChange={(e) =>
                        setFormData({ ...formData, direccion: e.target.value })
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Fecha de Alta"
                        type="date"
                        value={formData.fecha_alta}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                fecha_alta: e.target.value
                            })
                        }
                        required
                    />
                    <Select
                        label="Familia"
                        value={formData.familia_id?.toString() || ''}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                familia_id: e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                            })
                        }
                        options={[
                            { value: '', label: 'Sin familia' },
                            ...familias.map((f) => ({
                                value: f.id.toString(),
                                label: f.nombre_familia
                            }))
                        ]}
                    />
                </div>

                <div className="flex gap-4 justify-end">
                    <Button
                        type="button"
                        onClick={() => navigate('/hermanos')}
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
