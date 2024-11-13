export const getDireccion = async (
    latitud: any,
    longitud: any
): Promise<string> => {
    try {
        console.log(latitud, longitud);
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`,
            {
                headers: {
                    "User-Agent": "FestFinder/1.0 (202202136@gmail.com)"
                }
            }
        );
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Error en la respuesta del servidor:", res.status, errorText);
            return "";
        }

        const data = await res.json();

        const address = data.address;
        return `${address.road || ""} ${address.house_number || "S/N"} ,${
            address.city || ""
        }`;
    } catch (e) {
        console.error("Error al obtener la dirección:", e);
    }
    return "";
};
