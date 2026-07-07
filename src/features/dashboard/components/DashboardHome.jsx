import React, { useState, useEffect } from "react";
import { 
    TrendingUp, 
    ShoppingBag, 
    Star, 
    DollarSign, 
    FileText, 
    FileSpreadsheet,
    Store,
    Filter
} from "lucide-react";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { getGeneralReport, exportGeneralReport } from "../../../shared/api/reports";
import { axiosAdmin } from "../../../shared/api/api";
import toast from "react-hot-toast";

export const DashboardHome = () => {
    const user = useAuthStore((state) => state.user);
    const [reportData, setReportData] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === "ADMIN_ROLE";
    const isManager = user?.role === "MANAGER_ROLE";

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Si es admin, cargar lista de restaurantes para el filtro
                if (isAdmin) {
                    const res = await axiosAdmin.get("/restaurants/get");
                    setRestaurants(res.data.data || []);
                }

                // Si es manager, necesitamos obtener su restaurante
                let restaurantId = selectedRestaurant;
                if (isManager) {
                    const empRes = await axiosAdmin.get("/employees/");
                    const currentEmp = empRes.data.data.find(e => e.userId === user.id);
                    if (currentEmp) {
                        restaurantId = currentEmp.restaurant;
                        // For manager, we MUST send the restaurantId to avoid 403 
                        // if the backend is strict about identifying the target.
                    } else {
                        throw new Error("Manager sin restaurante asignado");
                    }
                }

                const params = {};
                if (restaurantId) params.restaurantId = restaurantId;

                console.log('Fetching report with params:', params);
                const reportRes = await getGeneralReport(params);
                setReportData(reportRes.data.data);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
                toast.error("No se pudieron cargar las estadísticas");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedRestaurant, isAdmin, isManager, user?.id]);

    const handleExport = async (format) => {
        try {
            toast.loading(`Generando reporte ${format.toUpperCase()}...`, { id: 'export' });
            let restaurantId = selectedRestaurant;
            if (isManager && reportData?.finalReport?.[0]?._id) {
                restaurantId = reportData.finalReport[0]._id;
            }
            await exportGeneralReport(format, restaurantId);
            toast.success("Reporte descargado con éxito", { id: 'export' });
        } catch (error) {
            console.error("Error exporting report:", error);
            toast.error("Error al exportar el reporte", { id: 'export' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
            </div>
        );
    }

    const stats = reportData?.finalReport?.[0] || {
        ingresos: 0,
        totalPedidos: 0,
        satisfaccion: 0,
        ocupacionPromedio: "0%"
    };

    // Si es admin y no hay restaurante seleccionado, sumamos todo
    const totalStats = isAdmin && !selectedRestaurant ? reportData?.finalReport?.reduce((acc, curr) => ({
        ingresos: acc.ingresos + curr.ingresos,
        totalPedidos: acc.totalPedidos + curr.totalPedidos,
        satisfaccion: acc.satisfaccion + curr.satisfaccion,
    }), { ingresos: 0, totalPedidos: 0, satisfaccion: 0 }) : null;

    if (totalStats) {
        totalStats.satisfaccion = (totalStats.satisfaccion / (reportData?.finalReport?.length || 1)).toFixed(1);
    }

    const currentStats = totalStats || stats;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Panel de Control</h1>
                    <p className="text-muted">Bienvenido de nuevo, {user?.name}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {isAdmin && (
                        <div className="flex items-center gap-2 bg-surface-alt px-3 py-2 rounded-xl border border-stroke shadow-sm">
                            <Filter size={18} className="text-muted" />
                            <select 
                                value={selectedRestaurant} 
                                onChange={(e) => setSelectedRestaurant(e.target.value)}
                                className="bg-transparent text-sm focus:outline-none"
                            >
                                <option value="">Todos los restaurantes</option>
                                {restaurants.map(r => (
                                    <option key={r._id} value={r._id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button 
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-xl hover:bg-brand-red/90 transition-colors shadow-lg shadow-brand-red/20"
                    >
                        <FileText size={18} />
                        Exportar PDF
                    </button>
                    <button 
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                    >
                        <FileSpreadsheet size={18} />
                        Exportar Excel
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card 
                    title="Ingresos Totales" 
                    value={`Q${currentStats.ingresos.toLocaleString()}`} 
                    icon={DollarSign} 
                    color="bg-blue-500" 
                />
                <Card 
                    title="Pedidos Completados" 
                    value={currentStats.totalPedidos} 
                    icon={ShoppingBag} 
                    color="bg-orange-500" 
                />
                <Card 
                    title="Satisfacción Promedio" 
                    value={`${Number(currentStats.satisfaccion).toFixed(1)} / 5.0`} 
                    icon={Star} 
                    color="bg-yellow-500" 
                />
                <Card 
                    title="Ocupación" 
                    value={isAdmin && !selectedRestaurant ? "N/A" : currentStats.ocupacionPromedio} 
                    icon={TrendingUp} 
                    color="bg-green-500" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Dishes */}
                <div className="bg-surface border border-stroke rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Utensils size={20} className="text-brand-red" />
                        Top 10 Platillos
                    </h3>
                    <div className="space-y-4">
                        {reportData?.topDishes?.map((dish, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 flex items-center justify-center bg-surface-alt rounded-full text-xs font-bold">
                                        {idx + 1}
                                    </span>
                                    <span className="text-sm font-medium">{dish._id}</span>
                                </div>
                                <span className="text-sm font-bold text-muted">{dish.totalSold} vendidos</span>
                            </div>
                        ))}
                        {(!reportData?.topDishes || reportData.topDishes.length === 0) && (
                            <p className="text-center text-muted py-8">No hay datos disponibles</p>
                        )}
                    </div>
                </div>

                {/* Peak Hours */}
                <div className="bg-surface border border-stroke rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Clock size={20} className="text-blue-500" />
                        Horas Pico (Reservaciones)
                    </h3>
                    <div className="space-y-4">
                        {reportData?.peakHours?.slice(0, 8).map((hour, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <span className="text-sm font-medium w-16">{hour._id}:00</span>
                                <div className="flex-1 h-2 bg-surface-alt rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-500 rounded-full" 
                                        style={{ width: `${(hour.total / (reportData.peakHours[0].total || 1)) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-bold text-muted">{hour.total}</span>
                            </div>
                        ))}
                        {(!reportData?.peakHours || reportData.peakHours.length === 0) && (
                            <p className="text-center text-muted py-8">No hay datos disponibles</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Card = ({ title, value, icon: Icon, color }) => (
    <div className="bg-surface border border-stroke rounded-2xl p-6 shadow-sm flex items-center gap-4">
        <div className={`${color} p-3 rounded-xl text-white`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm text-muted font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const Utensils = ({ size, className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
);

const Clock = ({ size, className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);
