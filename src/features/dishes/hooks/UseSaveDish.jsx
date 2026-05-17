import { useDishStore } from "../store/useDishStore";

export const useSaveDish = () => {
    const createDish = useDishStore((state) => state.createDish);
    const updateDish = useDishStore((state) => state.updateDish);

    const saveDish = async (data, dishId = null) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("dishType", data.dishType);
        formData.append("restaurant", data.restaurant);

        if (data.photo && data.photo[0]) {
            formData.append("photo", data.photo[0]);
        }

        if (data.ingredients && data.ingredients.length > 0) {
            formData.append("ingredients", JSON.stringify(data.ingredients));
        } else {
            formData.append("ingredients", JSON.stringify([]));
        }

        if (dishId) {
            await updateDish(dishId, formData);
        } else {
            await createDish(formData);
        }
    };

    return { saveDish };
};