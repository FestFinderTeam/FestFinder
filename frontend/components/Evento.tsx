import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, type Href } from "expo-router";
import React from "react";
import { ImageBackground, Text, View } from "react-native";

export type EventoType = {
    id_evento: number;
    nombre: string;
    logo: any;
    fecha_final: any;
    horario_fin: any;
    precio__min?: number;
    horario_inicio: any;
    precio__max?: number;
    direccion?: number
    fecha_inicio?: any
    puntuacion?: string;
    id_establecimiento_detail: any
};
interface Props {
    evento: EventoType;
}

const Evento = ({ evento }: Props) => {
    return (
        <Link
            href={("/eventos/" + evento.id_evento) as Href}
            style={{ paddingHorizontal: 5, marginBottom: 15 }}
        >
            <View
                style={{
                    alignItems: "center", 
                    width: 150,
                }}
            >
                <ImageBackground
                    resizeMode="cover"
                    source={evento.logo ? { uri: evento.logo } : require('../assets/images/default.jpg')}
                    style={{
                        width: 150,
                        height: 200,
                        borderRadius: 10,
                        overflow: "hidden",
                        alignItems: "flex-end",
                    }}
                >
                    <View
                        style={{
                            position: "absolute", 
                            top: 5, 
                            right: 5, 
                            backgroundColor: "white",
                            padding: 3,
                            borderRadius: 10,
                            alignItems:"center",
                            width: "35%", 
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: "bold",
                            }}
                        >
                            {new Date(evento.fecha_inicio).toLocaleDateString("es-ES", {
                                day: "numeric",
                            })}
                        </Text>
                        <Text style={{ fontSize: 12 }}>
                            {new Date(evento.fecha_inicio).toLocaleDateString("es-ES", {
                                month: "short",
                            })}
                        </Text>
                    </View>
                </ImageBackground>
                <Text
                    style={{
                        color: "black",
                        fontFamily: "Poppins-Regular",
                        textAlign: "center",
                        marginTop: 5,
                    }}
                    numberOfLines={1} 
                    ellipsizeMode="tail" 
                >
                    {evento.nombre.length > 32 ? evento.nombre.slice(0, 32) + "..." : evento.nombre}
                </Text>
            </View>
        </Link>
    );
};

export default Evento;
