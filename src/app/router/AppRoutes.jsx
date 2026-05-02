import { Routes, Route } from "react-router-dom"
import { DashboardPage } from "../layouts/DashboardPage.jsx"
import { Reservations } from "../../features/reservations/components/Reservations.jsx";
import { Employees } from "../../features/employees/components/employees.jsx";
import { Inventory } from "../../features/inventory/components/Inventory.jsx";

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
                <Route path="employees" element={<Employees />} />
                <Route path="inventory" element={<Inventory />} />
            </Route>
        </Routes>
    )
}