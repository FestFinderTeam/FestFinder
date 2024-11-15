const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getEventosDelMes = async () => {
    try {
        //console.log(new Date().toISOString().split("T")[0] + "");

        const response = await fetch(`${API_URL}/api/eventos_mes/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fecha: new Date().toISOString().split("T")[0],
            }), // Envía la fecha actual
        });
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getEventosDelDia = async () => {
    try {
        //console.log(new Date().toISOString().split("T")[0] + "");
        const response = await fetch(`${API_URL}/api/eventos_hoy/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fecha: new Date().toISOString().split("T")[0],
            }), // Envía la fecha actual
        });
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        //Alert.alert("Error", "No se pudo obtener los eventos del día");
        console.error(error);
        return [];
    }
};

export const getEventoPorID = async (id: string) => {
    try {
        //console.log(API_URL+`/api/eventos/`+id+`/`);
        const response = await fetch(`${API_URL}/api/eventos/${id}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            console.error("Error al obtener el evento:", response.status);
            return null;
        }
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error("Error al obtener el evento:", error);
        return null;
    }
};

export const getCategoriasEventos = async () => {
    try {
        const response = await fetch(`${API_URL}/api/generos-evento/`);
        if (!response.ok) {
            throw new Error("Error al recuperar las categorias de eventos");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const filtrarEventos = async (   nombre: string | null = null, 
                                        id_genero_fk: [string] | null = null, 
                                        fecha_actual: string | null = null, 
                                        ciudad: string) => {
    try {
        const response = await fetch(`${API_URL}/api/eventos/filtro/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre,
                id_genero_fk,
                fecha_actual,
                ciudad
            }),
        });
        
        if (!response.ok) {
            console.error("Error al filtrar eventos:", response.status);
            return [];
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al filtrar eventos:", error);
        return [];
    }
};
