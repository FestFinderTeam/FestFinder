import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, type Href } from "expo-router";
import React from "react";
import { ImageBackground, Text, View, StyleSheet } from "react-native";
import type { EventoType } from "./Evento";

interface Props {
    evento: EventoType;
}

const EventoExtra = ({ evento }: Props) => {
    return (
        <Link
            href={("/places/" + evento.id_evento) as Href}
            style={styles.link}
        >
            <View style={styles.container}>
                <ImageBackground
                    resizeMode="cover"
                    source={{ uri: evento.logo }}
                    style={styles.imageBackground}
                />
                <View style={styles.details}>
                    <Text style={styles.nombre}>{evento.nombre}</Text>
                    <Text style={styles.puntuacion}>
                        <FontAwesome name="star" color="orange" />
                        {` ${evento.puntuacion} / 10`}
                    </Text>
                    
                    <Text style={styles.tipo}>
                    {evento.fecha_final}
                    </Text>
                    <Text style={styles.puntuacion}>
                        <FontAwesome name="circle" color="purple" />
                        {" " + evento.direccion}</Text>
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

export default EventoExtra;
