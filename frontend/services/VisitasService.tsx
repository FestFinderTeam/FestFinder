const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getAsistenciasPorUsuario = async (id:string) => {
    try {
        const response = await fetch(`${API_URL}/api/visitas/usuario/${id}/`);
        if (!response.ok) {
            throw new Error("Error al recuperar las visitas del usuario");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getVisitasPorLocal = async (id:string) => {
    try {
        const response = await fetch(`${API_URL}/api/visitas/establecimiento/${id}/`);
        if (!response.ok) {
            throw new Error("Error al recuperar las visitas al establecimiento");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};


export const registrarVisita = async (  usuario: string, 
                                        establecimiento: string, 
                                         ) => {
    try {
        const body: { [key: string]: any } = {  id_usuario_fk: usuario, 
                                                id_establecimiento_visitado_fk: establecimiento
                                            }; 
        
        const response = await fetch(`${API_URL}/api/registrar-visita/`, {
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


export const calificarEstablecimiento = async ( usuario : string, 
                                                establecimiento: string,
                                                puntuacion: number, 
                                                comentario: string,
                                    ) => {
    try {
        const body: { [key: string]: any } = { 
                                                usuario: usuario,
                                                establecimiento: establecimiento,
                                                puntuacion: puntuacion, 
                                                comentario: comentario
                                            }; 
        
        const response = await fetch(`${API_URL}/api/registrar-valoracion/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        
        if (!response.ok) {
            console.error("Error al calificar el local:", response.status);
            return [];
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al calificar el local:", error);
        return [];
    }
};


export const getValoracionesPorLocal = async (id:string) => {
    try {
        const response = await fetch(`${API_URL}/api/valoraciones/establecimiento/${id}/`);
        console.log('ya se mando');
        
        if (!response.ok) {
            throw new Error("Error al recuperar las valoraciones del establecimiento");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};