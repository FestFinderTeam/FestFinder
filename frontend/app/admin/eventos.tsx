import Header from "@/components/Header";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSession } from "@/hooks/ctx";
import { router, type Href } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Pressable, Text, View } from "react-native";
import type { Evento } from "./myplace";
import Styles from "@/globalStyles/styles";
import { getEventosDelMes,  } from "@/services/eventosService";
import { getEventosPorEstablecimiento } from "@/services/establecimientosServices";

const image_default = require("../../assets/images/default_image.png");

const eventos = () => {
    const { session} = useSession();
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [eventosActivos, setEventosActivos] = useState<Evento[]>([]);
    useEffect(() => {
        if(session){
            fetchEventosDelLugar(session?.establecimiento);
        }
    }, [session]);

    const fetchEventosDelLugar = async (establecimiento: string | null) => {
        try {
            const eventos = await getEventosPorEstablecimiento(establecimiento || "");
            setEventos(eventos || []);
            setEventosActivos(eventos || []);
        } catch (error) {
            console.error("Error al obtener eventos:", error);
            setEventos([]);
            setEventosActivos([]);
        }
    };

    return (
        <>
            <Header title="Administrar eventos" />
            {eventosActivos.length > 0 && (
                <>
                    <Text style={[Styles.subtitle, { color: "black", fontWeight: "bold", marginTop: "2%", marginLeft: "2%" }]}>Eventos Activos</Text>
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
                                                borderRadius: 10,
                                                marginTop: "2%",
                                                height: 200,
                                                width: 150,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: "gray", 
                                                marginRight:10,
                                            },
                                        ]}
                                    >
                                        <FontAwesome name="plus" size={50} color="white" />
                                        <Text
                                            style={{
                                                fontFamily: "Poppins-Regular",
                                                width: 150,
                                                textAlign: "center",
                                                color:"white",
                                            }}
                                            numberOfLines={2}
                                        >
                                            Crear un nuevo evento
                                        </Text>
                                    </Pressable>
                                    
                                );
                            } else {
                                return (
                                    <Pressable
                                        onPress={() => {
                                            router.navigate(
                                                ("/editarEvento/" + item.id_evento) as Href
                                            );
                                        }}
                                        style={{
                                            flexDirection: "column",
                                            borderRadius: 150,
                                            marginTop: "2%",
                                            marginRight: 10, 
                                        }}
                                        key={item.id_evento}
                                    >
                                        <ImageBackground
                                            source={
                                                {uri:item.logo ? item.logo : image_default}
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
                                                    {item.fecha_inicio+''}
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
                                                width: 150,
                                                textAlign: "center",
                                            }}
                                            numberOfLines={2}
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
                </>
            )}

            {eventos.length > 0 && (
                <>
                    <Text style={[Styles.subtitle, { color: "black", fontWeight: "bold", marginTop: "2%", marginLeft: "2%" }]}>Todos los Eventos</Text>
                    <FlatList
                        style={{ marginLeft: "4%" }}
                        data={eventos}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => {
                                    router.navigate(
                                        ("editarEvento/" + item.id_evento) as Href
                                    );
                                }}
                                style={{
                                    flexDirection: "column",
                                    borderRadius: 150,
                                    marginTop: "2%",
                                    marginRight: 10,
                                }}
                                key={item.id_evento}
                            >
                                <ImageBackground
                                    source={{uri:item.logo ? item.logo : image_default}}
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
                                            {item.fecha_inicio+''}
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
                                        width: 150,
                                        textAlign: "center",
                                    }}
                                    numberOfLines={2}
                                >
                                    {item.nombre}
                                </Text>
                            </Pressable>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                    />
                </>
            )}
        </>
    );
};

export default eventos;
