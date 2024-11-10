import { ScrollView, View, Text, StyleSheet } from "react-native";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { getEventosDelMes } from "@/services/eventosService";
import Evento from "@/components/Evento";
import React from "react";
import { getEstablecimientos } from "@/services/establecimientosServices";
import Establecimiento, { type Place } from "@/components/EstablecimientoExtra";
import LoadingScreen from "@/components/Loading";

type Establecimiento = {
    id: number;
    nombre: string;
    direccion?: string;
    descripcion?: string;
    tipo_fk?: any;
    nombre_tipo?: string;
    nro_ref?: string;
    banner?: string;
    logo?: string;
    puntuacion?: number;
    etiquetas?: any;
};

const popular = () => {
    const [loading, setLoading] = useState(false)
    const [establecimientos, setEstablecimientos] = useState<any>([]);
    const fetch = async () => {
        setLoading(true)
        try {
            const res = await getEstablecimientos();

            setEstablecimientos([...res]);
        } catch (e) {
            console.error("error al obtener los eventos ", e);
        }
        setLoading(false)
    };
    useEffect(() => {
        fetch();
    }, []);
    if(loading) return <LoadingScreen/>
    return (
        <>
            <Header title="Lugares populares" />
            <ScrollView>
                <Text style={[styles.textoTitulo, { marginTop: "5%" }]}>
                    Lugares populares en Cochabamba
                </Text>
                <View
                    style={{
                        flexDirection: "column", 
                        alignItems: "flex-start", 
                        paddingTop: 25,
                        width: "100%",
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
