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
        const url = `http://192.168.100.3:8000/api/establecimiento/est_id/${id}/`;

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

