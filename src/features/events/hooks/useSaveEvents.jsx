import { useEventStore } from "../store/useEventsStore.js";

export const useSaveEvent = () => {
    const createEvent = useEventStore((state) => state.createEvent);
    const updateEvent = useEventStore((state) => state.updateEvent);

    const saveEvent = async (data, eventId = null) => {
        const payload = {
            name: data.name,
            description: data.description,
            typeEvent: data.typeEvent,
            capacity: Number(data.capacity),
            price: Number(data.price),
            restaurant: data.restaurant,
            dateTime: new Date(data.dateTime).toISOString(),
            // Manejo de arrays opcionales en tu esquema de Mongoose
            additionalServices: data.additionalServices || [],
            assignedTables: data.assignedTables || [],
            specialDishes: data.specialDishes || [],
            assignedEmployees: data.assignedEmployees || [],
            activePromotions: data.activePromotions ? [data.activePromotions] : [] 
        };

        if (eventId) {
            await updateEvent(eventId, payload);
        } else {
            await createEvent(payload);
        }
    };

    return { saveEvent };
};