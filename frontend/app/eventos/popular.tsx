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
const popular = () => {
    const [eventos, setEventos] = useState<any>([]);
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
                        marginTop: 15,
                        flexWrap: "wrap",
                        flexDirection: "row",
                        padding: "auto",
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        alignContent: "space-around",
                        gap: 5,
                        justifyContent: "center",
                    }}
                >
                    {eventos.map((evento: any, index: any) => (
                        <Pressable
                            onPress={() => {
                                router.navigate(
                                    ("/eventos/" + evento.id_evento) as Href
                                );
                            }}
                            style={{
                                borderRadius: 150,
                                marginTop: "2%",
                                marginRight: 10,
                            }}
                            key={index}
                        >
                            <ImageBackground
                                source={{ uri: evento.logo }}
                                style={{
                                    height: 200,
                                    width: 150,
                                    borderRadius: 150,
                                    alignItems: "flex-end",
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: "white",
                                        width: "35%",
                                        alignItems: "center",
                                        padding: 3,
                                        borderRadius: 10,
                                        marginTop: 5,
                                        marginRight: 5,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 24,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {new Date(
                                            evento.fecha_inicio
                                        ).toLocaleDateString("es-ES", {
                                            day: "numeric",
                                        })}
                                    </Text>
                                    <Text style={{ fontSize: 12 }}>
                                        {new Date(
                                            evento.fecha_inicio
                                        ).toLocaleDateString("es-ES", {
                                            month: "short",
                                        })}
                                    </Text>
                                </View>
                            </ImageBackground>
                            <Text
                                style={{
                                    fontFamily: "Poppins-Regular",
                                    width: 150,
                                    textAlign: "center",
                                }}
                                numberOfLines={2}
                            >
                                {evento.id_genero_fk.titulo_genero}
                            </Text>
                        </Pressable>
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
