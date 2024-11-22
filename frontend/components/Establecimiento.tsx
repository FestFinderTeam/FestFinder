import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, type Href } from "expo-router";
import React from "react";
import { ImageBackground, Text, View } from "react-native";
export interface Place {
    id: number;
    nombre: string;
    calificacion: number;
    views: number;
    logo: any;
}

interface Props {
    establecimiento: Place;
}

const Establecimiento = ({ establecimiento }: Props) => {
    return (
        <Link
            href={("/places/" + establecimiento.id) as Href}
            style={{ paddingHorizontal: 5, marginBottom: 15 }}
        >
            <ImageBackground
                resizeMode="cover"
                source={establecimiento.logo ?{ uri: establecimiento.logo } : require('../assets/images/default.jpg')}
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
                            backgroundColor:"black",
                            borderRadius:5,
                        }}
                    >
                        {establecimiento.nombre}
                    </Text>
                    <Text
                        style={{
                            color: "white",
                            textAlign: "center",
                        }}
                    >
                        <FontAwesome name="star" color={"yellow"} />
                        {establecimiento.calificacion} / 5
                    </Text>
                </View>
            </ImageBackground>
        </Link>
    );
};

export default Establecimiento;
