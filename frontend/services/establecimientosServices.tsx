const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getEstablecimientos = async (id_tipo = null) => {
    console.log(API_URL);
    try {
        const url = id_tipo 
            ? `${API_URL}/api/establecimientos/?tipo_fk=${id_tipo}` 
            : `${API_URL}/api/establecimientos/`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error al recuperar los lugares");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching establecimientos:", error);
        return [];
    }
};


export const getEstablecimientoPorId = async (id: any) => {
    console.log(API_URL);
    try {
        const url = `${API_URL}/api/establecimiento/est_id/${id}/`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error al recuperar el lugar");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching establecimiento:", error);
        return [];
    }
};

export const getEventosPorEstablecimiento = async (idEstablecimiento: string) => {
    try {
        const response = await fetch(`${API_URL}/api/eventos/establecimiento/${idEstablecimiento}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            console.error("Error al obtener eventos:", response.status);
            return null;
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error al obtener eventos:", error);
        return null;
    }
};