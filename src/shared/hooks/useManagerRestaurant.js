import { useEffect } from "react";
import { useAuthStore } from "../../features/auth/store/useAuthStore.js";
import { useEmployeeStore } from "../../features/employees/store/useEmployeeStore.js";

/**
 * Resuelve el restaurante propio del manager autenticado, para que los modales
 * y filtros puedan auto-rellenar/ocultar el selector de restaurante en vez de
 * dejar que el manager elija uno (solo debe operar sobre el suyo).
 */
export const useManagerRestaurant = () => {
    const user = useAuthStore((state) => state.user);
    const myEmployee = useEmployeeStore((state) => state.myEmployee);
    const getMyRestaurant = useEmployeeStore((state) => state.getMyRestaurant);

    const isAdmin = user?.role === "ADMIN_ROLE";
    const isManager = user?.role === "MANAGER_ROLE";

    useEffect(() => {
        if (isManager) getMyRestaurant();
    }, [isManager, getMyRestaurant]);

    const myRestaurantId = myEmployee?.restaurant?._id || myEmployee?.restaurant || null;
    const myRestaurantName = myEmployee?.restaurant?.name || "";

    return { isAdmin, isManager, myRestaurantId, myRestaurantName };
};
