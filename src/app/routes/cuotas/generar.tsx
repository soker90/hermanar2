import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'

interface GenerarCuotasProps {
    onCuotasGenerated: () => void
}

export function GenerarCuotas({ onCuotasGenerated }: GenerarCuotasProps) {
    const [anio, setAnio] = useState(new Date().getFullYear())
    const [importe, setImporte] = useState(50)
    const [isGenerating, setIsGenerating] = useState(false)
    const [resultado, setResultado] = useState<{
        tipo: 'success' | 'error'
        mensaje: string
        cuotasCreadas?: number
    } | null>(null)

    const handleGenerar = async () => {
        if (!anio || !importe) {
            setResultado({
                tipo: 'error',
                mensaje: 'Por favor, completa todos los campos'
            })
            return
        }

        if (importe <= 0) {
            setResultado({
                tipo: 'error',
                mensaje: 'El importe debe ser mayor que 0'
            })
            return
        }

        const confirmMessage = `¿Confirma la generación de cuotas anuales para:\n\nAño: ${anio}\nImporte: €${importe}\n\nSe generarán cuotas anuales para todos los hermanos activos. Esta acción no se puede deshacer.`

        if (!window.confirm(confirmMessage)) {
            return
        }

        setIsGenerating(true)
        setResultado(null)

        try {
            // Para cuotas anuales usamos trimestre 1
            const cuotasCreadas = await invoke<number>(
                'generar_cuotas_trimestre_cmd',
                {
                    anio,
                    trimestre: 1,
                    importe
                }
            )

            if (cuotasCreadas > 0) {
                setResultado({
                    tipo: 'success',
                    mensaje: `Se han generado ${cuotasCreadas} cuotas correctamente`,
                    cuotasCreadas
                })
                onCuotasGenerated()
            } else {
                setResultado({
                    tipo: 'error',
                    mensaje:
                        'No se generaron cuotas. Es posible que ya existan para este período.'
                })
            }
        } catch (error) {
            setResultado({
                tipo: 'error',
                mensaje: `Error al generar las cuotas: ${error}`
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const resetForm = () => {
        setResultado(null)
        setAnio(new Date().getFullYear())
        setImporte(50)
    }

    return (
        <Card
            title="Generar Cuotas Automáticamente"
            subtitle="Crear cuotas anuales para todos los hermanos activos"
        >
            <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-blue-800 mb-1">
                                Información importante
                            </h4>
                            <p className="text-sm text-blue-700">
                                Esta función genera automáticamente cuotas
                                anuales para todos los hermanos activos del año
                                seleccionado. Si ya existen cuotas para algunos
                                hermanos en ese año, no se crearán duplicados.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Año"
                        type="number"
                        value={anio}
                        onChange={(e) => setAnio(parseInt(e.target.value))}
                        min={2020}
                        max={2050}
                    />

                    <Input
                        label="Importe Anual (€)"
                        type="number"
                        value={importe}
                        onChange={(e) => setImporte(parseFloat(e.target.value))}
                        min={0}
                        step={0.01}
                    />
                </div>

                {resultado && (
                    <div
                        className={`border rounded-lg p-4 ${
                            resultado.tipo === 'success'
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                        }`}
                    >
                        <div className="flex items-start space-x-3">
                            {resultado.tipo === 'success' ? (
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            )}
                            <div>
                                <p
                                    className={`text-sm font-medium ${
                                        resultado.tipo === 'success'
                                            ? 'text-green-800'
                                            : 'text-red-800'
                                    }`}
                                >
                                    {resultado.mensaje}
                                </p>
                                {resultado.cuotasCreadas !== undefined && (
                                    <p className="text-sm text-green-700 mt-1">
                                        Total de cuotas generadas:{' '}
                                        {resultado.cuotasCreadas}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-3">
                    <Button
                        onClick={resetForm}
                        disabled={isGenerating}
                        className="bg-gray-500 hover:bg-gray-600"
                    >
                        Resetear
                    </Button>
                    <Button onClick={handleGenerar} disabled={isGenerating}>
                        {isGenerating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Generando...
                            </>
                        ) : (
                            <>
                                <Users className="h-4 w-4 mr-2" />
                                Generar Cuotas
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
