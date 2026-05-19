import { Routes, Route } from "react-router-dom"

import { AuthPage } from "../../features/auth/pages/AuthPage.jsx"
import { VerifyEmailPage } from "../../features/auth/pages/VerifyEmailPage.jsx"
import { UnauthorizedPage } from "../../features/auth/pages/UnauthorizedPage.jsx"
import { ResetPasswordPage } from "../../features/auth/pages/ResetPasswordPage.jsx"

import { ProtectedRoute } from "./ProtectedRoute.jsx"
import { RoleGuard } from "./RoleGuard.jsx"

import { DashboardPage } from "../layouts/DashboardPage.jsx"
import { DashboardHome } from "../../features/dashboard/components/DashboardHome.jsx"

// Imports unificados
import { Orders } from "../../features/orders/components/Orders.jsx"
import { Reservations } from "../../features/reservations/components/Reservations.jsx"
import { Employees } from "../../features/employees/components/Employees.jsx"
import { Invoices } from "../../features/invoices/components/Invoices.jsx"
import { Dishes } from "../../features/dishes/components/Dishes.jsx"
import { Promotions } from "../../features/promotions/components/Promotions.jsx"
import { Tables } from "../../features/tables/components/Tables.jsx"
import { Notifications } from "../../features/notifications/components/Notifications.jsx"
import { Restaurants } from "../../features/restaurants/components/Restaurants.jsx"
import { PartnersLeads } from "../../features/partners/components/PartnersLeads.jsx"
import { Clients } from "../../features/clients/components/Clients.jsx"
import { Comments } from "../../features/comments/components/Comments.jsx"
import { Inventories } from "../../features/inventories/components/Inventories.jsx"
import { Events } from "../../features/events/components/Events.jsx"

export const AppRoutes = () => {
    return (
        <Routes>
            {/* RUTAS PUBLICAS */}
            <Route path="/" element={<AuthPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* PROTECTED ROUTES + ROLE */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <RoleGuard allowedRole={["ADMIN_ROLE", "MANAGER_ROLE"]}>
                            <DashboardPage />
                        </RoleGuard>
                    </ProtectedRoute>
                }
            >
                <Route index element={<DashboardHome />} />
                <Route path="orders" element={<Orders />} />
                <Route path="comments" element={<Comments />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="employees" element={<Employees />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="dishes" element={<Dishes />} />
                <Route path="clients" element={<Clients />} />
                <Route path="inventories" element={<Inventories />} />
                <Route path="promotions" element={<Promotions />} />
                <Route path="tables" element={<Tables />} /> 
                <Route path="restaurants" element={<Restaurants />} />
                <Route path="partners" element={<PartnersLeads />} />
                <Route path="events" element={<Events />} />
                <Route path="notifications" element={<Notifications />} />
            </Route>
        </Routes>
    )
}