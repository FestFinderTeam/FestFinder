import { ScrollView, View } from "react-native";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { getEventosDelMes } from "@/services/eventosService";
import Evento from "@/components/Evento";
import React from "react";
import { getEstablecimientos } from "@/services/establecimientosServices";
import Establecimiento, { type Place } from "@/components/Establecimiento";
const popular = () => {
    const [establecimientos, setEstablecimientos] = useState<any>([]);
    const fetch = async () => {
        try {
            const res = await getEstablecimientos();

            setEstablecimientos([...res, ...res, ...res]);
        } catch (e) {
            console.error("error al obtener los eventos ", e);
        }
    };
    useEffect(() => {
        fetch();
    }, []);
    return (
        <>
            <Header title="Lugares populares" />
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
                        justifyContent: "center",
                        paddingTop: 25
                    }}
                >
                    {establecimientos.map(
                        (establecimiento: Place, index: any) => (
                            <Establecimiento
                                establecimiento={establecimiento}
                                key={index}
                            />
                        )
                    )}
                </View>
            </ScrollView>
        </>
    );
};

export default popular;
