import { createEmployee, updateEmployee } from "../../../shared/api/admin";
import { useEmployeeStore } from "../store/useEmployeeStore";

export const useSaveEmployee = () => {

    const getEmployees = useEmployeeStore(state => state.getEmployees);

    const saveEmployee = async (data, id) => {
        try {
            if (id) {
                await updateEmployee(id, data);
            } else {
                await createEmployee(data);
            }

            await getEmployees();

        } catch (error) {
            console.error(error);
        }
    };

    return { saveEmployee };
};