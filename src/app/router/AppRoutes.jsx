import { Routes, Route } from "react-router-dom"
import { DashboardPage } from "../layouts/DashboardPage.jsx"
import { Reservations } from "../../features/reservations/components/Reservations.jsx";
import { Inventory } from "../../features/inventory/components/Inventory.jsx";
import { Invoices } from "../../features/invoices/components/Invoices.jsx";
import { Employees } from "../../features/employees/components/Employees.jsx";
import { Restaurants } from "../../features/restaurants/components/Restaurants.jsx";


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
                <Route path="invoices" element={<Invoices />} />
                <Route path="employees" element={<Employees />} />
                <Route path="restaurants" element={<Restaurants />} />
            </Route>
        </Routes>
    )
}