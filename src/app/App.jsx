import { AppRoutes } from '../app/router/AppRoutes.jsx'
import { ConfirmModal } from "../shared/components/ui/ConfirmModal.jsx"


export const App = () => {
    return (
        <>
            <AppRoutes />
            <ConfirmModal/>
        </>
    )
}