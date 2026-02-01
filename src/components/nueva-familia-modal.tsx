import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useToastContext } from '@/contexts/toast-context'

interface NuevaFamiliaModalProps {
    isOpen: boolean
    onClose: () => void
    onFamiliaCreated: (familiaId: number, hermanoId?: number) => void
    hermanoId?: number // ID del hermano existente (modo editar)
    onBeforeCreate?: () => Promise<number> // Callback para crear hermano antes de familia (modo nuevo)
}

export function NuevaFamiliaModal({
    isOpen,
    onClose,
    onFamiliaCreated,
    hermanoId,
    onBeforeCreate
}: NuevaFamiliaModalProps) {
    const toast = useToastContext()
    const [loading, setLoading] = useState(false)
    const [nombreFamilia, setNombreFamilia] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!nombreFamilia.trim()) {
            toast.warning('Ingresa un nombre para la familia')
            return
        }

        setLoading(true)

        try {
            let hermanoIdParaDireccion = hermanoId

            // Si hay callback onBeforeCreate, crear el hermano primero
            if (onBeforeCreate && !hermanoId) {
                hermanoIdParaDireccion = await onBeforeCreate()
            }

            const dataToSend: Record<string, unknown> = {
                nombre_familia: nombreFamilia
            }

            // Solo incluir hermano_direccion_id si existe un valor válido
            if (hermanoIdParaDireccion && hermanoIdParaDireccion > 0) {
                dataToSend.hermano_direccion_id = hermanoIdParaDireccion
            }

            const familiaId = await invoke<number>('create_familia_cmd', {
                familia: dataToSend
            })

            setNombreFamilia('')
            onClose()
            onFamiliaCreated(familiaId, hermanoIdParaDireccion)
        } catch {
            toast.error('Error al crear la familia')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nueva Familia">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Nombre de Familia"
                    value={nombreFamilia}
                    onChange={(e) => setNombreFamilia(e.target.value)}
                    placeholder="Ej: Familia García"
                    required
                    autoFocus
                />

                {hermanoId && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-700">
                            La dirección de este hermano se usará como dirección
                            principal de la familia.
                        </p>
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-2">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600"
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Creando...' : 'Crear Familia'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
