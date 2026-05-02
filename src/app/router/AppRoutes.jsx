import { Routes, Route } from "react-router-dom"
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx"
import { VerifyEmailPage } from "../../features/auth/pages/VerifyEmailPage.jsx"
import { UnauthorizedPage } from "../../features/auth/pages/UnauthorizedPage.jsx"
import { ProtectedRoute } from "./ProtectedRoute.jsx"
import { RoleGuard } from "./RoleGuard.jsx"

export const AppRoutes = () => {
    return (
        <Routes>
            {/* RUTAS PUBLICAS */}
            <Route path="/" element={<AuthPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* PROTECTED ROUTES + ROLE */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <RoleGuard allowedRole={["ADMIN_ROLE"]}>
                            <Route path="invoices" element={<Invoices />} />
                             <Route path="reservations" element={<Reservations />} />
                        </RoleGuard>
                    </ProtectedRoute>
                }
            >
            </Route>
        </Routes>
    )
}