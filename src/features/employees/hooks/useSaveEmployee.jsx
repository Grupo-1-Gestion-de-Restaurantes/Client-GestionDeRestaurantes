import { useEmployeeStore } from "../store/useEmployeeStore";

export const useSaveEmployee = () => {
    const createEmployee = useEmployeeStore((state) => state.createEmployee);
    const updateEmployee = useEmployeeStore((state) => state.updateEmployee);

    const saveEmployee = async (data, employeeId = null) => {
        if (employeeId) {
            // MODO EDICIÓN: Solo actualizamos los campos operativos que permita tu backend
            const payload = {
                restaurant: data.restaurant,
                specialty: data.specialty
            };
            await updateEmployee(employeeId, payload);
        } else {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("surname", data.surname);
            formData.append("username", data.username);
            formData.append("email", data.email);
            formData.append("password", data.password);
            formData.append("phone", data.phone);
            formData.append("role", data.role); 

            formData.append("restaurant", data.restaurant);
            formData.append("specialty", data.role === "MANAGER_ROLE" ? "ADMINISTRATIVO" : data.specialty);

            if (data.profilePicture && data.profilePicture[0]) {
                formData.append("profilePicture", data.profilePicture[0]);
            }

            await createEmployee(formData);
        }
    };

    return { saveEmployee };
};