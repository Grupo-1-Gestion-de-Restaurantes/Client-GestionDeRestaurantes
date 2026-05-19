import { useClientStore } from "../store/useClientStore";

export const useSaveClient = () => {
    const createClient = useClientStore((state) => state.createClient);
    const updateClient = useClientStore((state) => state.updateClient);

    const saveClient = async (data, clientId = null) => {
        // Estructuramos el payload mapeando los campos primitivos y la dirección por defecto
        const payload = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            birthdate: new Date(data.birthdate).toISOString(),
            gender: data.gender,
            addresses: [
                {
                    alias: data.addressAlias || "Casa",
                    addressLine: data.addressLine,
                    houseNumber: data.houseNumber,
                    securityInfo: data.securityInfo || "",
                    reference: data.reference || "",
                    isDefault: true
                }
            ]
        };

        if (clientId) {
            // Agregamos el _id al payload ya que tu ruta de update es general (PUT /update)
            await updateClient({ _id: clientId, ...payload });
        } else {
            await createClient(payload);
        }
    };

    return { saveClient };
};