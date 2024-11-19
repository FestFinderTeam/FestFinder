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
            <View
                style={{
                    alignItems: "center", // Centra todo el contenido
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
                        justifyContent: "space-between", // Asegura que el contenido se distribuya correctamente
                    }}
                >
                    <View
                        style={{
                            width: "35%",
                            alignItems: "center",
                            padding: 3,
                            borderRadius: 10,
                            marginTop: 5,
                            marginRight: 5,
                        }}
                    >
                    </View>
                    <View
                        style={{
                            justifyContent: "flex-end",
                            alignItems: "center",
                            paddingBottom: 10,
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                textAlign: "center",
                                backgroundColor: "black",
                                borderRadius: 10,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                fontSize: 15,
                            }}
                        >
                            <FontAwesome name="clock-o" color={"yellow"} />
                            {" " + evento.horario_fin}
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
