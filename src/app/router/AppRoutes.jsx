import { Routes, Route } from "react-router-dom"
import { DashboardPage } from "../layouts/DashboardPage.jsx"
import { Reservations } from "../../features/reservations/components/Reservations.jsx";
import { Orders } from "../../features/orders/components/Orders.jsx";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route 
                path="/dashboard" 
                element={
                    <DashboardPage />
                } 
            > 
                <Route path="orders" element={<Orders />} />
                <Route path="reservations" element={<Reservations />} />
            </Route>
        </Routes>
    )
}