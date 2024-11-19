import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import SearchHeader, { filterSearch } from "@/components/SearchHeader";
import type { EventoType } from "@/components/Evento";
import Establecimiento, { type Place } from "@/components/EstablecimientoExtra";
import { filtrarEstablecimientos, getEstablecimientos } from "@/services/establecimientosServices";
import { filtrarEventos, getEventosDelMes } from "@/services/eventosService";
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
        const res = await getEventosDelMes('Cochabamba');
        setEventos(res);
    };
    useEffect(() => {
        fetchEventos();
        fetchEstablecimientos();
    }, []);

    const handleSearch = async () => {
        console.log("Buscando", search);
        try {
            if (filtro === "locales") {
                const establecimientosFiltrados = await filtrarEstablecimientos(
                    search || null, // Nombre
                    null,           // Tipos (opcional, no implementado aún)
                    null,           // Rango de precios (opcional, no implementado aún)
                    "Cochabamba" // Cambiar por la ciudad seleccionada
                );
                setEstablecimientos(establecimientosFiltrados);
            }

            if (filtro === "eventos") {
                const eventosFiltrados = await filtrarEventos(
                    search || null, // Nombre
                    null,           // Géneros
                    null,           // Fecha actual 
                    "Cochabamba" // Cambiar por la ciudad seleccionada
                );
                setEventos(eventosFiltrados);
            }
        } catch (error) {
            console.error("Error al buscar:", error);
        }
    };

    return (
        <>
            <SearchHeader
                setSearch={setSearch}
                handleSearch={handleSearch}
                filtro={filtro}
                setFilter={setFiltro}
            />
            <ScrollView>
                {filtro !== "eventos" &&
                    establecimientos.map((establecimiento, index) => (
                        <Establecimiento
                            establecimiento={establecimiento}
                            key={index}
                        />
                    ))}
                {filtro !== "locales" &&
                    eventos.map((evento, index) => (
                        <EventoExtra evento={evento} key={index} />
                    ))}
            </ScrollView>
        </>
    );
};

export default buscar;
