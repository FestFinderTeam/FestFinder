// src/services/categoriasService.js
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getCategorias = async () => {
    try {
        const response = await fetch(`${API_URL}/api/categorias-establecimientos/`);
        if (!response.ok) {
            throw new Error("Error al recuperar las categorías");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};
