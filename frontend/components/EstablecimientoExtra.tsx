import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, type Href } from "expo-router";
import React from "react";
import { ImageBackground, Text, View, StyleSheet } from "react-native";

export interface Place {
    id: number;
    nombre: string;
    score: number;
    views: number;
    logo: any;
    tipo_fk_detail?: any;
    direccion?: string;
}

interface Props {
    establecimiento: Place;
}

const Establecimiento = ({ establecimiento }: Props) => {
    return (
        <Link
            href={("/places/" + establecimiento.id) as Href}
            style={styles.link}
        >
            <View style={styles.container}>
                <ImageBackground
                    resizeMode="cover"
                    source={{ uri: establecimiento.logo }}
                    style={styles.imageBackground}
                />
                <View style={styles.details}>
                    <Text style={styles.nombre}>{establecimiento.nombre}</Text>
                    <Text style={styles.tipo}>
                    {establecimiento.tipo_fk_detail.nombre_tipo}
                    </Text>
                    <Text style={styles.puntuacion}>
                        <FontAwesome name="star" color="orange" />
                        {` ${establecimiento.score} / 10`}
                    </Text>
                    <Text style={styles.puntuacion}>
                        <FontAwesome name="circle" color="purple" />
                        {" " + establecimiento.direccion}</Text>
                </View>
            </View>
        </Link>
    );
};

const styles = StyleSheet.create({
    link: {
        marginLeft: "3%",
        marginBottom: 15,
    },
    container: {
        flexDirection: "row", // Para alinear imagen y detalles en una fila
        alignItems: "center",
    },
    imageBackground: {
        width: 100,
        height: 100,
        borderRadius: 10,
        overflow: "hidden",
    },
    details: {
        marginLeft: 10,
        flex: 1,
    },
    nombre: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
    tipo: {
        fontSize: 14,
        color: "gray",
    },
    puntuacion: {
        fontSize: 14,
        color: "gray",
        marginTop: 5,
    },
});

export default Establecimiento;
