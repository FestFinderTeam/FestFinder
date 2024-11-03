import Header from "@/components/Header";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, type Href } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Pressable, Text, View } from "react-native";
import type { Evento } from "./myplace";

const image_default = require("../../assets/images/default_image.png");

const eventos = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [eventosActivos, setEventosActivos] = useState<Evento[]>([]);
    useEffect(() => {
        const eventosActivos = [
            {
                id_evento: 2,
                nombre: "Alice Park-Noche de colores",
                fecha_inicio: new Date("2024-09-02"),
                logo: require("../../assets/images/alice-park-event-1.png"),
            }
        ];
        const eventos = [
            {
                id_evento: 2,
                nombre: "Alice Park-Noche de colores",
                fecha_inicio: new Date("2024-09-02"),
                logo: require("../../assets/images/alice-park-event-1.png"),
            },
            {
                id_evento: 3,
                nombre: "Alice Park - Neon Party",
                fecha_inicio: new Date("2024-09-07"),
                logo: require("../../assets/images/alice-park-event-2.png"),
            },
        ];
        setEventosActivos(eventosActivos);
        setEventos(eventos);
    }, []);
    return (
        <>
            <Header title="Administrar eventos" />
            <Text>Eventos Activos</Text>
            <FlatList
                style={{ marginLeft: "3%" }}
                data={[null, ...eventosActivos]}
                renderItem={({ item }) => {
                    if (item === null) {
                        return (
                            <Pressable
                                onPress={() =>
                                    router.navigate(
                                        "/eventos/crearEvento" as Href
                                    )
                                }
                                style={[
                                    {
                                        flexDirection: "column",
                                        flex: 1,
                                        borderRadius: 150,
                                        marginTop: "2%",
                                        height: 200,
                                        width: 150,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    },
                                ]}
                            >
                                <FontAwesome name="plus" size={50} />
                            </Pressable>
                        );
                    } else {
                        return (
                            <Pressable
                                onPress={() => {
                                    router.navigate(
                                        ("/eventos/" + item.id_evento) as Href
                                    );
                                }}
                                style={{
                                    flexDirection: "column",
                                    flex: 1,
                                    borderRadius: 150,
                                    marginTop: "2%",
                                }}
                                key={item.id_evento}
                            >
                                <ImageBackground
                                    source={
                                        item.logo ? item.logo : image_default
                                    }
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
                                            {item.fecha_inicio.getDate()}
                                        </Text>
                                        <Text style={{ fontSize: 12 }}>
                                            {item.fecha_inicio.toLocaleString(
                                                "es-ES",
                                                { month: "short" }
                                            )}
                                        </Text>
                                    </View>
                                </ImageBackground>
                                <Text
                                    style={{
                                        fontFamily: "Poppins-Regular",
                                    }}
                                >
                                    {item.nombre}
                                </Text>
                            </Pressable>
                        );
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
                horizontal
            />
            <Text>Todos los Eventos</Text>
            <FlatList
                style={{ marginLeft: "3%" }}
                data={eventos}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => {
                            router.navigate(
                                ("/eventos/" + item.id_evento) as Href
                            );
                        }}
                        style={{
                            flexDirection: "column",
                            flex: 1,
                            borderRadius: 150,
                            marginTop: "2%",
                        }}
                        key={item.id_evento}
                    >
                        <ImageBackground
                            source={item.logo ? item.logo : image_default}
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
                                    {item.fecha_inicio.getDate()}
                                </Text>
                                <Text style={{ fontSize: 12 }}>
                                    {item.fecha_inicio.toLocaleString("es-ES", {
                                        month: "short",
                                    })}
                                </Text>
                            </View>
                        </ImageBackground>
                        <Text
                            style={{
                                fontFamily: "Poppins-Regular",
                            }}
                        >
                            {item.nombre}
                        </Text>
                    </Pressable>
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal
            />
        </>
    );
};

export default eventos;
