import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import SearchHeader, { filterSearch } from "@/components/SearchHeader";
import type { EventoType } from "@/components/Evento";
import Establecimiento, { type Place } from "@/components/EstablecimientoExtra";
import { getEstablecimientos } from "@/services/establecimientosServices";
import { getEventosDelMes } from "@/services/eventosService";
import EventoExtra from "@/components/EventoExtra";

const buscar = () => {
    const [establecimientos, setEstablecimientos] = useState<Place[]>([]);
    const [eventos, setEventos] = useState<EventoType[]>([]);
    const [search, setSearch] = useState("");
    const [filtro, setFiltro] = useState<filterSearch>("todo");

    const fetchEstablecimientos = async () => {
        try {
            const res = await getEstablecimientos();
            setEstablecimientos(res);
        } catch (e) {
            console.error("error al obtener los eventos ", e);
        }
    };
    const fetchEventos = async () => {
        const res = await getEventosDelMes();
        setEventos(res);
    };
    useEffect(() => {
        fetchEventos();
        fetchEstablecimientos();
    }, []);

    const handleSearch = () => {
        console.log("Buscando", search);
    };

    return (
        <>
            <SearchHeader
                setSearch={setSearch}
                handleSearch={handleSearch}
                setFilter={setFiltro}
            />
            <ScrollView>
                {(filtro === "todo" || filtro === "locales") &&
                    establecimientos.map((establecimiento, index) => (
                        <Establecimiento
                            establecimiento={establecimiento}
                            key={index}
                        />
                    ))}
                {(filtro === "todo" || filtro === "eventos") &&
                    eventos.map((evento, index) => (
                        <EventoExtra evento={evento} key={index} />
                    ))}
            </ScrollView>
        </>
    );
};

export default buscar;
