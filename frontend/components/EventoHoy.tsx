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
    direccion?: number;
    fecha_inicio?: any;
    puntuacion?: string;
    horario_inicio: any;
};
interface Props {
    evento: EventoType;
}

const Evento = ({ evento }: Props) => {
    return (
        <Link
            href={("/eventos/" + evento.id_evento) as Href}
            style={{ paddingHorizontal: 5 }}
        >
            <View
                style={{
                    alignItems: "center",
                    width: 150,
                }}
            >
                <ImageBackground
                    resizeMode="cover"
                    source={
                        evento.logo
                            ? { uri: evento.logo }
                            : require("../assets/images/default.jpg")
                    }
                    style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 10,
                        overflow: "hidden",
                        justifyContent: "flex-end",
                    }}
                >
                    <View
                        style={{
                            justifyContent: "flex-end",
                            alignItems: "center",
                            padding: 10,
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
                            {" " + evento.horario_inicio}
                        </Text>
                    </View>
                </ImageBackground>

                <Text
                    style={{
                        color: "black",
                        fontFamily: "Poppins-Regular",
                        textAlign: "center",
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {evento.nombre}
                </Text>
            </View>
        </Link>
    );
};

export default Evento;
