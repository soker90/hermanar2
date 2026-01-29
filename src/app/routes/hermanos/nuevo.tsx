import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'

export function Component() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        numero_hermano: '',
        nombre: '',
        apellidos: '',
        dni: '',
        fecha_nacimiento: '',
        fecha_alta: new Date().toISOString().split('T')[0],
        telefono: '',
        email: '',
        direccion: '',
        activo: true
    })

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
                direccion: formData.direccion || undefined
            }

            await invoke('create_hermano_cmd', { hermano: dataToSend })
            alert('Hermano creado correctamente')
            navigate('/hermanos')
        } catch (error) {
            console.error('Error creating hermano:', error)
            alert('Error al crear el hermano')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card
            title="Nuevo Hermano"
            subtitle="Registrar un nuevo hermano en el sistema"
        >
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
                        helperText="Dejar vacío para generar automáticamente"
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

                <Input
                    label="Fecha de Alta"
                    type="date"
                    value={formData.fecha_alta}
                    onChange={(e) =>
                        setFormData({ ...formData, fecha_alta: e.target.value })
                    }
                    required
                />

                <div className="flex gap-4 justify-end">
                    <Button
                        type="button"
                        onClick={() => navigate('/hermanos')}
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
