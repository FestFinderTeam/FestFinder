import { useState } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchEventosDelMes = async () => {
    const [eventosDelMes, setEventosDelMes] = useState([]);
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
        setEventosDelMes(data);
    } catch (error) {
        //Alert.alert("Error", "No se pudo obtener los eventos del mes");
        console.error("Error fetching eventos del mes:", error);
    }
    return eventosDelMes;
};

export const fetchEventosDelDia = async () => {
    const [eventosDelDia, setEventosDelDia] = useState([]);

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
        setEventosDelDia(data);
    } catch (error) {
        //Alert.alert("Error", "No se pudo obtener los eventos del día");
        console.error("Error fetching eventos del día:", error);
    }

    return eventosDelDia;
};