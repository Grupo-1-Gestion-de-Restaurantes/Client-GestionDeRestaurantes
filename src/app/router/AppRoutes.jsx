import { Routes, Route } from "react-router-dom"
import { DashboardPage } from "../layouts/DashboardPage.jsx"
import { Reservations } from "../../features/reservations/components/Reservations.jsx";
import { Invoices } from "../../features/invoices/components/Invoices.jsx";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route 
                path="/dashboard" 
                element={
                    <DashboardPage />
                } 
            >
                <Route path="reservations" element={<Reservations />} />
                <Route path="invoices" element={<Invoices />} />
            </Route>
        </Routes>
    )
}