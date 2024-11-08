import Styles from "@/globalStyles/styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, type Href } from "expo-router";
import React from "react";
import { FlatList, ImageBackground, Text, View } from "react-native";

export interface Evento {
    id_evento: number;
    nombre: string;
    logo: any;
    fecha_final: any;
    horario_fin: any;
}
interface Props {
    eventos: Evento[];
}

const ListadoEventosInicio = ({ eventos }: Props) => {
    return (
        <FlatList
            data={eventos}
            style={Styles.slider}
            keyExtractor={(item) => JSON.stringify(item)}
            renderItem={({ item, index }) => (
                <Link
                    href={("/eventos/" + item.id_evento) as Href}
                    key={index}
                    style={{ marginLeft: "3%" }}
                >
                    <ImageBackground
                        resizeMode="cover"
                        source={{ uri: `${item.logo}` }}
                        style={{
                            width: 150,
                            height: 200,
                            borderRadius: 10,
                            overflow: "hidden",
                        }}
                    >
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
                                {item.nombre}
                            </Text>
                            <Text
                                style={{
                                    color: "white",
                                    textAlign: "center",
                                }}
                            >
                                <FontAwesome name="clock-o" color={"yellow"} />
                                {item.horario_fin}
                            </Text>
                        </View>
                    </ImageBackground>
                </Link>
            )}
            horizontal
        />
    );
};

export default ListadoEventosInicio;
