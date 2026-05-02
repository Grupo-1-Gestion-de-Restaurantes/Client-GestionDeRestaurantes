import { Navbar } from "./Navbar.jsx"
import { Sidebar } from "./Sidebar.jsx"

export const DashboardContainer = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col custom-scrollbar">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    )
}