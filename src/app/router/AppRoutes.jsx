import { Routes, Route } from "react-router-dom"
import { DashboardPage } from "../layouts/DashboardPage.jsx"
import { Reservations } from "../../features/reservations/components/Reservations.jsx";
import { Orders } from "../../features/orders/components/Orders.jsx";
import { Invoices } from "../../features/invoices/components/Invoices.jsx";
import { Employees } from "../../features/employees/components/Employees.jsx";
import { Restaurants } from "../../features/restaurants/components/Restaurants.jsx";
import { Inventories } from "../../features/inventory/components/Inventories.jsx";

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
                <Route path="employees" element={<Employees />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="restaurants" element={<Restaurants />} />
                <Route path="inventories" element={<Inventories />} />
            </Route>
        </Routes>
    )
}