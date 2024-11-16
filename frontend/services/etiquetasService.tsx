// src/services/categoriasService.js
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getEtiquetas = async () => {
    try {
        const response = await fetch(`${API_URL}/api/etiquetas/`);
        if (!response.ok) {
            throw new Error("Error al recuperar las etiquetas");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const buscarEtiquetas = async (texto: string) => {
    console.log('intento');
    try {
        const url = new URL(`${API_URL}/api/etiquetas/`);
        url.searchParams.append('texto', texto);  
        console.log('enviado');

        const response = await fetch(url.toString());  
        console.log('recibido');
        if (!response.ok) {
            throw new Error("Error al recuperar las etiquetas");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};
