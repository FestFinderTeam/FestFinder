const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getEstablecimientos = async () => {
    try {
        const response = await fetch(`${API_URL}/api/establecimientos/`);
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
