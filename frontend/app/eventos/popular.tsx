import { ScrollView, View } from "react-native";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { getEventosDelMes } from "@/services/eventosService";
import Evento from "@/components/Evento";
import React from "react";
const popular = () => {
    const [eventos, setEventos] = useState<any>([]);
    const fetch = async () => {
        try {
            const res = await getEventosDelMes();

            setEventos([...res, ...res, ...res]);
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
                <View
                    style={{
                        flexWrap: "wrap",
                        flexDirection: "row",
                        padding: "auto",
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        alignContent: "space-around",
                        gap: 5,
                        justifyContent: "center"
                    }}
                >
                    {eventos.map((evento: any, index: any) => (
                        <Evento evento={evento} key={index} />
                    ))}
                </View>
            </ScrollView>
        </>
    );
};

export default popular;
