const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getAsistenciasPorUsuario = async (id:string) => {
    try {
        const response = await fetch(`${API_URL}/api/asistencias/usuario/${id}/`);
        if (!response.ok) {
            throw new Error("Error al recuperar las asistencias del usuario");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getAsistenciasPorEvento = async (id:string) => {
    try {
        const response = await fetch(`${API_URL}/api/asistencias/evento/${id}/`);
        if (!response.ok) {
            throw new Error("Error al recuperar las asistencias al evento");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};


export const registrarAsistencia = async (  usuario: string, 
                                            evento: string, 
                                         ) => {
    try {
        const body: { [key: string]: any } = {  id_usuario_fk: usuario, 
                                                id_evento_asistido_fk: evento
                                            }; 
        
        const response = await fetch(`${API_URL}/api/registrar-asistencia/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        
        if (!response.ok) {
            console.error("Error al registrar asistencia:", response.status);
            return [];
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al registrar tu asistencia:", error);
        return [];
    }
};



export const marcarInteres = async (    usuario: string, 
                                        evento: string, 
                                    ) => {
    try {
        const body: { [key: string]: any } = {  id_usuario: usuario, 
                                                id_evento: evento
                                            }; 
        
        const response = await fetch(`${API_URL}/api/registrar-interes/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        
        if (!response.ok) {
            console.error("Error al marcar interes en el evento:", response.status);
            return [];
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al marcar interes en el evento:", error);
        return [];
    }
};


export const quitarInteres = async (usuario:string, evento:string) => {
    try {
        const response = await fetch(`${API_URL}/api/interes/quitar/${usuario}/${evento}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Error al quitar el interés:", response.status);
            return { success: false, message: "No se pudo eliminar el interés" };
        }

        const data = await response.json();
        return { success: true, message: data.message || "Interés eliminado con éxito" };
    } catch (error) {
        console.error("Error al quitar el interés:", error);
        return { success: false, message: "Error en la conexión" };
    }
};



export const calificarEvento = async (  usuario: string, 
                                        evento: string,
                                        puntuacion: number, 
                                        comentario: string,
                                    ) => {
    try {
        const body: { [key: string]: any } = { 
                                                usuario: usuario,
                                                evento: evento, 
                                                puntuacion: puntuacion, 
                                                comentario: comentario
                                            }; 
        
        const response = await fetch(`${API_URL}/api/registrar-valoracion-evento/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        
        if (!response.ok) {
            console.error("Error al calificar el evento:", response.status);
            return [];
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al calificar el evento:", error);
        return [];
    }
};


export const getValoracionesPorEvento = async (id:string) => {
    try {
        const response = await fetch(`${API_URL}/api/valoraciones_eventos/evento/${id}/`);
        if (!response.ok) {
            throw new Error("Error al recuperar las valoraciones del evento");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};