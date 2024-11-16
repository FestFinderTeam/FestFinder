const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getEstablecimientos = async (id_tipo: string | null = null) => {
    try {
        const url = id_tipo
            ? `${API_URL}/api/establecimientos/tipo/${id_tipo}/`
            : `${API_URL}/api/establecimientos/`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error al recuperar los lugares");
        }
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching establecimientos:", error);
        return [];
    }
};

export const getEstablecimientoPorId = async (id: any) => {
    try {
        const url = `${API_URL}/api/establecimiento/est_id/${id}/`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error al recuperar el lugar");
        }
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching establecimiento:", error);
        return [];
    }
};

export const getEstablecimientosSimilares = async (id: any) => {
    try {
        const url = `${API_URL}/api/establecimientos-similares/${id}/`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error al recuperar lugares parecidos");
        }
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching establecimiento:", error);
        return [];
    }
};

export const getEstablecimientoPorPropietario = async (id: any) => {
    try {
        const url = `${API_URL}/api/establecimiento/propietario/${id}/`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error al recuperar tu lugar");
        }
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching establecimiento:", error);
        return [];
    }
};

export const getEventosPorEstablecimiento = async (
    idEstablecimiento: string
) => {
    try {
        const response = await fetch(
            `${API_URL}/api/eventos/establecimiento/${idEstablecimiento}/`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Error al obtener eventos: ${response.status} - ${errorMessage}`);
            return null;
        }
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error("Error al obtener eventos:", error);
        return null;
    }
};

export const filtrarEstablecimientos = async (   
                                        nombre: string | null = null, 
                                        tipos: string[] | null = null, 
                                        rango_de_precios: string | null = null, 
                                        ciudad: string
                                    ) => {
    try {
        const body: { [key: string]: any } = { ciudad }; // 'ciudad' siempre es obligatorio

        if (nombre) {
            body.nombre = nombre;
        }
        if (tipos) {
            body.tipos = tipos;
        }
        if (rango_de_precios) {
            body.rango_de_precios = rango_de_precios;
        }
        console.log(ciudad + ' - ' + nombre + ' - ' + tipos?.toString() + ' - '+ rango_de_precios)

        const response = await fetch(`${API_URL}/api/establecimientos/filtro/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        
        if (!response.ok) {
            console.error("Error al filtrar establecimientos:", response.status);
            return [];
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al filtrar eventos:", error);
        return [];
    }
};



