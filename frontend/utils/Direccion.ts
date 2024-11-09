export const getDireccion = async (
    latitud: any,
    longitud: any
): Promise<string> => {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`
        );
        if (res.ok) {
            const data = await res.json();
            const address = data.address;
            return `${address.road || ""} ${address.house_number || "S/N"} ,${
                address.city || ""
            }`;
        }
    } catch (e) {
        console.error("error al obtener la direccion ", e);
    }
    return "";
};
