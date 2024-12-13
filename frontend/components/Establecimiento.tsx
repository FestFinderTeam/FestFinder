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
                source={
                    establecimiento.logo
                        ? { uri: establecimiento.logo }
                        : require("../assets/images/default.jpg")
                }
                style={{
                    width: 150,
                    height: 200,
                    borderRadius: 10,
                    overflow: "hidden",
                    minWidth: "100%",
                }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "column",
                            backgroundColor: "#0000007f",
                            padding: 5,
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontFamily: "Poppins-Regular",
                                textAlign: "center",
                                width: "100%",
                                borderRadius: 5,
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
                            <FontAwesome name="star" color={"yellow"} />{" "}
                            {Math.round(establecimiento.calificacion * 10) / 10}{" "}
                            / 5
                        </Text>
                    </View>
                </View>
            </ImageBackground>
        </Link>
    );
};

export default Establecimiento;
