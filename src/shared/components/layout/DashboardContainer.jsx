import { Navbar } from "./Navbar.jsx"
import { Sidebar } from "./Sidebar.jsx"

export const DashboardContainer = ({ children }) => {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}