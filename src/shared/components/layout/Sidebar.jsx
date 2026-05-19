import { Link, useLocation } from "react-router-dom"
import { ThemeToggleButton } from "../../../shared/components/ui/ThemeToggleButton.jsx";
import { useAuthStore } from "../../../features/auth/store/useAuthStore.js";
import {
    Users,
    MessageSquare,
    Utensils,
    UserCog,
    CalendarDays,
    ClipboardList,
    Receipt,
    Bell,
    ShoppingBag,
    TicketPercent,
    BookCheck,
    Store,
    Table,
    LayoutDashboard
} from "lucide-react";
import imgLogo from "../../../assets/img/logoExpress.png"

import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";

export const Sidebar = () => {
    const location = useLocation();
    const user = useAuthStore((state) => state.user);

    const items = [
        { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
        { label: "Clientes", to: "/dashboard/clients", icon: Users },
        { label: "Comentarios", to: "/dashboard/comments", icon: MessageSquare },
        { label: "Platillos", to: "/dashboard/dishes", icon: Utensils },
        { label: "Empleados", to: "/dashboard/employees", icon: UserCog },
        { label: "Eventos", to: "/dashboard/events", icon: CalendarDays },
        { label: "Inventarios", to: "/dashboard/inventories", icon: ClipboardList },
        { label: "Facturas", to: "/dashboard/invoices", icon: Receipt },
        { label: "Notificaciones", to: "/dashboard/notifications", icon: Bell },
        { label: "Pedidos", to: "/dashboard/orders", icon: ShoppingBag },
        { label: "Promociones", to: "/dashboard/promotions", icon: TicketPercent },
        { label: "Reservaciones", to: "/dashboard/reservations", icon: BookCheck },
        { label: "Mesas", to: "/dashboard/tables", icon: Table },
        { label: "Solicitudes", to: "/dashboard/partners", icon: ClipboardList, adminOnly: true },
        { label: "Restaurantes", to: "/dashboard/restaurants", icon: Store, adminOnly: true },
    ];

    const filteredItems = items.filter(item => {
        if (item.adminOnly && user?.role !== "ADMIN_ROLE") return false;
        return true;
    });

    return (
        <aside className="sidebar-container w-60 h-full flex flex-col flex-shrink-0">
            <nav className="flex-1 px-4 overflow-y-auto">
                <ul className="space-y-2 pb-10">
                    {filteredItems.map((item) => {
                        const active = location.pathname === item.to;
                        return (
                            <li key={item.to}>
                                <Link
                                    to={item.to}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 sidebar-link group ${active ? "active text-brand-red scale-[1.02]" : "text-secondary hover:bg-surface-alt/50"
                                        }`}
                                >
                                        <span className={`${active ? "text-brand-red" : "text-muted group-hover:text-primary"} transition-colors`}>
                                            <LucideMotionIcon icon={item.icon} className={active ? "text-brand-red dark:text-[#F1D302]" : ""} />
                                        </span>

                                    <span className="text-sm tracking-tight">
                                        {item.label}
                                    </span>

                                    {active && <div className="sidebar-underline active" />}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};