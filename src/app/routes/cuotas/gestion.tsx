import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Users, Calculator, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { GenerarCuotas } from './generar'
import { useNavigate } from 'react-router'
import type { Cuota } from '@/types'

type TabType = 'resumen' | 'generar'

export function Component() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<TabType>('resumen')
    const [cuotas, setCuotas] = useState<Cuota[]>([])
    const [cuotasPendientes, setCuotasPendientes] = useState<Cuota[]>([])

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [cuotasData, pendientesData] = await Promise.all([
                invoke<Cuota[]>('get_all_cuotas_cmd'),
                invoke<Cuota[]>('get_cuotas_pendientes_cmd')
            ])
            setCuotas(cuotasData)
            setCuotasPendientes(pendientesData)
        } catch (error) {
            console.error('Error loading data:', error)
        }
    }

    const handleCuotasGenerated = () => {
        loadData()
        setActiveTab('resumen')
    }

    const currentYear = new Date().getFullYear()
    const cuotasCurrentYear = cuotas.filter((c) => c.anio === currentYear)
    const cuotasPagadasCurrentYear = cuotasCurrentYear.filter((c) => c.pagado)
    const ingresosTotales = cuotasPagadasCurrentYear.reduce(
        (sum, c) => sum + c.importe,
        0
    )
    const importePendiente = cuotasPendientes.reduce(
        (sum, c) => sum + c.importe,
        0
    )

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount)
    }

    const tabs = [
        {
            id: 'resumen' as TabType,
            label: 'Resumen',
            icon: TrendingUp
        },
        {
            id: 'generar' as TabType,
            label: 'Generar Cuotas',
            icon: Users
        }
    ]

    const renderContent = () => {
        switch (activeTab) {
            case 'generar':
                return (
                    <GenerarCuotas onCuotasGenerated={handleCuotasGenerated} />
                )
            case 'resumen':
            default:
                return (
                    <div className="space-y-6">
                        <Card
                            title={`Resumen del Año ${currentYear}`}
                            subtitle="Estadísticas de cuotas del año actual"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-600">
                                                Total Cuotas
                                            </p>
                                            <p className="text-2xl font-bold text-blue-900">
                                                {cuotasCurrentYear.length}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Calculator className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-600">
                                                Cuotas Pagadas
                                            </p>
                                            <p className="text-2xl font-bold text-green-900">
                                                {
                                                    cuotasPagadasCurrentYear.length
                                                }
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <CreditCard className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-yellow-600">
                                                Cuotas Pendientes
                                            </p>
                                            <p className="text-2xl font-bold text-yellow-900">
                                                {cuotasPendientes.length}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <Users className="w-6 h-6 text-yellow-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-purple-600">
                                                Ingresos Totales
                                            </p>
                                            <p className="text-2xl font-bold text-purple-900">
                                                {formatCurrency(
                                                    ingresosTotales
                                                )}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 text-purple-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                                        Porcentaje de Cobro
                                    </h4>
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{
                                                    width: `${
                                                        cuotasCurrentYear.length >
                                                        0
                                                            ? (cuotasPagadasCurrentYear.length /
                                                                  cuotasCurrentYear.length) *
                                                              100
                                                            : 0
                                                    }%`
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {cuotasCurrentYear.length > 0
                                                ? Math.round(
                                                      (cuotasPagadasCurrentYear.length /
                                                          cuotasCurrentYear.length) *
                                                          100
                                                  )
                                                : 0}
                                            %
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                                        Importe Pendiente
                                    </h4>
                                    <p className="text-lg font-semibold text-red-600">
                                        {formatCurrency(importePendiente)}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card
                            title="Acciones Rápidas"
                            subtitle="Gestiona las cuotas de forma rápida y eficiente"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button
                                    onClick={() => setActiveTab('generar')}
                                    className="h-20 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Users className="w-6 h-6" />
                                    <span>
                                        Generar Cuotas Anuales {currentYear}
                                    </span>
                                </Button>

                                <Button
                                    onClick={() => navigate('/cuotas/pagar')}
                                    className={`h-20 flex flex-col items-center justify-center space-y-2 ${
                                        cuotasPendientes.length > 0
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-gray-400'
                                    }`}
                                    disabled={cuotasPendientes.length === 0}
                                >
                                    <CreditCard className="w-6 h-6" />
                                    <span>
                                        {cuotasPendientes.length > 0
                                            ? `Gestionar ${cuotasPendientes.length} Cuotas Pendientes`
                                            : 'No hay cuotas pendientes'}
                                    </span>
                                </Button>
                            </div>
                        </Card>

                        <Card
                            title="Información del Año Actual"
                            subtitle={`Gestión de cuotas anuales ${currentYear}`}
                        >
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Calculator className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-blue-800 mb-1">
                                            Año {currentYear}
                                        </h4>
                                        <p className="text-sm text-blue-700">
                                            Gestión de cuotas anuales
                                        </p>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-sm text-blue-700">
                                                <strong>Cuotas del año:</strong>{' '}
                                                {cuotasCurrentYear.length}
                                            </p>
                                            <p className="text-sm text-blue-700">
                                                <strong>Pagadas:</strong>{' '}
                                                {
                                                    cuotasPagadasCurrentYear.length
                                                }
                                            </p>
                                            <p className="text-sm text-blue-700">
                                                <strong>Pendientes:</strong>{' '}
                                                {cuotasCurrentYear.length -
                                                    cuotasPagadasCurrentYear.length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Gestión de Cuotas
                </h1>
                <p className="text-gray-600">
                    Genera cuotas automáticamente y gestiona los pagos de forma
                    eficiente
                </p>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {tab.label}
                            </button>
                        )
                    })}
                </nav>
            </div>

            <div>{renderContent()}</div>
        </div>
    )
}
