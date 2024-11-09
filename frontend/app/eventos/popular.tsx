    import {
        ImageBackground,
        Pressable,
        ScrollView,
        Text,
        View,
        StyleSheet
    } from "react-native";
    import Header from "@/components/Header";
    import { useEffect, useState } from "react";
    import { getEventosDelMes } from "@/services/eventosService";
    import React from "react";
    import { router, type Href } from "expo-router";
    import Evento from "@/components/EventoExtra";
    import type { EventoType } from "@/components/Evento";

    type Evento = {
        id_evento: number;
        nombre: string;
        logo: any;
        fecha_final: any;
        horario_fin: any;
        precio__min?: number;
        precio__max?: number;
        direccion?: number
        fecha_inicio?: any
        puntuacion?: string;
    }
    const popular = () => {
        const [eventos, setEventos] = useState<EventoType[]>([]);
        const fetch = async () => {
            try {
                const res = await getEventosDelMes();

                setEventos([...res]);
            } catch (e) {
                console.error("error al obtener los eventos ", e);
            }
        };
        useEffect(() => {
            fetch();
        }, []);
        return (
            <>
                <Header title="Eventos populares" />
                <ScrollView>
                    <Text style={[styles.textoTitulo, { marginTop: "5%" }]}>
                        Eventos populares en Cochabamba
                    </Text>
                    <View
                        style={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            paddingTop: 25,
                            width: "100%",
                        }}
                    >
                        {
                        eventos.map((evento, index) => (
                            <Evento evento={evento} key={index} />
                        ))}
                    </View>
                </ScrollView>
            </>
        );
    };
    const styles = StyleSheet.create({
        textoTitulo: {
            fontWeight: "bold" as "bold",
            fontSize: 18,
            marginLeft: "3%",
        },
        slider: {
            marginLeft: "5%",
            marginTop: "3%",
        },
    });

    export default popular;
