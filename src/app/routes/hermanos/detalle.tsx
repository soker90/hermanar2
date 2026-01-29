import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    FileText,
    Users,
    ArrowLeft,
    Edit
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useParams, useNavigate } from 'react-router'
import type { Hermano, Familia } from '@/types'

export function Component() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [hermano, setHermano] = useState<Hermano | null>(null)
    const [familia, setFamilia] = useState<Familia | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadHermano()
    }, [id])

    const loadHermano = async () => {
        if (!id) return

        try {
            const hermanoData = await invoke<Hermano>('get_hermano_cmd', {
                id: parseInt(id)
            })
            setHermano(hermanoData)

            // Cargar familia si el hermano tiene familia_id
            if (hermanoData.familia_id) {
                const familiaData = await invoke<Familia>('get_familia_cmd', {
                    id: hermanoData.familia_id
                })
                setFamilia(familiaData)
            }
        } catch (error) {
            console.error('Error al cargar hermano:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No especificado'
        return new Date(dateString).toLocaleDateString('es-ES')
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        )
    }

    if (!hermano) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Hermano no encontrado
                </h2>
                <Button onClick={() => navigate('/hermanos')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a Hermanos
                </Button>
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/hermanos')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                    <div className="flex items-center">
                        <User className="h-6 w-6 text-indigo-600 mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {hermano.nombre} {hermano.apellidos}
                            </h1>
                            <p className="text-sm text-gray-600">
                                Número de hermano: {hermano.numero_hermano}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            hermano.activo
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {hermano.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    <Button onClick={() => navigate(`/hermanos/${id}/editar`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información Personal */}
                <Card>
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <User className="h-5 w-5 mr-2 text-indigo-600" />
                            Información Personal
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Nombre completo
                            </label>
                            <p className="mt-1 text-sm text-gray-900">
                                {hermano.nombre} {hermano.apellidos}
                            </p>
                        </div>

                        {hermano.dni && (
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    DNI
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {hermano.dni}
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                Fecha de nacimiento
                            </label>
                            <p className="mt-1 text-sm text-gray-900">
                                {formatDate(hermano.fecha_nacimiento)}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                Fecha de alta
                            </label>
                            <p className="mt-1 text-sm text-gray-900">
                                {formatDate(hermano.fecha_alta)}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Información de Contacto */}
                <Card>
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Phone className="h-5 w-5 mr-2 text-indigo-600" />
                            Información de Contacto
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                Teléfono
                            </label>
                            <p className="mt-1 text-sm text-gray-900">
                                {hermano.telefono || 'No especificado'}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <Mail className="h-4 w-4 mr-1" />
                                Email
                            </label>
                            <p className="mt-1 text-sm text-gray-900">
                                {hermano.email || 'No especificado'}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                Dirección
                            </label>
                            <p className="mt-1 text-sm text-gray-900">
                                {hermano.direccion || 'No especificada'}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Información de Familia */}
                {familia && (
                    <Card>
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Users className="h-5 w-5 mr-2 text-indigo-600" />
                                Información de Familia
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Familia
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {familia.nombre_familia}
                                </p>
                            </div>

                            {familia.hermano_direccion_id ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-green-900 mb-2">
                                        Dirección Principal de la Familia
                                    </h4>
                                    <p className="text-xs text-green-600 mb-2">
                                        Proporcionada por el hermano con ID:{' '}
                                        {familia.hermano_direccion_id}
                                        {familia.hermano_direccion_id ===
                                            hermano.id && ' (Este hermano)'}
                                    </p>
                                    <div className="text-sm text-gray-600">
                                        Para ver los detalles completos de
                                        contacto, consulte la información del
                                        hermano principal de la familia.
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-2 text-yellow-600" />
                                        <span className="text-sm text-yellow-800">
                                            No se ha seleccionado un hermano
                                            para proporcionar la dirección
                                            principal de la familia
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                )}

                {/* Observaciones */}
                {hermano.observaciones && (
                    <Card className={familia ? '' : 'lg:col-span-2'}>
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                                Observaciones
                            </h2>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                {hermano.observaciones}
                            </p>
                        </div>
                    </Card>
                )}

                {/* Información del Sistema */}
                <Card className="lg:col-span-2">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Información del Sistema
                        </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Fecha de creación
                            </label>
                            <p className="mt-1 text-sm text-gray-900">
                                {formatDate(hermano.created_at)}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Última actualización
                            </label>
                            <p className="mt-1 text-sm text-gray-900">
                                {formatDate(hermano.updated_at)}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
