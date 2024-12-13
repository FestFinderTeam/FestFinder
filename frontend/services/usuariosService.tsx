const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const updateUsuario = async (id: string, data: FormData) => {
    try {
        const response = await fetch(`${API_URL}/api/usuario/modificar/${id}/`, {
            method: "PUT",
            body: data,
        });

        if (!response.ok) {
            console.error("Error al actualizar el usuario:", response.status);
            return null;
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        return null;
    }
};


