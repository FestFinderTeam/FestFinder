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
    precio__max?: number;
    direccion?: number
    fecha_inicio?: any
    puntuacion?: string;
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
            <ImageBackground
                resizeMode="cover"
                source={{ uri: `${evento.logo}` }}
                style={{
                    width: 150,
                    height: 200,
                    borderRadius: 10,
                    overflow: "hidden",
                    alignItems: "flex-end", // Alinea contenido del View a la derecha
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
                        marginRight: 5, // Espacio desde el borde derecho
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
                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        padding: 5,
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontFamily: "Poppins-Regular",
                            textAlign: "center",
                        }}
                    >
                        {evento.nombre}
                    </Text>
                    <Text
                        style={{
                            color: "white",
                            textAlign: "center",
                        }}
                    >
                        <FontAwesome name="clock-o" color={"yellow"} />
                        {evento.horario_fin}
                    </Text>
                </View>
            </ImageBackground>
        </Link>
    );
};

export default Evento;
