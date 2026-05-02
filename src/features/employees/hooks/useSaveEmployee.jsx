import { useEmployeeStore } from "../store/useEmployeeStore";

export const useSaveEmployee = () => {
    const createEmployee = useEmployeeStore((s) => s.createEmployee);
    const updateEmployee = useEmployeeStore((s) => s.updateEmployee);

    const saveEmployee = async (data, id = null) => {
        const payload = {
            userId: data.userId,
            restaurant: data.restaurant,
            specialty: data.specialty,
            isActive: data.isActive ?? true
        };

        if (id) {
            await updateEmployee(id, payload);
        } else {
            await createEmployee(payload);
        }
    };

    return { saveEmployee };
};