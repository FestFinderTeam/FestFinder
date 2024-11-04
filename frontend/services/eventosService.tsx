const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getEventosDelMes = async () => {
    try {
        console.log(new Date().toISOString().split("T")[0] + "");

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
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getEventosDelDia = async () => {
    try {
        console.log(new Date().toISOString().split("T")[0] + "");
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
        console.log(data);
        return data;
    } catch (error) {
        //Alert.alert("Error", "No se pudo obtener los eventos del día");
        console.error(error);
        return [];
    }
};