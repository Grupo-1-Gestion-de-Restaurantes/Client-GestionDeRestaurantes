import { Link, useLocation } from "react-router-dom"
import { ThemeToggleButton } from "../../../shared/components/ui/ThemeToggleButton.jsx";
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
    Table
} from "lucide-react";
import imgLogo from "../../../assets/img/logoExpress.png"

import { UtensilsCrossed } from "lucide-react";

export const Sidebar = () => {
    const location = useLocation();

    const items = [
        { label: "Clientes", to: "/dashboard/clients", icon: <Users size={20} /> },
        { label: "Comentarios", to: "/dashboard/comments", icon: <MessageSquare size={20} /> },
        { label: "Platillos", to: "/dashboard/dishes", icon: <Utensils size={20} /> },
        { label: "Empleados", to: "/dashboard/employees", icon: <UserCog size={20} /> },
        { label: "Eventos", to: "/dashboard/events", icon: <CalendarDays size={20} /> },
        { label: "Inventarios", to: "/dashboard/inventories", icon: <ClipboardList size={20} /> },
        { label: "Facturas", to: "/dashboard/invoices", icon: <Receipt size={20} /> },
        { label: "Notificaciones", to: "/dashboard/notifications", icon: <Bell size={20} /> },
        { label: "Pedidos", to: "/dashboard/orders", icon: <ShoppingBag size={20} /> },
        { label: "Promociones", to: "/dashboard/promotions", icon: <TicketPercent size={20} /> },
        { label: "Reservaciones", to: "/dashboard/reservations", icon: <BookCheck size={20} /> },
        { label: "Mesas", to: "/dashboard/tables", icon: <Table size={20} /> },
        { label: "Restaurantes", to: "/dashboard/restaurants", icon: <Store size={20} /> },
    ];
    return (
        <aside className="sidebar-container w-60 h-full flex flex-col flex-shrink-0">
            <nav className="flex-1 px-4 overflow-y-auto">
                <ul className="space-y-2 pb-10">
                    {items.map((item) => {
                        const active = location.pathname === item.to;
                        return (
                            <li key={item.to}>
                                <Link
                                    to={item.to}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 sidebar-link group ${active ? "active text-brand-red scale-[1.02]" : "text-secondary hover:bg-surface-alt/50"
                                        }`}
                                >
                                    {/* Renderizamos el icono aquí */}
                                    <span className={`${active ? "text-brand-red" : "text-muted group-hover:text-primary"} transition-colors`}>
                                        {item.icon}
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