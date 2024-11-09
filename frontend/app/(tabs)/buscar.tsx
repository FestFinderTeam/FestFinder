import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import SearchHeader from "@/components/SearchHeader";
import type { EventoType } from "@/components/Evento";
import Establecimiento, { type Place } from "@/components/EstablecimientoExtra";
import { getEstablecimientos } from "@/services/establecimientosServices";
import { getEventosDelMes } from "@/services/eventosService";
import EventoExtra from "@/components/EventoExtra";

const buscar = () => {
    const [establecimientos, setEstablecimientos] = useState<Place[]>([]);
    const [eventos, setEventos] = useState<EventoType[]>([]);
    const [search, setSearch] = useState("");

    console.log("Buscador");
    const fetchEstablecimientos = async () => {
        // Fetch establecimientos de la API con el nombre
        // Example: fetch(`${API_URL}/establecimientos?nombre=${nombre}`)
        //...
        try {
            const res = await getEstablecimientos();
            console.log(res);
            setEstablecimientos([...res, ...res, ...res, ...res]);
        } catch (e) {
            console.error("error al obtener los eventos ", e);
        }
    };
    const fetchEventos = async () => {
        const res = await getEventosDelMes();
        setEventos([...res, ...res, ...res]);
    };
    useEffect(() => {
        fetchEventos();
        fetchEstablecimientos();
    }, []);

    return (
        <View>
            <SearchHeader />
            <ScrollView>
                {establecimientos.map((establecimiento, index) => (
                    <Establecimiento
                        establecimiento={establecimiento}
                        key={index}
                    />
                ))}
                {eventos.map((evento, index) => (
                    <EventoExtra evento={evento} key={index} />
                ))}
            </ScrollView>
        </View>
    );
};

export default buscar;
