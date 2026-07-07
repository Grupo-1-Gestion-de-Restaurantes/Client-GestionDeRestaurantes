import { useReservationStore } from "../store/useReservationStore";

export const useSaveReservation = () => {
    const createReservation = useReservationStore((state) => state.createReservation);
    const updateReservation = useReservationStore((state) => state.updateReservation);

    const saveReservation = async (data, reservationId = null) => {
        const payload = {
            client: data.client,
            restaurantId: data.restaurant,
            tableId: data.table,
            reservationDate: new Date(data.reservationDate).toISOString(),
            numberOfPeople: Number(data.numberOfPeople),
            durationInMinutes: Number(data.durationInMinutes),
            specialRequests: data.specialRequests || "",
            status: data.status || "PENDIENTE"
        };

        if (reservationId) {
            await updateReservation(reservationId, payload);
        } else {
            await createReservation(payload);
        }
    };

    return { saveReservation };
};